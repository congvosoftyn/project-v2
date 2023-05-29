import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceEntity } from 'src/entities/service.entity';
import { CategoryEntity } from 'src/entities/Category.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { Connection, In } from 'typeorm';
import { TaxEntity } from 'src/entities/Tax.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QuerySearchPaginationDto } from 'src/shared/dto/query-search-pagination.dto';
import { InjectConnection } from '@nestjs/typeorm';
import { ISearchService } from './interfaces/search-service.interface';
import { SearchServiceDTO } from './dto/search-service.dto';
import { PackageEntity } from 'src/entities/Package.entity';

@Injectable()
export class ServiceService {
    constructor(@InjectConnection() private readonly connection: Connection) { }

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
            price: bodyService.price,
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
            price: bodyUpdateService.price,
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

    async getSearchServiceWhenCreateBooking(query: SearchServiceDTO, storeId: number) {
        const keyword = query.keyword;
        let pageSize = query.page * query.size;
        let size = query.size;

        const listResultSearch: ISearchService[] = await this.connection.query(`
            select temp.id, temp.isService, temp.name
            from (
                SELECT ser.id, ser.name, cate.storeId, true as isService
                FROM charmsta.service ser
                LEFT JOIN charmsta.category cate ON cate.id = ser.categoryId
                UNION
                SELECT pac.id, pac.name, cate.storeId, false as isService
                FROM charmsta.package pac
                LEFT JOIN charmsta.category cate ON cate.id = pac.categoryId
            ) as temp
            where temp.storeId = ${storeId}
            and lower(temp.name) like lower('%${keyword}%')
            order by temp.id asc
            limit ${pageSize}, ${size}
        `);

        const serviceIds: number[] = [];
        const packageIds: number[] = [];

        for (const resultSearch of listResultSearch) {
            if (resultSearch.isService) {
                serviceIds.push(resultSearch.id)
            } else {
                packageIds.push(resultSearch.id)
            }
        }

        console.log({ serviceIds, packageIds })

        let services: ServiceEntity[]
        let packages: PackageEntity[];

        if (serviceIds.length > 0) {
            services = await ServiceEntity.createQueryBuilder("ser")
                .leftJoinAndSelect("ser.packages", "packages")
                .where("ser.id IN (:ids)", { ids: serviceIds })
                .getMany();
        }

        if (packageIds.length > 0) {
            packages = await PackageEntity.createQueryBuilder("pac")
                .leftJoinAndSelect("pac.services", "services")
                .where("pac.id IN (:ids)", { ids: packageIds })
                .getMany();
        }

        let result = services;
        return {...result,...packages};
    }

}
