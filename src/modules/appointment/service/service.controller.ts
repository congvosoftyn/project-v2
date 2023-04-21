import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductEntity } from 'src/entities/Product.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServiceDto } from './dto/get-service.dto';
import { ServiceService } from './service.service';

@Controller('appointment/service')
@ApiTags('appointment/service')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Get()
    async getServices(@Query() { search, size, page }: GetServiceDto, @User('storeId') storeId: number) {
        return this.serviceService.getServices(storeId, search, size, page);
    }

    @Get('/cats')
    async getCategories(@User('storeId') storeId: number) {
        return this.serviceService.getCategories(storeId);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async saveService(@Body() service: CreateServiceDto, @User('storeId') storeId: number) {
        return this.serviceService.saveService(service, storeId);
    }

    @Put('/:id')
    updateService(@Param('id') id: number, @Body() service: CreateServiceDto,) {
        const _service = service as unknown as ProductEntity;
        _service.isService = true;
        return this.serviceService.updateService(id, _service);
    }

    @Get("/:serviceId/staffs")
    getStaffsByServices(@Param('serviceId') serviceId: number, @Query() { search }: GetServiceDto) {
        return this.serviceService.getStaffsByServices(serviceId, search);
    }
}
