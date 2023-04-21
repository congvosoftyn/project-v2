import { Module } from '@nestjs/common';
import { SettingModule } from './setting/setting.module';
import { StaffModule } from './staff/staff.module';
import { ServiceModule } from '../service/service.module';
import { BookingModule } from '../booking/booking.module';
import { BookingWebModule } from './booking-web/booking-web.module';
import { ActivityModule } from './activity/activity.module';
import { ReportModule } from './report/report.module';
import { LabelModule } from './label/label.module';
import { BookingAppModule } from './booking-app/booking-app.module';

@Module({
  imports: [
    SettingModule,
    StaffModule,
    ServiceModule,
    BookingModule,
    // BookingWebModule,
    ActivityModule,
    ReportModule,
    LabelModule,
    // BookingAppModule,
  ]
})
export class AppointmentModule { }
