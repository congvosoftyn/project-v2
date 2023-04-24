import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxEntity } from 'src/entities/Tax.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([TaxEntity])
  ],
  controllers: [TaxController],
  providers: [TaxService]
})
export class TaxModule {}
