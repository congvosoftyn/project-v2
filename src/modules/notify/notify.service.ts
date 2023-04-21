import { Injectable } from '@nestjs/common';
import { PROJECT_ID_FIREBASE, SECRET_KEY_FIREBASE, URL_FIREBASE } from 'src/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class NotifyService {
  constructor(
    private readonly httpService: HttpService,
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
  ) { }

  private subscribeNotiDiviceGroup(nameGroup: string, deviceTokens: string[]): Promise<AxiosResponse<unknown>> {
    return this.httpService.axiosRef.post(`${URL_FIREBASE}/notification`, {
      "operation": "create",
      "notification_key_name": `${nameGroup}`,
      "registration_ids": deviceTokens
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${SECRET_KEY_FIREBASE}`,
        "project_id": `${PROJECT_ID_FIREBASE}`
      }
    })
  }

  private sendNotiDiviceGroup(to: string, content: string): Promise<AxiosResponse<unknown>>  {
    return this.httpService.axiosRef.post(`${URL_FIREBASE}/send`, {
      "to": `${to}`,
      "data": { "hello": `${content}` }
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${SECRET_KEY_FIREBASE}`,
      }
    })
  }

  subscribeNotiTopic(topic: string, deviceToken: string) {
    return this.firebase.messaging.subscribeToTopic(deviceToken, topic)
  }

  sendhNotiTopic(topic: string, body: string) {
    return this.firebase.messaging.sendToTopic(topic, {
      data: {},
      notification: {
        title: 'Charmsta',
        body: `${body}`,
      }
    }, {
      contentAvailable: true
    })
  }
  
  unSubscriptionNotiTopic(topic: string,deviceToken: string){
    return this.firebase.messaging.unsubscribeFromTopic(deviceToken,topic);
  }

}
