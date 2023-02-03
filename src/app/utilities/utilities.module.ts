import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';

import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../shared.module';
import {GoogleMapsAutocomplete} from './googleMapsAutocomplete/googleMapsAutocomplete';
import {IonicImageLoader} from 'ionic-image-loader';
import {AgmOverlays} from 'agm-overlays';
import {AgmCoreModule} from '@agm/core';
import {Constants} from '../Constants';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {AgmDirectionModule} from 'agm-direction';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TranslateModule,

    //https://github.com/zyra/ionic-image-loader/tree/v4
    IonicImageLoader.forRoot(),

    //https://github.com/SebastianM/angular-googlemaps
    AgmOverlays,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: Constants.GoogleMapsKEY,
      libraries: ["places"]
    }),
    AgmJsMarkerClustererModule,
    // https://www.npmjs.com/package/agm-direction
    AgmDirectionModule,     // agm-direction
  ],
  declarations: [GoogleMapsAutocomplete],
  entryComponents: [GoogleMapsAutocomplete],
  exports: [
    GoogleMapsAutocomplete,
    AgmOverlays,
    AgmCoreModule,
    AgmJsMarkerClustererModule,
    AgmDirectionModule
  ],
})
export class UtilitiesModule {
}
