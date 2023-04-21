import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete } from '@nestjs/common';
import { PackageCategoryService } from './package-category.service';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';

@ApiTags('package-category')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
@Controller('package-category')
export class PackageCategoryController {
  constructor(private readonly packageCategoryService: PackageCategoryService) {}

  @Post()
  create(@Body() createPackageCategoryDto: CreatePackageCategoryDto) {
    return this.packageCategoryService.create(createPackageCategoryDto);
  }

  @Get("/")
  findAll() {
    return this.packageCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageCategoryService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePackageCategoryDto: UpdatePackageCategoryDto) {
    return this.packageCategoryService.update(+id, updatePackageCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageCategoryService.remove(+id);
  }
}
