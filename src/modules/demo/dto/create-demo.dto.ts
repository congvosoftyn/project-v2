export class CreateDemoDto {
    name: string;
    date: Date;
    startDate: Date = new Date();
    endDate: Date = new Date();
}
