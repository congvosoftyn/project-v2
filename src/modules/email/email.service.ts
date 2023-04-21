import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from "path";

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    sendMail(options: ISendMailOptions) {
        try {
            return this.mailerService.sendMail(options).catch(console.error);
        } catch (error) {
            console.log(error);
        }
    }

    // async sendRescheduleAppointment(bookingId: number, timezone: string) {
    //     const booking = await AppointmentBookingEntity.createQueryBuilder('booking')
    //         .leftJoinAndSelect('booking.service', 'service')
    //         .leftJoinAndSelect('booking.customer', 'customer')
    //         .leftJoinAndSelect('booking.staff', 'staff')
    //         .where('booking.id = :id', { id: bookingId })
    //         .getOne()
    //     if (!booking.customer.email) return;

    //     const options: Intl.DateTimeFormatOptions = {
    //         timeZone: timezone,
    //         timeZoneName: 'short',
    //         weekday: 'short',
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         hour12: true
    //     }

    //     try {
    //         return this.sendMail({
    //             to: booking.customer.email,
    //             subject: `Appointment has been booked: ${booking.service.name} with ${booking.staff.name}`,
    //             template: 'appointment-reschedule.html',
    //             context: {
    //                 customer: `${booking.customer.firstName} ${booking.customer.lastName}`,
    //                 from: new Date(booking.lastDate).toLocaleString('en-US', options),
    //                 to: new Date(booking.date).toLocaleString('en-US', options),
    //                 serviceName: booking.service.name,
    //                 staff: booking.staff.name
    //             },
    //         })
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }


    // async sendConfirmAppointment(bookingId: number, timezone: string) {
    //     const booking = await AppointmentBookingEntity.createQueryBuilder('booking')
    //         .leftJoinAndSelect('booking.service', 'service')
    //         .leftJoinAndSelect('booking.customer', 'customer')
    //         .leftJoinAndSelect('booking.staff', 'staff')
    //         .where('booking.id = :id', { id: bookingId })
    //         .getOne()

    //     if (!booking.customer.email) return;

    //     const options: Intl.DateTimeFormatOptions = {
    //         timeZone: timezone,
    //         timeZoneName: 'short',
    //         weekday: 'short',
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         hour12: true
    //     }

    //     try {
    //         return this.sendMail({
    //             to: booking.customer.email,
    //             subject: `Appointment has been booked: ${booking.service.name} with ${booking.staff.name}`,
    //             template: 'appointment-booked.html',
    //             context: {
    //                 customer: `${booking.customer.firstName} ${booking.customer.lastName}`,
    //                 from: new Date(booking.lastDate).toLocaleString('en-US', options),
    //                 to: new Date(booking.date).toLocaleString('en-US', options),
    //                 serviceName: booking.service.name,
    //                 staff: booking.staff.name
    //             },
    //             // date: booking.date
    //         })
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    // private createAppointmentICS(booking: AppointmentBookingEntity, timezone: string) {
    //     const ical = require('ical-generator');
    //     const endDate = new Date(booking.date);
    //     const options: Intl.DateTimeFormatOptions = {
    //         timeZone: timezone,
    //         timeZoneName: 'short',
    //         weekday: 'short',
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         hour12: true
    //     };
    //     endDate.setMinutes(endDate.getMinutes() + booking.service.serviceDuration);
    //     const cal = ical({
    //         domain: 'uzmos.com',
    //         prodId: { company: 'Solutrons', product: 'Uzmos', language: 'EN' },
    //         name: booking.service.name + ' with ' + booking.staff.name,
    //         timezone: timezone,
    //         scale: 'gregorian'
    //     });
    //     const event = cal.createEvent({
    //         start: new Date(booking.date),
    //         status: 'CONFIRMED',
    //         end: endDate,
    //         summary: booking.staff.name + ' - ' + booking.customer.firstName + booking.customer.lastName + ' - ' + booking.service.name,
    //         description: `
    //         Appointment Details
    //         When: ${new Date(booking.date).toLocaleString('en-US', options)}
    //         Service: ${booking.service.name}
    //         Provider Name: ${booking.staff.name}
            
    //         Customer Details
    //         Customer Name: ${booking.customer.firstName + ' ' + booking.customer.lastName}
    //         Email: ${booking.customer.email}
            
    //         Company Details
    //         Name: ${booking.staff.name}`,
    //         organizer: 'Uzmos <no-reply@uzmos.com>'
    //     });
    //     return cal;
    // }

    getMailTemplate(file: string): string {
        let filepath = path.join(__dirname, file);
        let data = fs.readFileSync(filepath);
        return data.toString('utf8', 0, data.length);
    }


    async sendNewUserPassword(toEmail: string, name: string, pass: string) {
        try {
            return this.sendMail({
                to: toEmail,
                subject: `Login details`,
                template: 'new-user.html',
                context: {
                    name: name,
                    email: toEmail,
                    password: pass
                },
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async sendForgotEmail(toEmail: string, name: string, pass: string) {
        try {
            return this.sendMail({
                to: toEmail,
                subject: `Forgot password`,
                template: 'forgot-password.html',
                context: {
                    name: name,
                    password: pass
                },
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async sendVerifyEmail(toEmail: string, name: string, code: string) {
        const url = `https://uzmos.com/verify/?code=${code}&email=${toEmail}`;

        try {
            return this.sendMail({
                to: toEmail,
                subject: `Email Verification Code`,
                template: 'confirm-email.html',
                context: {
                    name,
                    code,
                    url
                },
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async newAccount(toEmail: string, name: string) {
        try {
            return this.sendMail({
                to: toEmail,
                subject: `Email Verification Code`,
                template: 'new-user.html',
                context: {
                    name,
                    email: toEmail,
                },
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async badReview(toEmail: string, phoneNumber: string, review: string) {
        try {
            return this.sendMail({
                to: toEmail,
                subject: `Someone left a bad review!!`,
                template: 'bad-review-notification.html',
                context: {
                    phoneNumber,
                    review,
                    email: toEmail,
                },
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async sendContactUsEmail(toEmail: string, subject: string, message: string) {
        try {
            return this.sendMail({
                from: '"Uzmos"<no-reply@uzmos.com>',
                to: toEmail,
                subject: subject,
                html: message
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
