import { Injectable } from '@nestjs/common';
import { SettingEntity } from 'src/entities/Setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingService {
  getSetting(storeId: number) {
    return SettingEntity.findOne({ where: { storeId } });
  }

  async updateSetting(id: number, newSetting: CreateSettingDto, storeId: number) {
    let setting = await SettingEntity.findOne({ where: { id, storeId } });
    return SettingEntity.save(<SettingEntity>{
      ...setting,
      offHoursBooking: newSetting.offHoursBooking,
      doubleBooking: newSetting.doubleBooking,
      customServiceDuration: newSetting.customServiceDuration,
      customServiceCost: newSetting.customServiceCost,
      appointmentSlots: newSetting.appointmentSlots,
      weekStartDay: newSetting.weekStartDay,
    })
  }
}
