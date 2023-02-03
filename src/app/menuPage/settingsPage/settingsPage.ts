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
import {AppVersion} from '@ionic-native/app-version/ngx';

@Component({
  selector: 'settings',
  templateUrl: 'settingsPage.html',
  styleUrls: ['settingsPage.scss']
})
export class SettingsPage {

  GlobalFields = GlobalFields;

  appVersionNumber='';

  navigateAsRoot = false;

  constructor(private service: Service, public translate: TranslateService, public navController: NavController,
              private dialogs: Dialogs, private platform: Platform, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder,
              private alertController: AlertController, private themeService: ThemeService,
              private locationService: LocationService, public inAppBrowser: InAppBrowser, public appVersion: AppVersion) {
    this.appVersion.getVersionNumber().then(value => {
      this.appVersionNumber = value;
    }).catch(err => {
      console.log(err);
    });

  }

  ionViewDidEnter() {
    //To avoid showing the back button if the navigation to this page is as root page
    this.navigateAsRoot = GlobalFields.navigateAsRoot;
    GlobalFields.navigateAsRoot = false;
  }


  clearCache() {
    this.service.clearAllCache();
    this.GlobalFields.loading = true;
    setTimeout(() => {
      GlobalFields.init(this.service, this.dialogs, this.platform, this.geolocation, this.nativeGeocoder, this.alertController, this.translate, this.themeService, this.locationService);
    }, 200);

  }

  setLang(lang) {
    GlobalFields.setLang(lang, this.translate);
    GlobalFields.loading = true;
    setTimeout(() => {
      GlobalFields.loading = false;
    }, 100);
  }


  goBack() {
    this.navController.pop();
  }

  openLink(url: string) {
    console.log(url);
    const browser = this.inAppBrowser.create(url, '_blank');
    // browser.close();
  }
}
