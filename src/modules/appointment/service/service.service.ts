import { Injectable } from '@nestjs/common';
import { ProductEntity } from 'src/entities/Product.entity';
import { ProductCategoryEntity } from 'src/entities/Category.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class ServiceService {
    getCategories(storeId: number) {
        return ProductCategoryEntity.createQueryBuilder('cat')
            .leftJoinAndSelect('cat.products', 'products', 'products.isService = true',)
            .orderBy('cat.orderBy', 'ASC')
            .where({ storeId: storeId, isActive: true })
            .getMany();
    }

    async getServices(storeId: number, search: string, size: number = 50, page: number = 0) {
        let query = ProductEntity.createQueryBuilder('service')
            .leftJoinAndSelect('service.tax', 'tax')
            .where('service.storeId = :storeId AND service.isActive = true AND service.isService = true', { storeId })
            .orderBy('service.id', 'DESC')
            .take(size)
            .skip(page * size);

        if (search) {
            query = query.andWhere('service.name like :keywork', { keywork: `%${search}%` })
        }

        const [services, count] = await query.getManyAndCount();

        return new PaginationDto(services, count, page, size)
    }

    async saveService(service: CreateServiceDto, storeId: number) {
        const { staffs, tax } = service;
        let listStaff = [];
        let staffIds = [];
        let taxId = tax?.id ? tax?.id : null;

        if (staffs?.length > 0) {
            for (let staff of staffs) {
                if (staff.id) {
                    staffIds.push(staff.id);
                } else {
                    staff.storeId = storeId;
                    listStaff.push(staff as StaffEntity);
                }
            }
            listStaff = staffIds.length > 0 ? await StaffEntity.createQueryBuilder('staff').where('staff.id in (:ids)', { ids: staffIds }).getMany() : await StaffEntity.save(listStaff);
            delete service.staffs;
        }

        delete service.tax;

        const newService = service as ProductEntity;
        newService.storeId = storeId;
        newService.isService = true;
        newService.staffs = listStaff;
        newService.taxId = taxId;

        return ProductEntity.save(newService);
    }

    async updateService(id: number, service: ProductEntity) {
        let _service = await ProductEntity.findOne({ where: { id } });
        _service = await ProductEntity.merge(_service, service);
        return ProductEntity.save(_service);
    }

    getStaffsByServices(serviceId: number, search: string) {
        let query = StaffEntity.createQueryBuilder('staff')
            .leftJoin('staff.services', 'services', "services.isService = true")
            .leftJoinAndSelect('staff.workingHours', 'workingHours')
            .leftJoinAndSelect('staff.breakTimes', 'breakTimes')
            .leftJoinAndSelect('staff.timeOffs', 'timeOffs')
            .leftJoinAndSelect('service.tax', 'tax')
            .where('services.id = :serviceId ', { serviceId })

        if (search) {
            query = query.andWhere('staff.name like :keywork', { keywork: `%${search}%` })
        }
        return query.getMany();
    }
}
