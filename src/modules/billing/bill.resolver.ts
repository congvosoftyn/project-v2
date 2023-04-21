import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { BillingEntity } from 'src/entities/Billing.entity';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { User } from '../user/decorators/user.decorator';
import { BillingService } from './billing.service';
import { GetQueryInput } from './dto/GetQuery.input';

@Resolver(() => BillingEntity)
@UseGuards(JwtAuthenticationGuard)
export class BillResolver {
  constructor(private billingService: BillingService) { }

  @Query(() => BillingEntity)
  async getBills(@Args('query') query: GetQueryInput, @User('companyId') companyId: number) {
    return this.billingService.getBills(query, companyId);
  }

  // @Query(() => BillingEntity, { name: 'messageCount' })
  // async getMessageUsedCount(@User('companyId') companyId: number) {
  //   return this.billingService.getMessageUsedCount(companyId);
  // }

  // @Query(() => BillingEntity, { name: 'messageSent' })
  // async getMessageSent(@Args('take', { type: () => Int }) take: number, @User('companyId') companyId: number) {
  //   return this.billingService.getMessageSent(companyId, take);
  // }

  @Query(() => BillingEntity, { name: 'find' })
  async findBills(@Args('query') query: GetQueryInput, @User('companyId') companyId: number) {
    return this.billingService.findBills(query.pageNumber, query.pageSize, companyId,);
  }

  @Query(() => BillingEntity, { name: 'current' })
  async currentBill(@User('companyId') companyId: number) {
    return this.billingService.currentBill(companyId);
  }

  @Query(() => BillingEntity, { name: 'invoice' })
  async getInvoice(@Args('id', { type: () => Int }) id: number, @User('companyId') companyId: number) {
    return this.billingService.getInvoice(id, companyId);
  }
}
