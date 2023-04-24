import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { RedisCacheModule } from './cache/redisCache.module';
import { CustomerModule } from './customer/customer.module';
import { UploadModule } from './upload/upload.module';
import { StoreModule } from './store/store.module';
import { PackageModule } from './package/package.module';
import { BookingModule } from './booking/booking.module';
import { CategoryModule } from './category/category.module';
import { ServiceModule } from './service/service.module';
import { StaffModule } from './staff/staff.module';
import { SettingModule } from './setting/setting.module';
import { TaxModule } from './tax/tax.module';
import { TimeOffsModule } from './time-offs/time-offs.module';


@Module({
    imports: [
        UserModule,
        EmailModule,
        RedisCacheModule,
        CustomerModule,
        UploadModule,
        StoreModule,
        SettingModule,
        PackageModule,
        BookingModule,
        CategoryModule,
        ServiceModule,
        TaxModule,
        StaffModule,
        TimeOffsModule
    ],
})
export class ModulesModule { }
