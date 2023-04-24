import { Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/Category.entity';
import { StoreModule } from '../store/store.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([CategoryEntity]),
    forwardRef(() => StoreModule)
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
