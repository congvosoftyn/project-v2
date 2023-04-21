import { Body, Controller, Get, Param, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SettingService } from './setting.service';

@Controller('appointment/appointment-setting')
@ApiTags('appointment/appointment-setting')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class SettingController {
    constructor(private readonly settingService: SettingService) { }

    @Get()
    async getSetting(@User('storeId') storeId: number) {
        return this.settingService.getSetting(storeId);
    }

    @Put('/:id')
    @UsePipes(new ValidationPipe())
    async updateSetting(@Param('id') id: number, @Body() newSetting: CreateSettingDto, @User('storeId') storeId: number) {
        return this.settingService.updateSetting(id, newSetting, storeId);
    }
}
