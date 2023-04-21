import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageCategoryEntity } from 'src/entities/Package.entity';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';
import { ProductCategoryEntity } from 'src/entities/Category.entity';

@Injectable()
export class PackageCategoryService {
  async create(createPackageCategoryDto: CreatePackageCategoryDto) {
    return PackageCategoryEntity.save(createPackageCategoryDto as unknown as PackageCategoryEntity);
  }

  findAll() {
    return PackageCategoryEntity.createQueryBuilder('package')
      .leftJoin("package.category", "category")
      .leftJoin("package.bookingInfo", "bookingInfo")
      .leftJoin("package.services", "services", "services.isService = true")
      .getMany();
  }

  findOne(id: number) {
    return PackageCategoryEntity.createQueryBuilder('package')
      .leftJoinAndSelect("package.category", "category")
      .leftJoinAndSelect("package.services", "services")
      .where("package.id = :id and deleted = true", { id })
      .getOne();
  }

  async update(id: number, updatePackageCategoryDto: UpdatePackageCategoryDto) {
    const _package = updatePackageCategoryDto as unknown as PackageCategoryEntity;
    _package.id = id;
    let category = await ProductCategoryEntity.findOne({where:{id: updatePackageCategoryDto.categoryId}});
    if(!category) throw new NotFoundException("Category exists!");
    _package.category = category
    return await PackageCategoryEntity.save(_package);
    // await PackageCategoryEntity.save(_package);
    // return await this.findOne(id);
  }

  remove(id: number) {
    return PackageCategoryEntity.createQueryBuilder().update({ deleted: false }).where("id = :id", { id }).execute()
  }
}
