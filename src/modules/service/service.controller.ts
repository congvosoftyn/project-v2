import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceService } from './service.service';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QuerySearchPaginationDto } from 'src/shared/dto/query-search-pagination.dto';
import { SearchServiceDTO } from './dto/search-service.dto';

@Controller('services')
@ApiTags('services')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Get()
    async getServices(@Query() queryService: QuerySearchPaginationDto, @User('storeId') storeId: number) {
        return this.serviceService.getServices(storeId, queryService);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async saveService(@Body() service: CreateServiceDto, @User('storeId') storeId: number) {
        return this.serviceService.createService(service, storeId);
    }

    @Get("/search")
    getSearchService(@Query() query: SearchServiceDTO, @User('storeId') storeId: number) {
        return this.serviceService.getSearchServiceWhenCreateBooking(query, storeId);
    }

    @Put('/:id')
    updateService(@Param('id') id: number, @User('storeId') storeId: number, @Body() bodyUpdateService: UpdateServiceDto) {
        return this.serviceService.updateService(id, storeId, bodyUpdateService);
    }

    @Get("/:serviceId")
    findOneService(@Param("serviceId") serviceId: number) {
        return this.serviceService.findByService(serviceId);
    }

    @Delete("/:serviceId")
    deleteService(@Param("serviceId") serviceId: number) {
        return this.serviceService.deleteService(serviceId);
    }

   
}
