import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { StaffBreakTimeEntity } from 'src/entities/StaffBreakTime.entity';
import { StaffWorkingHourEntity } from 'src/entities/WorkingHour.entity';
import { StaffResolver } from './staff.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpenHourEntity, StaffEntity, StaffBreakTimeEntity, StaffWorkingHourEntity])
  ],
  providers: [StaffService, StaffResolver],
  controllers: [StaffController]
})

export class StaffModule { }