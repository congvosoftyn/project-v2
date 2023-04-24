import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { EmailModule } from '../email/email.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, StoreEntity,]),
    EmailModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})

export class CustomerModule { }
