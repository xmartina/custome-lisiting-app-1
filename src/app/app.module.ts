import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {Service} from './services/Service';
import {ModalAddNode} from './tabs/modalAdd/modalAdd';
import {ModalPost} from './home/modalPost/modalPost';
import {ListingPage} from './listingPage/listingPage';
import {FilterModal} from './searchPage/filterModal/filterModal';
import {PopoverSearch} from './home/popoverSearch/popoverSearch';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {CacheModule} from 'ionic-cache';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ThemeService} from './services/theme.service';
import {LocationService} from './services/LocationService';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {LaunchNavigator} from '@ionic-native/launch-navigator/ngx';
import {HomePageModule} from './home/home.module';
import {SearchPageModule} from './searchPage/search.module';
import {SharedModule} from './shared.module';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {PopoverRatings} from './listingPage/popoverRatings/popoverRatings';
import {PopoverImg} from './listingPage/popoverImg/popoverImg';
import {SideMenu} from './sideMenu/sideMenu';
import {ModalWriteReview} from './listingPage/modalWriteReview/modalWriteReview';
import {IonicImageLoader} from 'ionic-image-loader';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {ListingList} from './listingList/listingList';
import {LoginComponentModule} from './menuPage/loginComponent/loginComponent.module';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {CustomFieldsToDisplay} from './listingList/customFieldsToDisplay/customFieldsToDisplay';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {WooCommerceService} from './services/WooCommerceService';
import {GooglePlus}from '@ionic-native/google-plus/ngx'
import {Facebook} from '@ionic-native/facebook/ngx';
import {ModalGenericSearch} from './home/modalGenericSearch/modal-generic-search.component';
import {AppVersion} from '@ionic-native/app-version/ngx';


// imgCache: https://www.npmjs.com/package/ionic-image-loader

@NgModule({
  declarations: [
    AppComponent,
    ModalAddNode,
    ModalPost,
    ListingPage,
    SideMenu,
    PopoverRatings,
    ModalWriteReview,
    PopoverImg,
    FilterModal,
    PopoverSearch,
    ModalGenericSearch
  ],
  entryComponents: [
    ListingPage,
    SideMenu,
    PopoverRatings,
    ModalWriteReview,
    PopoverImg,
    ModalPost,
    FilterModal,
    PopoverSearch,
    ModalAddNode,
    ListingList,
    CustomFieldsToDisplay,
    ModalGenericSearch
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    CacheModule.forRoot({keyPrefix: 'custom-listing-app'}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    HomePageModule,
    SearchPageModule,
    SharedModule,
    LoginComponentModule
  ],
  providers: [
    Service,
    ThemeService,
    LocationService,
    WooCommerceService,
    StatusBar,
    SplashScreen,
    Dialogs,
    Geolocation,
    NativeGeocoder,
    LaunchNavigator,
    CallNumber,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    SocialSharing,
    NativeStorage,
    WebView,
    IonicImageLoader,
    ImagePicker,
    InAppBrowser,
    Base64,
    OneSignal,
    GooglePlus,
    Facebook,
    AppVersion
  ],
  exports: [RouterModule, SharedModule, TranslateModule, SideMenu],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
