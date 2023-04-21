import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { BillingService } from './billing.service';
import { GetQueryDto } from './dto/GetQuery.dto';

@Controller('billing')
@ApiTags('billing')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class BillingController {
  constructor(private billingService: BillingService) { }

  @Get()
  async getBills(@Query() query: GetQueryDto, @User('companyId') companyId: number) {
    return this.billingService.getBills(query, companyId);
  }

  // @Get('/messageCount')
  // async getMessageUsedCount(@User('companyId') companyId: number) {
  //   return this.billingService.getMessageUsedCount(companyId);
  // }

  // @Get('/messageSent')
  // async getMessageSent(@Query('take') take: number, @User('companyId') companyId: number) {
  //   return this.billingService.getMessageSent(companyId, take);
  // }

  @Get('/find')
  async findBills(@Query() { pageNumber, pageSize }: GetQueryDto, @User('companyId') companyId: number) {
    return this.billingService.findBills(pageNumber, pageSize, companyId);
  }

  @Get('/current')
  async currentBill(@User('companyId') companyId: number) {
    return this.billingService.currentBill(companyId)
  }

  @Get('/invoice/:id')
  async getInvoice(@Param('id') id: number, @User('companyId') companyId: number) {
    return this.billingService.getInvoice(id, companyId);
  }
}
