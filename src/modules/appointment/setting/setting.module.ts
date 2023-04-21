import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentSettingEntity } from 'src/entities/Setting.entity';
import { SettingResolver } from './setting.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentSettingEntity])],
  providers: [SettingService, SettingResolver],
  controllers: [SettingController]
})

export class SettingModule { }
