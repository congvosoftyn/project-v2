import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/modules/user/decorators/user.decorator';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { BookingService } from './booking.service';
import { CreateAppointmentDto } from './dto/create-booking.dto';
import { CancelBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { QueryBookingSlotsDto } from './dto/QueryBookingSlots.dto';
import { DrapBookingDetailDto } from './dto/drap-booking-detail.dto';

@Controller('bookings')
@ApiTags('bookings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService,) { }

    @Get()
    getAppointments(@User('storeId') storeId: number) {
        return this.bookingService.getAppointments(storeId);
    }

    @Get('/slots')
    getBookingSlots(@Query() query: QueryBookingSlotsDto, @User('storeId') storeId: number) {
        return this.bookingService.getBookingSlots(query, storeId);
    }

    @Post()
    @UsePipes(new ValidationPipe())
    createBookAppointment(@Body() booking: CreateAppointmentDto, @User('storeId') storeId: number) {
        return this.bookingService.createBookAppointment(booking, storeId);
    }

    @Get("/:serviceId/staffs")
    getStaffsByService(@Param("serviceId") serviceId: number, @User('storeId') storeId: number) {
        return this.bookingService.getStaffsByService(+serviceId, null, storeId);
    }

    @Get("/:staffId/services")
    getServicesByStaff(@Param("staffId") staffId: number, @User('storeId') storeId: number) {
        return this.bookingService.getStaffsByService(null, +staffId, storeId);
    }

    @Put('/:bookingId')
    updateAppointment(@Param('bookingId', ParseIntPipe) bookingId: string, @Body() booking: UpdateBookingDto, @User('storeId') storeId: number) {
        return this.bookingService.updateAppointment(+bookingId, booking, storeId);
    }

    @Put("/:bookingId/drag-booking-detail")
    updateDragBookingDetail(@Param('bookingId', ParseIntPipe) bookingId: string, @Body() bookingDetail: DrapBookingDetailDto, @User('storeId') storeId: number) {
        return this.bookingService.updateDragBookingDetail(+bookingId, bookingDetail, storeId)
    }

    @Patch('/:id')
    updateAppointmentStatus(@Param('id', ParseIntPipe) id: string, @Body() booking: CancelBookingDto, @User('userId') userId: number) {
        return this.bookingService.cancelAppointment(+id, booking, userId);
    }

    @Delete('/:id')
    deleteAppointment(@Param('id') id: number, @User('storeId') storeId: number, @User('userId') userId: number) {
        return this.bookingService.deleteAppointment(id, storeId, userId);
    }

    @Get("/:id")
    getBookingInfo(@Param('id', ParseIntPipe) id: string, @User('storeId') storeId: number) {
        return this.bookingService.findByBooking(+id, storeId);
    }

    // @Get('/calendar-slots')
    //  getCalendarSlot(@Query('date') date: Date, @Query('staffId') staffId: number, @User('storeId') storeId: number) {
    //     return this.bookingService.getCalendarSlot(date, staffId,storeId);
    // }
}
