import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {NgModule} from '@angular/core';
import {SearchPage} from './searchPage';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../shared.module';
import {MapModal} from './mapModal/mapModal';
import {AgmOverlays} from 'agm-overlays';
import {AgmCoreModule} from '@agm/core';
import {Constants} from '../Constants';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {AgmDirectionModule} from 'agm-direction';
import {UtilitiesModule} from '../utilities/utilities.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: SearchPage
      }
    ]),
    TranslateModule,
    UtilitiesModule,

  ],
  declarations: [SearchPage, MapModal],
  exports: [MapModal, UtilitiesModule]
})
export class SearchPageModule {
}
