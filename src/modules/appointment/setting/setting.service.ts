import { Injectable } from '@nestjs/common';
import { SettingEntity } from 'src/entities/Setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class SettingService {
  async getSetting(storeId: number) {
    let setting = await SettingEntity.createQueryBuilder('appSetting',).where({ storeId }).getOne();
    if (!setting) {
      // if store first created then generate default setting
      const appSetting = new SettingEntity();
      appSetting.storeId = storeId;
      setting = await appSetting.save();
      return appSetting;
    }
    return setting;
  }

  async updateSetting(id: number, newSetting: CreateSettingDto, storeId: number) {
    const _setting = newSetting as unknown as SettingEntity;
    _setting.storeId = storeId;
    return SettingEntity.update(id, _setting);
  }
}
