import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {GlobalFields} from '../../GlobalFields';
import {Service} from '../../services/Service';
import {AlertController, NavController, Platform} from '@ionic/angular';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import {ThemeService} from '../../services/theme.service';
import {LocationService} from '../../services/LocationService';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'notificationsPage',
  templateUrl: 'notificationsPage.html',
  styleUrls: ['notificationsPage.scss']
})
export class NotificationsPage {

  GlobalFields = GlobalFields;


  constructor(private service: Service, public translate: TranslateService, public navController: NavController,
              public inAppBrowser: InAppBrowser) {

    this.service.getNotifications();

  }

  openLink(url: string) {
    console.log(url);
    const browser = this.inAppBrowser.create(url, '_blank');
    // browser.close();
  }


}
