import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceEntity } from 'src/entities/service.entity';
import { CategoryEntity } from 'src/entities/Category.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { In } from 'typeorm';
import { TaxEntity } from 'src/entities/Tax.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QuerySearchPaginationDto } from 'src/shared/dto/query-search-pagination.dto';

@Injectable()
export class ServiceService {
    async getServices(storeId: number, queryService: QuerySearchPaginationDto) {
        const { size, page, keyword } = queryService;
        let query = ServiceEntity.createQueryBuilder('service')
            .leftJoinAndSelect('service.tax', 'tax')
            .leftJoinAndSelect("service.category", "category")
            .where('category.storeId = :storeId and service.actived = true', { storeId })
            .groupBy("service.id, tax.id")
            .take(size)
            .skip(page * size);

        if (keyword) {
            query = query.andWhere('LOWER(service.name) LIKE LOWER(:keywork)', { keywork: `%${keyword}%` })
        }

        const [services, count] = await query.getManyAndCount();

        return new PaginationDto(services, count, page, size)
    }

    async createService(bodyService: CreateServiceDto, storeId: number) {
        const { staffIds } = bodyService;
        let staffs = await StaffEntity.find({ where: { id: In(staffIds), storeId } });
        let category = await CategoryEntity.findOne({ where: { id: bodyService.categoryId, storeId } });
        let taxId = bodyService?.taxId ? bodyService?.taxId : null;
        let tax = null;

        if (taxId && taxId != 0) {
            tax = await TaxEntity.findOne({ where: { id: taxId, storeId } });
        }

        return ServiceEntity.save(<ServiceEntity>{
            name: bodyService.name,
            cost: bodyService.cost,
            price: bodyService.price,
            stocks: bodyService.stocks,
            description: bodyService.description,
            photo: bodyService.photo,
            duration: bodyService.duration,
            category,
            staffs, tax,
        });
    }

    async findByService(id: number) {
        const service = await ServiceEntity.findOne({ where: { id } })
        if (!service) throw new NotFoundException("not found service");
        return service;
    }

    async updateService(id: number, storeId: number, bodyUpdateService: UpdateServiceDto) {
        let service = await this.findByService(id);

        const { staffIds } = bodyUpdateService;
        let staffs = await StaffEntity.find({ where: { id: In(staffIds), storeId } });
        let taxId = bodyUpdateService?.taxId ? bodyUpdateService?.taxId : null;
        let tax = null;

        if (taxId && taxId != 0) {
            tax = await TaxEntity.findOne({ where: { id: taxId, storeId } });
        }

        return ServiceEntity.save(<ServiceEntity>{
            ...service,
            name: bodyUpdateService.name,
            cost: bodyUpdateService.cost,
            price: bodyUpdateService.price,
            stocks: bodyUpdateService.stocks,
            description: bodyUpdateService.description,
            photo: bodyUpdateService.photo,
            duration: bodyUpdateService.duration,
            staffs,
            tax
        });
    }

    deleteService(id: number) {
        return ServiceEntity.delete({ id });
    }

}
