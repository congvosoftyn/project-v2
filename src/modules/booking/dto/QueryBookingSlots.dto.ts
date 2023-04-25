export class QueryBookingSlotsDto {
    // date: string = (new Date()).toISOString();
    date: string = new Date().toLocaleDateString('en-GB');
    timezone: string = "America/Chicago";
    staffId: number;
}