import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { User } from 'src/modules/user/decorators/user.decorator';
import { ImportCustomerDto } from './dto/ImportCustomer.dto';
import { GetCustomerDto } from './dto/GetCustomer.dto';
import { FindCustomerDto } from './dto/FindCustomer.dto';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) { }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async newCustomer(@Body() body: CreateCustomerDto, @User('companyId') companyId: number) {
    return this.customerService.newCustomer(body, companyId);
  }

  @Post('/import')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async importCustomer(@Body() body: ImportCustomerDto, @User('companyId') companyId: number) {
    return this.customerService.importCustomerConcept(body, companyId)
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

  
  @Get('/customer/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async getCustomerById(@Param('id') id: number) {
    return this.customerService.getCustomerById(id);
  }

 
}
