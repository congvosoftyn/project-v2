import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateServiceDto } from './dto/create-service.dto';
import { GetServiceDto } from './dto/get-service.dto';
import { ServiceService } from './service.service';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
@ApiTags('services')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Get()
    async getServices(@Query() { search, size, page }: GetServiceDto, @User('storeId') storeId: number) {
        return this.serviceService.getServices(storeId, search, size, page);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async saveService(@Body() service: CreateServiceDto, @User('storeId') storeId: number) {
        return this.serviceService.createService(service, storeId);
    }

    @Put('/:id')
    updateService(@Param('id') id: number, @User('storeId') storeId: number, @Body() bodyUpdateService: UpdateServiceDto) {
        return this.serviceService.updateService(id, storeId, bodyUpdateService);
    }

    @Get("/:serviceId")
    findOneService(@Param("serviceId") serviceId: number){
        return this.serviceService.findByService(serviceId);
    }

    @Delete("/:serviceId")
    deleteService(@Param("serviceId") serviceId: number){
        return this.serviceService.deleteService(serviceId);
    }
}
