import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @User('storeId') storeId: number) {
    return this.categoryService.create(createCategoryDto, storeId);
  }

  @Get()
  findAll(@User('storeId') storeId: number) {
    return this.categoryService.findAll(storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('storeId') storeId: number) {
    return this.categoryService.findOne(+id, storeId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @User('storeId') storeId: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto, storeId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('storeId') storeId: number,) {
    return this.categoryService.remove(+id, storeId);
  }
}
