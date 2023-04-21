import { Injectable } from '@nestjs/common';
import { BillingEntity } from 'src/entities/Billing.entity';
import { MessageSentEntity } from 'src/entities/MessageSent.entity';
import { Between } from 'typeorm';
import { GetQueryDto } from './dto/GetQuery.dto';

@Injectable()
export class BillingService {
  async findBills(pageNumber: number, pageSize: number, companyId: number) {
    const rootQuery = BillingEntity.createQueryBuilder('billing')
      .leftJoinAndSelect('billing.subscription', 'subscription')
      .where('subscription.companyId = :companyId', { companyId });

    const bills = await rootQuery
      .skip(pageNumber ? +pageNumber : 0)
      .take(pageSize ? +pageSize : 10)
      .orderBy('billing.created', 'DESC')
      .getMany();
    const total = await rootQuery.getCount();

    return { items: bills, totalCount: total };
  }

  async getBills(query: GetQueryDto, companyId: number) {
    // const bills = await Billing.find({
    //     where : {companyId},
    //     order: {created: 'DESC'},
    //     skip: pageNumber,
    //     take: pageSize
    // });
    return BillingEntity.createQueryBuilder('billing')
      .leftJoinAndSelect('billing.subscription', 'subscription')
      .where('subscription.companyId = :companyId', { companyId })
      .skip(query.pageNumber ? +query.pageNumber : 0)
      .take(query.pageSize ? +query.pageSize : 10)
      .orderBy('billing.created', 'DESC')
      .getMany();
  }

  async currentBill(companyId: number) {
    return await BillingEntity.createQueryBuilder('billing')
      .leftJoinAndSelect('billing.subscription', 'subscription')
      .leftJoinAndSelect('subscription.company', 'company')
      .leftJoinAndSelect('subscription.package', 'package')
      .leftJoinAndSelect('billing.addons', 'addons')
      .where('subscription.companyId = :companyId', { companyId })
      .orderBy('billing.startDate', 'DESC')
      .getOne();
  }

  // get billing details
  async getInvoice(id: number, companyId: number) {
    return await BillingEntity.createQueryBuilder('billing')
      .leftJoinAndSelect('billing.subscription', 'subscription')
      .leftJoinAndSelect('subscription.company', 'company')
      .leftJoinAndSelect('subscription.package', 'package')
      .leftJoinAndSelect('billing.addons', 'addons')
      .where('subscription.companyId = :companyId', { companyId })
      .andWhere('billing.id = :id', { id: id })
      .getOne();
  }

  // async getMessageUsedCount(companyId: number) {
  //   return await BillingEntity.getMessageUsedCount(companyId);
  // }

  // async getMessageSent(companyId: number, _take: number) {
  //   const take: number = _take ? +_take : 20;
  //   const bill = await BillingEntity.createQueryBuilder('billing')
  //     .leftJoin('billing.subscription', 'subscription')
  //     .where('subscription.companyId = :companyId', { companyId })
  //     .orderBy('billing.startDate', 'DESC')
  //     .getOne();
  //   return MessageSentEntity.find({ where: { companyId, created: Between(bill.startDate, bill.endDate) }, relations: ['customer'], take, order: { created: 'DESC', }, });
  // }

  // async postPayment(req: Request, res: Response, next: NextFunction) {
  //     try {
  //         const bill: Billing = req.body.bill;
  //         const payment = req.body.payment;
  //         console.log(req.body)
  //         res.status(200).send(req.body);
  //     } catch (err) {
  //         next(err);
  //     }
  // }

  async makeStripePayment(billId: number, token: string) {
    const stripeToken = token;
  }
}
