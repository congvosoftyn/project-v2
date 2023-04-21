import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StoreEntity } from 'src/entities/Store.entity';
import { CategoryEntity } from 'src/entities/Category.entity';

@Injectable()
export class CategoryService {
  
  async create(createCategoryDto: CreateCategoryDto, storeId: number) {
    let store = await StoreEntity.findOne({ where: { id: storeId } });
    return CategoryEntity.save(<CategoryEntity>{
      name: createCategoryDto.name,
      orderBy: createCategoryDto.orderBy,
      store
    })
  }

  findAll(storeId: number) {
    return CategoryEntity.find({ where: { storeId }, relations: ["services", "packages"] });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
