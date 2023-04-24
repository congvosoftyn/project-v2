export class CreateTimeOffDto {
    allDay: boolean = false;
    staffId: number;
    note?: string;
    repeat: string; // Daily, Weekly, Monthly
    repeatEvery: number = 1; // 1 day, 2 week, or 6 month
    repeatOn?: number[]; // 0: Sunday, 1: Monday, and so on 
    startDate: Date; //repeat start date
    endDate: Date; //repeat end date
    duration: number = 30;
}
