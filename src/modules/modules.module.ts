import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { RedisCacheModule } from './cache/redisCache.module';
import { CustomerModule } from './customer/customer.module';
import { UploadModule } from './upload/upload.module';
import { StoreModule } from './store/store.module';
import { BillingModule } from './billing/billing.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PackageCategoryModule } from './package/package-category.module';
import { BookingModule } from './booking/booking.module';


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
        PackageCategoryModule,
        BookingModule
    ],
})
export class ModulesModule { }
