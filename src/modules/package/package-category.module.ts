import { PackageCategoryEntity } from '../../entities/Package.entity';
import { Module } from '@nestjs/common';
import { PackageCategoryService } from './package-category.service';
import { PackageCategoryController } from './package-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PackageCategoryEntity])],
  controllers: [PackageCategoryController],
  providers: [PackageCategoryService]
})
export class PackageCategoryModule { }
