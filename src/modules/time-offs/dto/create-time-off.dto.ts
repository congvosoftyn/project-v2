export class CreateTimeOffDto {
    allDay: boolean = false;
    staffId: number;
    startDate: Date; //repeat start date
    endDate: Date; //repeat end date
}
