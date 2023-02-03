export class NotificationPayload {
  body?: string;
  fromProjectNumber?: string;
  groupMessage?: string;
  lockScreenVisibility?: number;
  notificationID?: string;
  priority?: number;
  rawPayload?: string;
  title?: string;
  launchURL?: string;
  additionalData?: {
    notification_type?: number, //1: Msg notification, null: Msg from onesignal console or listing update
    //If notification_type=1: Msg notification
    sender?: {
      firstname?: string,
      displayname?: string,
      nickname?: string,
      id?: number,
      email?: string,
      lastname?: string,
      username?: string
    }
    //If notification_type=null: Msg from onesignal console or listing update
    bigPicture?: string,
    lockScreenVisibility?: number,
    groupMessage?: string
  };
}


export class Notification {
  isAppInFocus?: boolean;
  shown?: boolean;
  displayType?: number;
  androidNotificationId?: number;
  payload?: NotificationPayload;
}
