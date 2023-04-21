import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CustomerGroupEntity } from 'src/entities/CustomerGroup.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { EmailModule } from '../email/email.module';
import { CustomerController } from './customer.controller';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyCustomerEntity, CustomerEntity, CustomerGroupEntity, StoreEntity,]),
    EmailModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerResolver],

})

export class CustomerModule {}
