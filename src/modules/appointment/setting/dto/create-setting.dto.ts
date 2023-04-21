export class CreateSettingDto{
  bookingSlotSize: number = 15;
  noteForCustomer?: string;
  cancellationPolicy: number = 0; // 0 for anythime, unit in hour
  offHoursBooking: boolean = false; //allow customer book off hour
  doubleBooking: boolean = false; //allow customer book off hour
  customServiceDuration: boolean = true;
  customServiceCost: boolean = true;
  appointmentSlots: number = 15; // slot in calendar, unit in minute
  weekStartDay: number = 1; // 1 for Monday, this setting for calendar
  reminder: boolean = true; // turn on of reminder
  bookingReminderMessage: string = 'Reminder for your appointment SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME.';
  reminderInMinute: number = 60;
  rebookingReminder: boolean = false;
  bookingChanges: boolean = true;
  bookingConfirmedMessage: string = `Your appointment has been booked with STAFF_NAME on BOOKING_DATE_TIME for SERVICE_NAME.`;
  bookingChangedMessage: string = `Your appointment for SERVICE_NAME with STAFF_NAME has been rescheduled to BOOKING_DATE_TIME.`;
  bookingCancelledMessage: string = `Your appointment for SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME has been removed.`;
  rebookingReminderInDay: number = 30;
  rebookingReminderMessage: string = `Hi FIRST_NAME, we have not seen you at STORE_NAME in a while! Book in a appointment today and receive 10% off. Call us or book online STORE_LINK`;
  didNotShow: boolean = false;
  didNotShowAfterMinute: number = 60;
  didNotShowMessage: string = `Hello FIRST_NAME, We did not see you today at STORE_NAME. Let us know when would be the best time to reschedule your appointment. Thank you and see you soon!`;
  folllowUp: boolean = false;
  folllowUpAfterMinute: number = 60;
  folllowUpMessage: string = `Hello FIRST_NAME, thanks for visit us at STORE_NAME! We hope you enjoyed your visit! If you did, we would love if you could leave us a review on Yelp!`;
  storeId?: number;
}