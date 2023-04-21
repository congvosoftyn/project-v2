import { Injectable } from '@nestjs/common';
import { ProductEntity } from 'src/entities/Product.entity';
import { CategoryEntity } from 'src/entities/Category.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { In } from 'typeorm';
import { TaxEntity } from 'src/entities/Tax.entity';

@Injectable()
export class ServiceService {
    getCategories(storeId: number) {
        return CategoryEntity.createQueryBuilder('cat')
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

    async saveService(bodyService: CreateServiceDto, storeId: number) {
        const { staffIds } = bodyService;
        let staffs = await StaffEntity.find({ where: { id: In(staffIds) } });
        let category = await CategoryEntity.findOne({ where: { id: bodyService.categoryId } });
        let taxId = bodyService?.taxId ? bodyService?.taxId : null;
        let tax = null;
        
        if (taxId != null) {
            tax = await TaxEntity.findOne({ where: { id: taxId } });
        }

        return ProductEntity.save(<ProductEntity>{
            name: bodyService.name,
            cost: bodyService.cost,
            price: bodyService.price,
            stocks: bodyService.stocks,
            description: bodyService.description,
            photo: bodyService.photo,
            serviceDuration: bodyService.serviceDuration,
            category,
            staffs, tax
        });
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
