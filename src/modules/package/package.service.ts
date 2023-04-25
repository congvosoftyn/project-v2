import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageEntity } from 'src/entities/Package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ServiceEntity } from 'src/entities/service.entity';

@Injectable()
export class PackageService {
  async create(createPackageDto: CreatePackageDto) {
    let services = await ServiceEntity.createQueryBuilder("service")
      .where("service.id in (:ids)", { ids: createPackageDto.serviceIds })
      .getMany()
    let duration = 0;
    for (const service of services) {
      duration += service.duration;
    }

    return PackageEntity.save(<PackageEntity>{
      name: createPackageDto.name,
      categoryId: createPackageDto.categoryId,
      price: createPackageDto.price,
      duration,
      services
    });
  }

  findAll(storeId: number) {
    return PackageEntity.createQueryBuilder('package')
      .leftJoinAndSelect("package.services", "services")
      .leftJoin("package.category", "category")
      .select([
        "package.id", "package.name", "package.price",
        "category.id", "category.name", "category.storeId",
        "services.id", "services.name", "services.price",
        "services.duration", "services.description"
      ])
      .where("category.storeId = :storeId and package.deleted = true", { storeId })
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

    let services = await ServiceEntity.createQueryBuilder("service")
      .where("service.id in (:ids)", { ids: updatePackageDto.serviceIds })
      .getMany()

    aPackage.name = updatePackageDto.name;
    aPackage.categoryId = updatePackageDto.categoryId;
    aPackage.price = updatePackageDto.price;
    aPackage.services = services;

    return PackageEntity.save(aPackage);
  }

  remove(id: number) {
    // return PackageEntity.createQueryBuilder().update({ deleted: false }).where("id = :id", { id }).execute()
    return PackageEntity.delete({id});
  }
}
