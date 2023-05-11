import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { CreateCustomerDto, } from './dto/create-customer.dto';
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

  async importCustomerConcept(body: ImportCustomerDto, storeId: number) {
    // let customers = body.customers.map((customer) => ({ ...customer, countryCode: customer.countryCode ? customer.countryCode : "+1" }));
    let store = await StoreEntity.findOne({ where: { id: storeId } });

    let customers = body.customers;

    let phoneNumbers = [];

    for (const customer of customers) {
      let phoneNumber = `${customer.countryCode}${customer.phoneNumber}`;
      phoneNumbers.push(phoneNumber);
    }

    let customersExist = await CustomerEntity.createQueryBuilder("cus")
      .where("CONCAT(cus.countryCode,'',cus.phoneNumber) in (:phoneNumbers)", { phoneNumbers })
      .getMany()

    let newCustomers = [];
    let updateCustomers = [];

    for (const customer of customers) {
      let checkCustomer = await customersExist.find((cus) => cus.phoneNumber === customer.phoneNumber && cus.countryCode === customer.countryCode);
      if (checkCustomer) {
        let updateCustomer = {
          ...checkCustomer,
          phoneNumber: customer.phoneNumber,
          countryCode: customer.countryCode,
          isoCode: customer.isoCode,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          dob: customer.dob,
          gender: customer.gender,
          avatar: customer.avatar,
          description: customer.description,
          storeId
        }
        updateCustomers.push(updateCustomer);

      } else {
        newCustomers.push(<CustomerEntity>{
          phoneNumber: customer.phoneNumber,
          countryCode: customer.countryCode,
          isoCode: customer.isoCode,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          dob: customer.dob,
          gender: customer.gender,
          avatar: customer.avatar,
          description: customer.description,
          storeId
        })
      }
    }

    try {
      CustomerEntity.save(newCustomers);
      CustomerEntity.save(updateCustomers);
      return "Success!";
    } catch (error) {
      console.error("error => ", error);
      throw new BadRequestException("Import no success!")
    }
  }

  async getCustomers(_getCustomer: GetCustomerDto, storeId: number) {
    const page: number = _getCustomer.skip ? +_getCustomer.skip : 0;
    const size: number = _getCustomer.take ? +_getCustomer.take : 10;
    const search: string = _getCustomer.search;

    let query = CustomerEntity
      .createQueryBuilder('customer')
      .leftJoin("customer.store", "store")
      .where("customer.storeId = :storeId", { storeId })
      .groupBy('customer.id, store.id')
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

  async getCustomerById(id: number) {
    const customer = await CustomerEntity.createQueryBuilder("cus").where("cus.id = :id", { id }).getOne()
    if(!customer){
      throw new NotFoundException("Not found customer!");
    }
    return customer;
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
/**
 * Import WHERE IN in TypeORM PostgresSQL
 * Example PostgresSQL 
 * => SELECT * FROM "customer" "cus" WHERE concat("cus"."countryCode", '', "cus"."phoneNumber") IN ('+1123456','+1123789','+1456789','+1078985654')
 *=> WAY ONE:
 constructor(@InjectConnection() private readonly connection: Connection) { }
  let formatString: string = '';
    for (const [i, value] of phoneNumbers.entries()) {
      if(i === phoneNumbers.length -1){
        formatString = formatString +`'${value}'`
      }else {
        formatString = formatString +`'${value}',`
      }
    }
  * => return this.connection.query(`SELECT cus.* FROM customer cus WHERE concat(cus."countryCode", '', cus."phoneNumber") IN (${formatString})`);
 *=> WAY TWO
  * => return CustomerEntity.createQueryBuilder("cus").where(`concat(cus.countryCode, '', cus.phoneNumber) IN (${formatString})`).getMany();
  * CURL: 
  * curl --location 'http://localhost:3000/customers/import' \
    --header 'Content-Type: application/json' \
    --data '{
        "customers":[
            {
                "name":"customer 1 Spring Boot",
                "countryCode": "+1",
                "phoneNumber": "123456"
            },
            {
                "name":"customer 2 Rust",
                "countryCode": "+1",
                "phoneNumber": "123789"
            },
            {
                "name":"customer 3 Golang",
                "countryCode": "+1",
                "phoneNumber": "456789"
            },
            {
                "name":"customer 4 PHP",
                "countryCode": "+1",
                "phoneNumber": "078985654"
            }
        ]
    }' 
 */