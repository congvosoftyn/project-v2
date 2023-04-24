import { Injectable } from '@nestjs/common';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CreateCustomerDto, } from './dto/create-customer.dto';
import { FindCustomerDto } from './dto/FindCustomer.dto';
import { GetCustomerDto } from './dto/GetCustomer.dto';
import { StoreEntity } from 'src/entities/Store.entity';
import { ConstactUsDto } from './dto/ContactUs.dto';
import { EmailService } from '../email/email.service';
import { ImportCustomerDto } from './dto/ImportCustomer.dto';

@Injectable()
export class CustomerService {
  constructor(
    private emailService: EmailService
  ) { }

  async newCustomer(bodyCustomer: CreateCustomerDto, storeId: number) {
    bodyCustomer = { ...bodyCustomer, countryCode: bodyCustomer.countryCode ? bodyCustomer.countryCode : "+1" };
    let store = await StoreEntity.findOne({ where: { id: storeId } });

    return CustomerEntity.save(<CustomerEntity>{
      phoneNumber: bodyCustomer.phoneNumber,
      countryCode: bodyCustomer.countryCode,
      isoCode: bodyCustomer.isoCode,
      email: bodyCustomer.email,
      firstName: bodyCustomer.firstName,
      lastName: bodyCustomer.lastName,
      dob: bodyCustomer.dob,
      gender: bodyCustomer.gender,
      avatar: bodyCustomer.avatar,
      description: bodyCustomer.description,
      store
    });
  }

  deleteCustomer(storeId: number, id: number) {
    return CustomerEntity.createQueryBuilder()
      .delete()
      .where("storeId = :storeId and customerId = :customerId", { storeId, customerId: id })
      .execute();
  }

  async importCustomerConcept(body: ImportCustomerDto, companyId: number) {
    let customers = body.customer.map((customer) => ({ ...customer, countryCode: customer.countryCode ? customer.countryCode : "+1" }));
    let phoneNumbers = [];
    let countryCodes = [];

    customers.map((customer) => {
      phoneNumbers.push(customer.phoneNumber);
      countryCodes.push(customer.countryCode);
    });

    let customersExist = await CustomerEntity.createQueryBuilder('customer')
      .leftJoin("customer.companyCustomer", "companyCustomer")
      .select([
        "customer.id", "customer.countryCode", "customer.email", "customer.phoneNumber",
        "customer.firstName", "customer.lastName", "companyCustomer.id",
        "companyCustomer.companyId", "companyCustomer.customerId"
      ])
      .where("customer.phoneNumber in (:phoneNumbers)", { phoneNumbers: phoneNumbers })
      .andWhere("customer.countryCode in (:countryCodes)", { countryCodes })
      .andWhere("companyCustomer.companyId = :companyId", { companyId })
      .getMany();

    let bodyCustomerExistUpdate = [];
    let bodyCustomerNew = [];

    customers.forEach((customer) => {
      let check = customersExist.findIndex(cusE => cusE.phoneNumber === customer.phoneNumber && cusE.countryCode === customer.countryCode);
      if (check !== -1) {
        bodyCustomerExistUpdate.push(<CustomerEntity>customer)
      } else {
        bodyCustomerNew.push(<CustomerEntity>customer)
      }
    })

    let customersUpdate = [];

    bodyCustomerExistUpdate.forEach((customer) => {
      let _customer = customersExist.find((cus) => cus.phoneNumber === customer.phoneNumber && cus.countryCode === customer.countryCode) as CustomerEntity;
      if (_customer) {
        let _cus = { ..._customer, firstName: customer.firstName, lastName: customer.lastName, email: customer.email };
        customersUpdate.push(_cus)
      }
    })

    CustomerEntity.save(customersUpdate);
    CustomerEntity.save(bodyCustomerNew);

    return { status: "OK" }
  }

  async findCustomers(_findCustomer: FindCustomerDto, companyId: number) {
    const skip: number = _findCustomer.pageNumber ? +_findCustomer.pageNumber : 0;
    const take: number = _findCustomer.pageSize ? +_findCustomer.pageSize : 10;
    const sortField: string = _findCustomer.sortField ? _findCustomer.sortField : '';
    const sortOrder = _findCustomer.sortOrder == 'asc' ? 'ASC' : 'DESC';
    const search: string = _findCustomer.filter ? _findCustomer.filter : '';

    let rootQuery = CustomerEntity
      .createQueryBuilder('customer')
      .leftJoin("customer.companyCustomer", "com_customer")
      .where("com_customer.companyId = :companyId", { companyId })
    if (search) {
      rootQuery = rootQuery.andWhere(`(CONCAT(customer.firstName, ' ', customer.lastName) LIKE :keywork OR phoneNumber LIKE :keywork)`, { keywork: `%${search}%` })
    }

    const total = await rootQuery.getCount();
    const query = rootQuery.skip(skip).take(take);

    if (sortField && sortField != 'null') {
      query.orderBy("customer." + sortField, sortOrder)
    }
    const customers = await query.getMany();
    return { items: customers, totalCount: total };
  }

  async getCustomers(_getCustomer: GetCustomerDto, storeId: number) {
    const page: number = _getCustomer.skip ? +_getCustomer.skip : 0;
    const size: number = _getCustomer.take ? +_getCustomer.take : 10;
    const search: string = _getCustomer.search;

    let query = CustomerEntity
      .createQueryBuilder('customer')
      .groupBy('customer.id')
      .skip(page * size)
      .take(size)

    if (search) {
      query = query.andWhere("(customer.firstName LIKE :keywork OR customer.lastName LIKE :keywork OR customer.phoneNumber LIKE :keywork)", { keywork: `%${search}%` })
        .orderBy('customer.firstName')
    } else {
      query = query.orderBy('customer.created', 'DESC')
    }

    return query.getMany()
  }

  getCustomerById(id: number) {
    return CustomerEntity.findOneOrFail({ where: { id } });
  }

  async contactUs(body: ConstactUsDto, customerId: number) {
    this.emailService.sendContactUsEmail("thanh@solutrons.com", "Message from " + body.name, `
            From: ${body.email}\n
            Name: ${body.name}\n
            CustomerId: ${customerId}
            Message: ${body.message}\n
        `);

    return { succeed: true };
  }

  // async getFavorStore(customerId: number) {
  //   const favor = await CustomerEntity.createQueryBuilder('customer')
  //     .leftJoinAndSelect('customer.favorStores', 'store')
  //     .addSelect(s => s
  //       .select('ROUND(AVG(review.rate),1)', 'store_rate')
  //       .from(ReviewEntity, 'review').where('review.storeId=store.id'), 'store_rate')
  //     .addSelect(s => s
  //       .select('COUNT(review.id)', 'review_count')
  //       .from(ReviewEntity, 'review').where('review.storeId=store.id'), 'store_reviewCount')
  //     .where('customer.id = :customerId', { customerId })
  //     .getOne();

  //   if (!favor) throw new NotFoundException(`not found with id ${customerId}`);

  //   return favor.favorStores;
  // }
}
