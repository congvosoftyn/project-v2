import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingEntity } from 'src/entities/Setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  providers: [SettingService],
  controllers: [SettingController]
})

export class SettingModule { }
