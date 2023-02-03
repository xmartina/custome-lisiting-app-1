import {Component, Input} from '@angular/core';
import {GlobalFields} from "../GlobalFields";
import {Service} from "../services/Service";
import {Dialogs} from "@ionic-native/dialogs/ngx";
import {AlertController, Platform} from "@ionic/angular";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {NativeGeocoder} from "@ionic-native/native-geocoder/ngx";
import {TranslateService} from "@ngx-translate/core";
import {ThemeService} from "../services/theme.service";
import {LocationService} from "../services/LocationService";

@Component({
    selector: 'loading',
    templateUrl: 'loading.html',
    styleUrls: ['loading.scss']

})
export class Loading {

    @Input() softLoading: boolean;

    GlobalFields = GlobalFields;

    constructor(private service: Service, private dialogs: Dialogs, private platform: Platform, private geolocation: Geolocation,
                private nativeGeocoder: NativeGeocoder, private alertController: AlertController, private translate: TranslateService,
                private themeService: ThemeService, private locationService: LocationService) {

    }


    retryInit(){
        GlobalFields.errorIni = false;
        this.service.clearAllCache();
        GlobalFields.init(this.service, this.dialogs, this.platform, this.geolocation, this.nativeGeocoder, this.alertController, this.translate, this.themeService, this.locationService);
    }

}
