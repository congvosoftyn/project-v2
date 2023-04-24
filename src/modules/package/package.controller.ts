import { Controller, Post, Body, UseGuards, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';

@ApiTags('packages')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get("/")
  findAll() {
    return this.packageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: CreatePackageDto) {
    return this.packageService.update(+id, updatePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(+id);
  }
}
