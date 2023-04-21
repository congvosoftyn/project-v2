import twilio = require('twilio')
import { MessageInstance, MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import Cache = require('mem-cache');
import { CallInstance, CallListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/call';
import moment from 'moment-timezone';
import { AppointmentBookingEntity } from 'src/entities/Booking.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { CustomerEntity } from 'src/entities/Customer.entity';
import { PushNotification } from './PushNotification';
import { BillingEntity } from 'src/entities/Billing.entity';
import { MessageSentEntity } from 'src/entities/MessageSent.entity';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from 'src/config';
const cache = new Cache();

export default class TextMessage {
    client: twilio.Twilio;
    constructor() {
        this.client = this.getTwilioClient();

    }

    private getTwilioClient() {
        const accountSid: string = process.env.TWILIO_ACCOUNT_SID || TWILIO_ACCOUNT_SID;
        const token: string = process.env.TWILIO_AUTH_TOKEN || TWILIO_AUTH_TOKEN;
        //Init Twilio
        return twilio(accountSid, token);
    }

    public static async bookingMessageReplace(message: string, booking: AppointmentBookingEntity) {
        if (!booking.store) {
            booking.store = await StoreEntity.findOne({ where: { id: booking.storeId }, relations: ['storeSetting'] })
        }
        // return message
        //     .replace('STORE_NAME', booking.store ? booking.store.name || '' : '')
        //     .replace('FIRST_NAME', booking.customer ? booking.customer.firstName || '' : '')
        //     .replace('LAST_NAME', booking.customer ? booking.customer.lastName || '' : '')
        //     .replace('STORE_PHONE', booking.store ? booking.store.phoneNumber : '')
        //     .replace('STAFF_NAME', booking.staff ? booking.staff.name : '')
        //     .replace('STORE_ADDRESS', booking.store.address + ' ' + booking.store.city + ' ' + booking.store.state + ' ' + booking.store.zipcode)
        //     .replace('STORE_LINK', booking.store ? booking.store.subDomain + ".uzmos.com" : '')
        //     .replace('SERVICE_NAME', booking.service ? booking.service.name : '')
        //     .replace('SERVICE_DURATION', booking.service ? booking.service.serviceDuration.toString() : '')
        //     .replace('BOOKING_DATE_TIME', moment(booking.date).tz(booking.store && booking.store.storeSetting ? booking.store.storeSetting.timeZone : 'America/Los_Angeles').format('MMMM Do YYYY @ h:mm a'))
        //     .replace('BOOKING_DATE', moment(booking.date).tz(booking.store && booking.store.storeSetting ? booking.store.storeSetting.timeZone : 'America/Los_Angeles').format('MMMM Do YYYY'))
        //     .replace('BOOKING_TIME', moment(booking.date).tz(booking.store && booking.store.storeSetting ? booking.store.storeSetting.timeZone : 'America/Los_Angeles').format('h:mm a'))
    }

    public async sendToCustomerId(customerId: number, message: string, companyId: number = null, link: string = '') {
        try {
            const customer = await CustomerEntity.findOneBy({ id: customerId });
            this.sendToCustomer(customer, message, companyId, link);
        } catch (err) {
            console.log(err)
        }
    }

    public async sendToCustomer(customer: CustomerEntity, message: string, companyId: number = null, link: string = '') {
        const push = new PushNotification();
        const pushResponse = await push.sendPushMessage(customer, message, link);
        // First try to push notification with firebase cloud message if it fails then send text message to customer
        if (pushResponse && pushResponse.successCount) return pushResponse;

        // if (companyId) {
        //     const messageBalance = await BillingEntity.getMessageBalance(companyId)
        //     if (messageBalance > 0) {
        //         return this.sendAndUpdateMessage(customer, message, companyId);
        //     }
        //     return;
        // }
        return this.sendAndUpdateMessage(customer, message);
    }

    private async sendAndUpdateMessage(customer: CustomerEntity, message: string, companyId?: number) {
        const textResponse: MessageInstance = await this.sendMessage(customer.phoneNumber, message);
        if (companyId && textResponse && (textResponse.status === 'sent' || textResponse.status === 'queued' || textResponse.status === 'sending')) {
            const messageSent = new MessageSentEntity();
            messageSent.companyId = companyId;
            messageSent.customerId = customer.id;
            messageSent.fromNumber = textResponse.from;
            messageSent.toNumber = textResponse.to;
            messageSent.messageBody = textResponse.body;
            messageSent.messageId = textResponse.sid;
            messageSent.price = textResponse.price;
            messageSent.status = textResponse.status;
            messageSent.priceUnit = textResponse.priceUnit;
            messageSent.created = new Date();
            await messageSent.save();
        }
        return textResponse;
    }


    public async callPhone(phoneNumber: string, message: string) {
        const VoiceResponse = twilio.twiml.VoiceResponse;
        const response = new VoiceResponse();
        response.say(message);
        const twiml = response.toString();
        const callOps: CallListInstanceCreateOptions = {
            from: process.env.TWILIO_NUMBER || '',
            to: phoneNumber,
            twiml
        }
        try {
            return await this.client.calls.create(callOps)
        } catch (err) {
            return { status: 'failed' } as CallInstance;
        }
    }

    public async sendMessage(phoneNumber: string, message: string) {
        const msgData: MessageListInstanceCreateOptions = {
            from: process.env.TWILIO_NUMBER || '',
            to: phoneNumber,
            body: message,
            statusCallback: process.env.API_URL + '/review/messageStatus'
        };
        try {
            return await this.client.messages.create(msgData);
        } catch (err) {
            return { status: 'failed' } as MessageInstance;
        }
    }

    private generateOneTimeCode() {
        const codeLength = 4;
        return Math.floor(Math.random() * (Math.pow(10, (codeLength - 1)) * 9)) + Math.pow(10, (codeLength - 1));
    }

    getExpiration() {
        return 900;
    }

    requestCode(phone: string) {
        const opt = this.generateOneTimeCode();
        cache.set(phone, opt, this.getExpiration() * 1000);
        const smsMessage = `Your Uzmos verification code is ${opt}`;
        this.sendMessage(phone, smsMessage).then((message) => {
            console.log(message.status)
        });
    }

    resentCode(phone: string) {
        if (this.resetCode(phone)) {
            this.requestCode(phone);
        }
    }

    verifyCode(phone: string, smsMessage: string) {
        const opt = cache.get(phone);
        console.log(phone, opt)
        if (opt == null) {
            return false;
        }
        console.log(opt)
        if (smsMessage.indexOf(opt) > -1) {
            this.resetCode(phone);
            return true;
        } else {
            return false;
        }
    }

    resetCode(phone) {
        const opt = cache.get(phone);
        if (opt == null) {
            return false;
        }

        cache.remove(phone);
        return true;
    }
}
