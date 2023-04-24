import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';

@ApiTags('taxs')
@Controller('taxs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class TaxController {
  constructor(private readonly taxService: TaxService) { }

  @Post()
  create(@Body() createTaxDto: CreateTaxDto, @User('storeId') storeId: number) {
    return this.taxService.create(createTaxDto, storeId);
  }

  @Get()
  findAll(@User('storeId') storeId: number) {
    return this.taxService.findAll(storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('storeId') storeId: number) {
    return this.taxService.findOne(+id, storeId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @User('storeId') storeId: number, @Body() updateTaxDto: UpdateTaxDto) {
    return this.taxService.update(+id, storeId, updateTaxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxService.remove(+id);
  }
}
