import { ApiProperty } from "@nestjs/swagger";

 enum ViewE {
    day = 'day',
    day_3 = 'day_3',
    week = 'week',
}

export class QueryBookingByStaffDto {
    staffId?: string = '';
    date: string = new Date().toLocaleDateString("sv");

    @ApiProperty({
        enum: ViewE,
        isArray: true,
        example: [ViewE.day, ViewE.day_3, ViewE.week],
    })
    view: string = ViewE.day;
}