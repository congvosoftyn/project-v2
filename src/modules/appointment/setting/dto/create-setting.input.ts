import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateSettingInput {
  @Field(() => Int, { defaultValue: 15 })
  bookingSlotSize: number = 15;

  @Field(() => String, { nullable: true })
  noteForCustomer?: string;

  @Field(() => Int, { defaultValue: 0 })
  cancellationPolicy: number = 0; // 0 for anythime, unit in hour

  @Field(() => Boolean, { defaultValue: false })
  offHoursBooking: boolean = false; //allow customer book off hour

  @Field(() => Boolean, { defaultValue: false })
  doubleBooking: boolean = false; //allow customer book off hour

  @Field(() => Boolean, { defaultValue: true })
  customServiceDuration: boolean = true;

  @Field(() => Boolean, { defaultValue: true })
  customServiceCost: boolean = true;

  @Field(() => Int, { defaultValue: 15 })
  appointmentSlots: number = 15; // slot in calendar, unit in minute

  @Field(() => Int, { defaultValue: 1 })
  weekStartDay: number = 1; // 1 for Monday, this setting for calendar

  @Field(() => Boolean, { defaultValue: true })
  reminder: boolean = true; // turn on of reminder

  @Field(() => String, { defaultValue: 'Reminder for your appointment SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME.' })
  bookingReminderMessage: string = 'Reminder for your appointment SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME.';

  @Field(() => Int, { defaultValue: 60 })
  reminderInMinute: number = 60;

  @Field(() => Boolean, { defaultValue: false })
  rebookingReminder: boolean = false;

  @Field(() => Boolean, { defaultValue: true })
  bookingChanges: boolean = true;

  @Field(() => String, { defaultValue: `Your appointment has been booked with STAFF_NAME on BOOKING_DATE_TIME for SERVICE_NAME.` })
  bookingConfirmedMessage: string = `Your appointment has been booked with STAFF_NAME on BOOKING_DATE_TIME for SERVICE_NAME.`;

  @Field(() => String, { defaultValue: `Your appointment for SERVICE_NAME with STAFF_NAME has been rescheduled to BOOKING_DATE_TIME.` })
  bookingChangedMessage: string = `Your appointment for SERVICE_NAME with STAFF_NAME has been rescheduled to BOOKING_DATE_TIME.`;

  @Field(() => String, { defaultValue: `Your appointment for SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME has been removed.` })
  bookingCancelledMessage: string = `Your appointment for SERVICE_NAME with STAFF_NAME on BOOKING_DATE_TIME has been removed.`;

  @Field(() => Int, { defaultValue: 30 })
  rebookingReminderInDay: number = 30;

  @Field(() => String, { defaultValue: `Hi FIRST_NAME, we have not seen you at STORE_NAME in a while! Book in a appointment today and receive 10% off. Call us or book online STORE_LINK` })
  rebookingReminderMessage: string = `Hi FIRST_NAME, we have not seen you at STORE_NAME in a while! Book in a appointment today and receive 10% off. Call us or book online STORE_LINK`;

  @Field(() => Boolean, { defaultValue: false })
  didNotShow: boolean = false;

  @Field(() => Int, { defaultValue: 60 })
  didNotShowAfterMinute: number = 60;

  @Field(() => String, { defaultValue: `Hello FIRST_NAME, We did not see you today at STORE_NAME. Let us know when would be the best time to reschedule your appointment. Thank you and see you soon!` })
  didNotShowMessage: string = `Hello FIRST_NAME, We did not see you today at STORE_NAME. Let us know when would be the best time to reschedule your appointment. Thank you and see you soon!`;

  @Field(() => Boolean, { defaultValue: false })
  folllowUp: boolean = false;

  @Field(() => Int, { defaultValue: 60 })
  folllowUpAfterMinute: number = 60;

  @Field(() => String, { defaultValue: `Hello FIRST_NAME, thanks for visit us at STORE_NAME! We hope you enjoyed your visit! If you did, we would love if you could leave us a review on Yelp!` })
  folllowUpMessage: string = `Hello FIRST_NAME, thanks for visit us at STORE_NAME! We hope you enjoyed your visit! If you did, we would love if you could leave us a review on Yelp!`;
}