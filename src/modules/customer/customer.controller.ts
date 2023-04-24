import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { User } from 'src/modules/user/decorators/user.decorator';
import { ImportCustomerDto } from './dto/ImportCustomer.dto';
import { GetCustomerDto } from './dto/GetCustomer.dto';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';

@ApiTags('customers')
@Controller('customers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class CustomerController {
  constructor(private customerService: CustomerService) { }

  @Post()
  newCustomer(@Body() body: CreateCustomerDto, @User('storeId') storeId: number) {
    return this.customerService.newCustomer(body, storeId);
  }

  @Post('/import')
  @UsePipes(new ValidationPipe())
  importCustomer(@Body() body: ImportCustomerDto, @User('storeId') storeId: number) {
    return this.customerService.importCustomerConcept(body, storeId)
  }

  @Get()
  @UsePipes(new ValidationPipe())
  getCustomers(@Query() _getCustomer: GetCustomerDto, @User('storeId') storeId: number) {
    return this.customerService.getCustomers(_getCustomer, storeId)
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  deleteCustomer(@Param('id', ParseIntPipe) id: number, @User('storeId') storeId: number) {
    return this.customerService.deleteCustomer(storeId, id);
  }

  @Get('/:id')
  getCustomerById(@Param('id') id: number) {
    return this.customerService.getCustomerById(id);
  }
}
