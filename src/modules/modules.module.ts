import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { RedisCacheModule } from './cache/redisCache.module';
import { CustomerModule } from './customer/customer.module';
import { UploadModule } from './upload/upload.module';
import { StoreModule } from './store/store.module';
import { BillingModule } from './billing/billing.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PackageModule } from './package/package.module';
import { BookingModule } from './booking/booking.module';
import { CategoryModule } from './category/category.module';


@Module({
    imports: [
        UserModule,
        EmailModule,
        RedisCacheModule,
        CustomerModule,
        UploadModule,
        StoreModule,
        BillingModule,
        AppointmentModule,
        PackageModule,
        BookingModule,
        CategoryModule
    ],
})
export class ModulesModule { }
