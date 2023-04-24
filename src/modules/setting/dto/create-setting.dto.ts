export class CreateSettingDto{
  offHoursBooking: boolean = false; //allow customer book off hour
  doubleBooking: boolean = false; //allow customer book off hour
  customServiceDuration: boolean = true;
  customServiceCost: boolean = true;
  appointmentSlots: number = 15; // slot in calendar, unit in minute
  weekStartDay: number = 1; // 1 for Monday, this setting for calendar
}