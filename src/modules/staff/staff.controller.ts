import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StaffEntity } from 'src/entities/Staff.entity';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ImportStaffDto } from './dto/import-staff.dto';
import { QueryBookingByStaffDto } from './dto/query-booking-staff.dto';
import { QueryStaffServices } from './dto/query-staff-services.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffService } from './staff.service';
import { AddServiceToStaffDto } from './dto/add-service-to-staff.dto';

@Controller('appointment/staff')
@ApiTags('appointment/staff')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async createStaff(@Body() body: CreateStaffDto, @User('storeId') storeId: number) {
        return this.staffService.createStaff(body as StaffEntity, storeId);
    }

    @Get()
    async getStaffs(@User('storeId') storeId: number, @Query() query: QueryStaffServices) {
        return this.staffService.getStaffs(storeId, query);
    }

    @Get("/staffs/services")
    getStaffByPackages(@Query() query: QueryStaffServices, @User('storeId') storeId: number) {
        return this.staffService.getStaffByServices(query, storeId);
    }

    @Get("/calendar")
    getBookingByStaff(@Query() query: QueryBookingByStaffDto, @User('storeId') storeId: number, @User('companyId') companyId: number) {
        return this.staffService.getBookingByStaff(query, storeId, companyId);
    }

    @Put("/:staffId/services")
    addServiceToStaff(@Param("staffId") staffId: number, @User("storeId") storeId: number, @Body() body: AddServiceToStaffDto) {
        return this.staffService.addServiceToStaff(staffId, storeId, body);
    }

   

    @Post('/import')
    @UsePipes(new ValidationPipe())
    async importStaff(@Body() body: ImportStaffDto, @User('storeId') storeId: number) {
        return this.staffService.importStaff(body.staffs as unknown as StaffEntity[], storeId);
    }

    @Patch()
    @UsePipes(new ValidationPipe())
    async updateStaff(@Body() body: UpdateStaffDto) {
        return this.staffService.updateStaff(body as StaffEntity);
    }

    @Get('/:staffId')
    getStaff(@Param('staffId') staffId: number, @User('storeId') storeId: number) {
        return this.staffService.getStaff(staffId, storeId);
    }

    @Delete('/:id')
    async deleteStaff(@Param('id') id: number) {
        return this.staffService.deleteStaff(id);
    }
}
