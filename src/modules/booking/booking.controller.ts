import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { BookingService } from './booking.service';
import { CreateAppointmentDto } from './dto/create-booking.dto';
import { QueryHistoryByDateDto } from './dto/QueryHistoryByDate.dto';
import { CancelBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingSlotsDto } from './dto/QueryBookingSlots.dto';

@Controller('bookings')
@ApiTags('bookings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    @Get()
    async getAppointments(@User('storeId') storeId: number, @User('companyId') companyId: number) {
        return this.bookingService.getAppointments(storeId, companyId);
    }

    @Get('/slots')
    async getBookingSlots(@Query() _query: QueryBookingSlotsDto) {
        return this.bookingService.getBookingSlots(_query);
    }

    // @Get('/calendar-slots')
    // @ApiBearerAuth('access-token')
    // @UseGuards(JwtAuthenticationGuard)
    // async getCalendarSlot(@Query('date') date: Date, @Query('staffId') staffId: number) {
    //     return this.bookingService.getCalendarSlot(date, staffId);
    // }

    @Post()
    @UsePipes(new ValidationPipe())
    async createBookAppointment(@Body() booking: CreateAppointmentDto, @User('storeId') storeId: number) {
        return this.bookingService.createBookAppointment(booking, storeId);
    }

    // @Put('/:id')
    // async updateAppointment(@Param('id', ParseIntPipe) id: string, @Body() booking: UpdateBookingDto, @User('userId') userId: number) {
    //     return this.bookingService.updateAppointment(+id, booking, userId);
    // }

    @Patch('/:id')
    async updateAppointmentStatus(@Param('id', ParseIntPipe) id: string, @Body() booking: CancelBookingDto, @User('userId') userId: number) {
        return this.bookingService.cancelAppointment(+id, booking, userId);
    }

    @Delete('/:id')
    async deleteAppointment(@Param('id') id: number, @User('storeId') storeId: number, @User('userId') userId: number) {
        return this.bookingService.deleteAppointment(id, storeId, userId);
    }

    @Get("/:id")
    getBookingInfo(@Param('id', ParseIntPipe) id: string) {
        return this.bookingService.findByBooking(+id)
    }


    // @Get('/history/customer/:id')
    // @ApiBearerAuth('access-token')
    // @UseGuards(JwtAuthenticationGuard)
    // async getHistoryByCustomer(@Param('id') id: number, @User('storeId') storeId: number,) {
    //     return this.bookingService.getHistoryByCustomer(id, storeId);
    // }

    // @Get('/history/date')
    // @ApiBearerAuth('access-token')
    // @UseGuards(JwtAuthenticationGuard)
    // @UsePipes(new ValidationPipe())
    // async getHistoryByDate(@Query() _query: QueryHistoryByDateDto, @User('storeId') storeId: number, @User('companyId') companyId: number) {
    //     return this.bookingService.getHistoryByDate(_query, storeId, companyId);
    // }

    // @Get('/history/status')
    // @UsePipes(new ValidationPipe())
    // async getHistoryStatus(@Query() _query: QueryHistoryByDateDto, @User('storeId') storeId: number) {
    //     return this.bookingService.getHistoryStatus(_query, storeId);
    // }

    
}
