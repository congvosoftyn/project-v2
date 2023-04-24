import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { TaxEntity } from 'src/entities/Tax.entity';

@Injectable()
export class TaxService {
  create(createTaxDto: CreateTaxDto, storeId: number) {
    return TaxEntity.save(<TaxEntity>{
      name: createTaxDto.name,
      rate: createTaxDto.rate,
      type: createTaxDto.type,
      zipCode: createTaxDto.zipCode,
      storeId
    })
  }

  findAll(storeId: number) {
    return TaxEntity.find({ where: { storeId } });
  }

  async findOne(id: number, storeId: number) {
    let tax = await TaxEntity.findOne({ where: { id, storeId } });
    if (!tax) throw new NotFoundException("not found tax!");
    return tax;
  }

  async update(id: number, storeId: number, updateTaxDto: UpdateTaxDto) {
    let tax = await this.findOne(id, storeId);
    return TaxEntity.save(<TaxEntity>{
      ...tax,
      name: updateTaxDto.name,
      rate: updateTaxDto.rate,
      type: updateTaxDto.type,
      zipCode: updateTaxDto.zipCode,
    })
  }

  remove(id: number) {
    return TaxEntity.createQueryBuilder().update({ actived: true }).where("id = :id", { id }).execute();
  }
}
