import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { StaffEntity } from 'src/entities/Staff.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpenHourEntity, StaffEntity ])
  ],
  providers: [StaffService],
  controllers: [StaffController]
})

export class StaffModule { }