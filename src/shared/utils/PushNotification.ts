import * as admin from "firebase-admin";
import { Expo } from 'expo-server-sdk';
import { FCM, STOREFCM } from "src/config";
import { CustomerEntity } from "src/entities/Customer.entity";
import { StoreEntity } from "src/entities/Store.entity";

export class PushNotification {
    options: admin.messaging.MessagingOptions = {
        priority: 'high',
        timeToLive: 60 * 60 * 24, // 1 day
    };
    constructor(isStore: boolean = false) {
        // prevent initlize app multiple times 
        if (!isStore) {
            if (!admin.apps.length) {
                const serviceAccount: any = FCM;
                try {
                    //admin.initializeApp();
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        databaseURL: "https://uzmos-53473.firebaseio.com"
                    });
                } catch (err) {
                    console.log(err)
                }

            }
        } else {
            if (!admin.apps.length) {
                const serviceAccount: any = STOREFCM;
                try {
                    //admin.initializeApp();
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        databaseURL: "https://uzmos-store.firebaseio.com"
                    });
                } catch (err) {
                    console.log(err)
                }

            }
        }


    }

    async sendToCustomer(id: number, message: string) {
        const customer = await CustomerEntity.findOneBy({ id });
        this.sendPushMessage(customer, message)
    }

    async sendToStore(storeId: number, message: string, link: string = '') {
        try {
            const store = await StoreEntity.findOneBy({ id: storeId });
            if (store.pushTokens.length > 0) {
                const payload: admin.messaging.MessagingPayload = {
                    notification: {
                        body: message,
                        clickAction: "FCM_PLUGIN_ACTIVITY",
                        icon: "myicon",
                        sound: "default",
                        badge: "1"
                    },
                    data: {
                        link // eg /home/wallet/
                    }
                };
                const result = await this.sendToDevice(store.pushTokens, payload);
                return result;
            }
        } catch (err) {
            console.log(err)
        }

    }

    // sendPushMessage now can be called directly by customer, // Customer.sendPushMessage(message,link)
    async sendPushMessage(customer: CustomerEntity, message: string, link: string = '') {
        if (customer && customer.fcmToken) {
            const payload: admin.messaging.MessagingPayload = {
                notification: {
                    body: message,
                    clickAction: "FCM_PLUGIN_ACTIVITY",
                    icon: "myicon",
                    sound: "default"
                },
                data: {
                    link // eg /home/wallet/
                }
            };
            if (Expo.isExpoPushToken(customer.fcmToken)) {
                return await this.sendExpoNotification([customer.fcmToken], message, link)
            }

            return await this.sendToDevice(customer.fcmToken, payload);
        }
    }

    async sendToDevice(token: string | string[], payload: admin.messaging.MessagingPayload) {
        return await admin.messaging().sendToDevice(token, payload, this.options);
    }

    async sendExpoNotification(tokens: string[], messageBody: string, link: string = '') {
        // Create a new Expo SDK client
        // optionally providing an access token if you have enabled push security
        let expo = new Expo();

        // Create the messages that you want to send to clients
        let messages = [];
        for (let pushToken of tokens) {
            // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

            // Check that all your push tokens appear to be valid Expo push tokens
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
            messages.push({
                to: pushToken,
                sound: 'default',
                body: messageBody,
                data: { link },
            })
        }

        // The Expo push notification service accepts batches of notifications so
        // that you don't need to send 1000 requests to send 1000 notifications. We
        // recommend you batch your notifications to reduce the number of requests
        // and to compress them (notifications with similar content will get
        // compressed).
        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        let successCount = 0;
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log('ticketChunk', ticketChunk);
                tickets.push(...ticketChunk);
                // NOTE: If a ticket contains an error code in ticket.details.error, you
                // must handle it appropriately. The error codes are listed in the Expo
                // documentation:
                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            } catch (error) {
                console.error(error);
            }
        }


        // Later, after the Expo push notification service has delivered the
        // notifications to Apple or Google (usually quickly, but allow the the service
        // up to 30 minutes when under load), a "receipt" for each notification is
        // created. The receipts will be available for at least a day; stale receipts
        // are deleted.
        //
        // The ID of each receipt is sent back in the response "ticket" for each
        // notification. In summary, sending a notification produces a ticket, which
        // contains a receipt ID you later use to get the receipt.
        //
        // The receipts may contain error codes to which you must respond. In
        // particular, Apple or Google may block apps that continue to send
        // notifications to devices that have blocked notifications or have uninstalled
        // your app. Expo does not control this policy and sends back the feedback from
        // Apple and Google so you can handle it appropriately.
        let receiptIds = [];
        for (let ticket of tickets) {
            // NOTE: Not all tickets have IDs; for example, tickets for notifications
            // that could not be enqueued will have error information and no receipt ID.
            if (ticket.id) {
                receiptIds.push(ticket.id);
            }
            if (ticket.status === 'ok') {
                successCount++;
            }
        }

        let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (let chunk of receiptIdChunks) {
            try {
                let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
                console.log('receipt', receipts);

                // The receipts specify whether Apple or Google successfully received the
                // notification and information about an error, if one occurred.
                for (let receiptId in receipts) {

                    let { status, details } = receipts[receiptId];
                    if (status === 'ok') {

                        continue;
                    }
                    // else if (status === 'error') {
                    //     console.error(
                    //         `There was an error sending a notification: ${message}`
                    //     );
                    //     if (details && details.error) {
                    //         // The error codes are listed in the Expo documentation:
                    //         // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                    //         // You must handle the errors appropriately.
                    //         console.error(`The error code is ${details.error}`);
                    //     }
                    // }
                }
            } catch (error) {
                console.error(error);
            }
        }
        console.log(successCount)
        return { successCount }
    }
}