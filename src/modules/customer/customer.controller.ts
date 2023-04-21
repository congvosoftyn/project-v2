import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CompanyCustomerDto, CustomerDto } from './dto/CompanyCustomer.dto';
import { User } from 'src/modules/user/decorators/user.decorator';
import { ImportCustomerDto } from './dto/ImportCustomer.dto';
import { GetCustomerDto } from './dto/GetCustomer.dto';
import { FindCustomerDto } from './dto/FindCustomer.dto';
import { UpdateCompanyCustomerDto } from './dto/update-comapny-customer.dto';
import { UserCustomer } from '../user/decorators/user-customer.decorator';
import { ConstactUsDto } from './dto/ContactUs.dto';
import { AddStoreDto } from './dto/AddStore.dto';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import JwtCustomerAuthGuard from 'src/shared/guards/jwtCustomerAuth.guard';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) { }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async newCustomer(@Body() body: CompanyCustomerDto, @User('companyId') companyId: number) {
    return this.customerService.newCustomer(body, companyId);
  }

  @Post('/import')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async importCustomer(@Body() body: ImportCustomerDto, @User('companyId') companyId: number) {
    return this.customerService.importCustomer(body, companyId)
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async getCustomers(@Query() _getCustomer: GetCustomerDto, @User('companyId') companyId: number) {
    return this.customerService.getCustomers(_getCustomer, companyId)
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async deleteCustomer(@Param('id', ParseIntPipe) id: number, @User('companyId') companyId: number) {
    return this.customerService.deleteCustomer(companyId, id);
  }

  @Get('/find')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async findCustomers(@Query() _findCustomer: FindCustomerDto, @User('companyId') companyId: number) {
    return this.customerService.findCustomers(_findCustomer, companyId)
  }

  @Put()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async updateCompanyCustomer(@Body() companyCustomer: UpdateCompanyCustomerDto) {
    return this.customerService.updateCompanyCustomer(companyCustomer);
  }

  @Put('/update')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async updateCustomer(@Body() body: UpdateCustomerDto) {
    return this.customerService.updateCustomer(body);
  }

  @Get('/customer/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async getCustomerById(@Param('id') id: number) {
    return this.customerService.getCustomerById(id);
  }

  @Get('/companycustomer/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async getCompanyCustomerById(@Param('id') id: number) {
    return this.customerService.getCompanyCustomerById(id)
  }


  @Get('/companycustomer/customer/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async getCompanyCustomerByCustomerId(@Param('id') id: number, @User('companyId') companyId: number) {
    return this.customerService.getCompanyCustomerByCustomerId(id, companyId)
  }

  @Post('/client')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtCustomerAuthGuard)
  async updateClientCustomer(@Body() body: CustomerDto, @UserCustomer('customerId') customerId: number) {
    return this.customerService.updateClientCustomer(body, customerId);
  }

  @Put('/firebase/client')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtCustomerAuthGuard)
  async updateFirebaseToken(@Body() token: string, @UserCustomer('customerId') customerId: number) {
    return this.customerService.updateFirebaseToken(token, customerId);
  }

  @Get('/client')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtCustomerAuthGuard)
  async getClientCustomer(@UserCustomer('customerId') customerId: number) {
    return this.customerService.getClientCustomer(customerId);
  }

  @Post('/contactus')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtCustomerAuthGuard)
  contactUs(@Body() body: ConstactUsDto, @UserCustomer('customerId') customerId: number) {
    return this.customerService.contactUs(body, customerId);
  }

  @Get('/favor-store')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtCustomerAuthGuard)
  async getFavorStore(@UserCustomer('customerId') customerId: number) {
    return this.customerService.getFavorStore(customerId)
  }

  @Post('/favor-store')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtCustomerAuthGuard)
  async addFavorStore(@Body() body: AddStoreDto, @UserCustomer('customerId') customerId: number) {
    return this.customerService.addFavorStore(body, customerId)
  }

  @Delete('/favor-store/:storeId')
  @ApiBearerAuth('customer-token')
  @UseGuards(JwtCustomerAuthGuard)
  async removeFavorStore(@Param('storeId') storeId: number, @UserCustomer('customerId') customerId: number) {
    return this.customerService.removeFavorStore(storeId, customerId);
  }
}
