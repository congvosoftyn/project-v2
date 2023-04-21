import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageEntity } from 'src/entities/Package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ProductEntity } from 'src/entities/Product.entity';

@Injectable()
export class PackageService {
  async create(createPackageDto: CreatePackageDto) {
    let services = await ProductEntity.createQueryBuilder("service")
      .where("service.id in (:ids) and service.isService = true", { ids: createPackageDto.serviceIds })
      .getMany()
    return PackageEntity.save(<PackageEntity>{
      name: createPackageDto.name,
      categoryId: createPackageDto.categoryId,
      price: createPackageDto.price,
      services
    });
  }

  findAll() {
    return PackageEntity.createQueryBuilder('package')
      .leftJoin("package.", "")
      .leftJoin("package.bookingInfo", "bookingInfo")
      .leftJoin("package.services", "services", "services.isService = true")
      .getMany();
  }

  findOne(id: number) {
    return PackageEntity.createQueryBuilder('package')
      .leftJoinAndSelect("package.services", "services")
      .where("package.id = :id and deleted = true", { id })
      .getOne();
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    let aPackage = await this.findOne(id);

    let services = await ProductEntity.createQueryBuilder("service")
      .where("service.id in (:ids) and service.isService = true", { ids: updatePackageDto.serviceIds })
      .getMany()

    aPackage.name = updatePackageDto.name;
    aPackage.categoryId = updatePackageDto.categoryId;
    aPackage.price = updatePackageDto.price;
    aPackage.services = services;

    return PackageEntity.save(aPackage);
  }

  remove(id: number) {
    return PackageEntity.createQueryBuilder().update({ deleted: false }).where("id = :id", { id }).execute()
  }
}
