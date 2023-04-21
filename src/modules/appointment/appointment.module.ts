import { Module } from '@nestjs/common';
import { SettingModule } from './setting/setting.module';
import { StaffModule } from '../staff/staff.module';
import { ServiceModule } from '../service/service.module';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [
    SettingModule,
    StaffModule,
    ServiceModule,
    BookingModule,
  ]
})
export class AppointmentModule { }
