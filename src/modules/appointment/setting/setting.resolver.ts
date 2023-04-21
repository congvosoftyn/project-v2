import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppointmentSettingEntity } from 'src/entities/Setting.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { CreateSettingInput } from './dto/create-setting.input';
import { SettingService } from './setting.service';

@Resolver(() => AppointmentSettingEntity)
@UseGuards(JwtAuthenticationGuard)
export class SettingResolver {
  constructor(private readonly settingService: SettingService) { }

  @Query(() => AppointmentSettingEntity)
  async getSetting(@User('storeId') storeId: number) {
    return this.settingService.getSetting(storeId);
  }

  @Mutation(() => AppointmentSettingEntity)
  @UsePipes(new ValidationPipe())
  async updateSetting(@Args('id', { type: () => Int }) id: number, @Args('newSetting') newSetting: CreateSettingInput, @User('storeId') storeId: number) {
    return this.settingService.updateSetting(id, newSetting, storeId);
  }
}
