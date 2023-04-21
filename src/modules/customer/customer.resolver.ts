import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { CompanyCustomerEntity } from 'src/entities/CompanyCustomer.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';
import { UserCustomer } from '../user/decorators/user-customer.decorator';
import { User } from '../user/decorators/user.decorator';
import { CustomerService } from './customer.service';
import { AddFavorStoreInput } from './dto/AddStore.input';
import { CompanyCustomerInputDTO, CustomerInputDTO, } from './dto/CompanyCustomer.input';
import { ContactUsInput } from './dto/ContactUs.input';
import { DeleteCustomerDto } from './dto/delete-customer.dto';
import { FindCustomerInput } from './dto/FindCustomer.input';
import { GetCustomerInput } from './dto/GetCustomer.input';
import { ImportCustomerInput } from './dto/ImportCustomer.input';
import { UpdateCompanyCustomerInput } from './dto/update-comapny-customer.input';

@Resolver(() => CompanyCustomerEntity)
export class CustomerResolver {
  constructor(private customerService: CustomerService) { }

  // @Mutation(() => CompanyCustomerEntity)
  // @UseGuards(JwtAuthenticationGuard)
  // @UsePipes(new ValidationPipe())
  // async newCustomer(@Args('companyCustomerInput') companyCustomerInput: CompanyCustomerInputDTO, @User('companyId') companyId: number,) {
  //   return this.customerService.newCustomer(companyCustomerInput, companyId);
  // }

  // @Mutation(() => CustomerEntity, { name: 'import' })
  // @UseGuards(JwtAuthenticationGuard)
  // @UsePipes(new ValidationPipe())
  // async importCustomer(@Args('importCustomer') importCustomer: ImportCustomerInput, @User('companyId') companyId: number,): Promise<{ status: string }> {
  //   return this.customerService.importCustomer(importCustomer, companyId);
  // }

  @Query(() => [CustomerEntity])
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthenticationGuard)
  async getCustomers(@Args('_getCustomer') _getCustomer: GetCustomerInput, @User('companyId') companyId: number,) {
    return this.customerService.getCustomers(_getCustomer, companyId);
  }

  // @Mutation(() => DeleteCustomerDto)
  // @UseGuards(JwtAuthenticationGuard)
  // @UsePipes(new ValidationPipe())
  // async deleteCustomer(@Args('id', { type: () => Int }) id: number, @User('companyId') companyId: number,): Promise<{ message: string }> {
  //   return this.customerService.deleteCustomer(companyId, id);
  // }

  @Query(() => CustomerEntity, { name: 'find' })
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async findCustomers(@Args('_findCustomer') _findCustomer: FindCustomerInput, @User('companyId') companyId: number,) {
    return this.customerService.findCustomers(_findCustomer, companyId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Mutation(() => CompanyCustomerEntity)
  @UsePipes(new ValidationPipe())
  async updateCompanyCustomer(@Args('companyCustomer') companyCustomer: UpdateCompanyCustomerInput,) {
    return this.customerService.updateCompanyCustomer(companyCustomer);
  }

  // // Mutation error
  // @Mutation(() => CompanyCustomerEntity, { name: 'update' })
  // async updateCustomer(@Args('updateCustomer') updateCustomer: UpdateCustomerInput,) {
  //   return this.customerService.updateCustomer(updateCustomer);
  // }

  @UseGuards(JwtAuthenticationGuard)
  @Query(() => CustomerEntity, { name: 'customer' })
  async getCustomerById(@Args('id', { type: () => Int }) id: number) {
    return this.customerService.getCustomerById(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Query(() => CompanyCustomerEntity, { name: 'companycustomer' })
  async getCompanyCustomerById(@Args('id', { type: () => Int }) id: number) {
    return this.customerService.getCompanyCustomerById(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Query(() => CompanyCustomerEntity, { name: 'companycustomer_customer' })
  async getCompanyCustomerByCustomerId(@Args('id', { type: () => Int }) id: number, @User('companyId') companyId: number,) {
    return this.customerService.getCompanyCustomerByCustomerId(id, companyId);
  }

  // @UseGuards(JwtCustomerAuthGuard)
  // @Mutation(() => CompanyCustomerEntity, { name: 'client' })
  // async updateClientCustomer(@Args('updateClientCustomer') updateClientCustomer: CustomerInputDTO, @UserCustomer('customerId') customerId: number,) {
  //   return this.customerService.updateClientCustomer(updateClientCustomer, customerId,);
  // }

  @UseGuards(JwtCustomerAuthGuard)
  @Mutation(() => CompanyCustomerEntity, { name: 'firebase_client' })
  async updateFirebaseToken(@Args('token', { type: () => String }) token: string, @UserCustomer('customerId') customerId: number,) {
    return this.customerService.updateFirebaseToken(token, customerId);
  }

  @UseGuards(JwtCustomerAuthGuard)
  @Query(() => CustomerEntity, { name: 'client' })
  async getClientCustomer(@UserCustomer('customerId') customerId: number) {
    return this.customerService.getClientCustomer(customerId);
  }

  @UseGuards(JwtCustomerAuthGuard)
  @Mutation(() => CustomerEntity, { name: 'contactus' })
  contactUs(@Args('_contactUs') _contactUs: ContactUsInput, @UserCustomer('customerId') customerId: number,) {
    return this.customerService.contactUs(_contactUs, customerId);
  }

  @UseGuards(JwtCustomerAuthGuard)
  @Query(() => CustomerEntity, { name: 'favor_store' })
  async getFavorStore(@UserCustomer('customerId') customerId: number) {
    return this.customerService.getFavorStore(customerId);
  }

  @UseGuards(JwtCustomerAuthGuard)
  @Mutation(() => CustomerEntity, { name: 'favor_store' })
  async addFavorStore(@Args('addFavorStore') addFavorStore: AddFavorStoreInput, @UserCustomer('customerId') customerId: number,) {
    return this.customerService.addFavorStore(addFavorStore, customerId);
  }

  @UseGuards(JwtCustomerAuthGuard)
  @Mutation(() => CustomerEntity, { name: 'favor_store' })
  async removeFavorStore(@Args('storeId', { type: () => Int }) storeId: number, @UserCustomer('customerId') customerId: number,) {
    return this.customerService.removeFavorStore(storeId, customerId);
  }
}
