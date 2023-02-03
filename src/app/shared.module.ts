import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListingList} from './listingList/listingList';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {Loading} from './loading/loading';
import {IonicImageLoader} from 'ionic-image-loader';
import {CustomFieldsToDisplay} from './listingList/customFieldsToDisplay/customFieldsToDisplay';
import {ProductList} from './shopPage/productList/productList';
import {RouterModule} from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    IonicImageLoader,
    RouterModule
  ],
  declarations: [
    ListingList,
    Loading,
    CustomFieldsToDisplay,
    ProductList
  ],
  exports: [
    ListingList,
    CustomFieldsToDisplay,
    Loading,
    IonicImageLoader,
    TranslateModule,
    ProductList,
    RouterModule
  ]
})

export class SharedModule {
}
