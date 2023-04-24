import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from 'src/entities/Category.entity';
import { StoreService } from '../store/store.service';

@Injectable()
export class CategoryService {

  constructor(
    private readonly storeService: StoreService
  ) { }

  async create(createCategoryDto: CreateCategoryDto, storeId: number) {
    let store = await this.storeService.findOneStore(storeId);
    return CategoryEntity.save(<CategoryEntity>{ name: createCategoryDto.name, store })
  }

  findAll(storeId: number) {
    return CategoryEntity.find({ where: { storeId }, relations: ["services", "packages"] });
  }

  async findOne(id: number, storeId: number) {
    const category = await CategoryEntity.findOne({ where: { id, storeId }, relations:["services","packages"] });
    if (!category) throw new NotFoundException("not found category");
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, storeId: number) {
    let category = await this.findOne(id, storeId);
    return CategoryEntity.save(<CategoryEntity>{ ...category, name: updateCategoryDto.name });
  }

  remove(id: number, storeId: number) {
    return CategoryEntity.createQueryBuilder().update({isActive: true}).where("id = :id and storeId = :storeId",{id, storeId}).execute();
  }
}
