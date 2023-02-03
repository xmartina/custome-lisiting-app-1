import {Component, ComponentRef} from '@angular/core';
import {ListingPage} from '../listingPage/listingPage';
import {Listing} from '../../app/entities/listing';
import {Post} from '../../app/entities/post';
import {Constants} from '../../app/Constants';
import {GlobalFields} from '../../app/GlobalFields';
import {AlertController, MenuController, ModalController, NavController, Platform, PopoverController} from '@ionic/angular';
import {ModalPost} from './modalPost/modalPost';
import {PopoverSearch} from './popoverSearch/popoverSearch';
import {Service} from '../services/Service';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {
  NativeGeocoder
} from '@ionic-native/native-geocoder/ngx';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {LocationService} from '../services/LocationService';
import {ImageAttribute} from 'ionic-image-loader';
import {SearchPageModule} from '../searchPage/search.module';
import {ModalGenericSearch} from './modalGenericSearch/modal-generic-search.component';
import {AppVersion} from '@ionic-native/app-version/ngx';


// DOC: https://ionicframework.com/docs/building/running

// to build the apk: sudo ionic cordova build --release android


// per testare app: https://cordova-plugin-fcm.appspot.com/

// PER GENERARE APK: sudo cordova build android --release


// FIREBASE EXAMPLE -> https://medium.com/factory-mind/angular-firebase-typescript-step-by-step-tutorial-2ef887fc7d71

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss']
})
export class HomePage {

  Constants = Constants;
  GlobalFields = GlobalFields;
  post = ListingPage;

  site_details: any;
  recentListings: Listing[];
  byTypesListings: Listing[][];
  resultSearchListings: Listing[] = [];
  posts: Post[] = [];

  oldScollPostion = 0;
  headerClass = '';

  slideOpts1 = {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true
  };
  slideOptsLess1 = {
    slidesPerView: 1.4,
    spaceBetween: 10,
    centeredSlides: true
  };

  slideOpts2 = {
    slidesPerView: 1.3

  };

  slideOpts3 = {
    slidesPerView: 2.8

  };

  loadingByTypes = true;

  public static popover = undefined;


  waitSearch = true;

  appName: string;

  constructor(public service: Service, public locationService: LocationService, public modalCtrl: ModalController, public popoverController: PopoverController,
              public navController: NavController, public statusBar: StatusBar, public platform: Platform, private nativeGeocoder: NativeGeocoder,
              private _sanitizer: DomSanitizer, public translate: TranslateService, public alertController: AlertController, private menu: MenuController,
              public appVersion: AppVersion) {


    /*  this.imgCacheService.store("http://www.like-agency.it/media/k2/items/cache/d6086de322f98f66cc694f32ea284557_XL.jpg").then( res =>{
          console.log(res);
      });
      this.imgCacheService.restore("http://www.like-agency.it/media/k2/items/cache/d6086de322f98f66cc694f32ea284557_XL.jpg");

*/

    this.appVersion.getAppName().then(value => {
      this.appName = value;
    }).catch(err => {
      this.appName = 'Custom Listing App';
    });

    service.getRecentListings()
      .subscribe((data: any) => {
        this.recentListings = data;
      });

    this.byTypesListings = [];
    for (let i = 0; i < this.GlobalFields.listingTypesDetails.length; i++) {
      this.loadingByTypes = true;
      this.byTypesListings.push([]);
      service.getListingsFilteredByType(GlobalFields.listingTypesDetails[i].ID)
        .subscribe((data: any) => {
          this.byTypesListings[i] = data;
          //  this.GlobalFields.getImgFeaturedListing(this.byTypesListings[i], this.service);
          console.log(this.byTypesListings);
          this.loadingByTypes = false;
        });
    }

    service.getRecentPosts()
      .subscribe((data: any) => {
        this.posts = data;
        this.posts.forEach(post => {
          service.getMediaById(post.featured_media)
            .subscribe((data: any) => {
                console.log('url: ' + data.source_url);
                if (data) {
                  post.img_cover = data.source_url;
                }
              }
            );
        });
      });

    this.GlobalFields.getMyAddress(this.service, this.locationService, this.nativeGeocoder);

  }

  subscription;
  ionViewDidEnter() {
    /* if (GlobalFields.site_details.homeType == 2)
         this.service.setTransparentBackgroundStatusBar();
     else*/
    this.service.setWhiteBlackBackgroundStatusBar();

   /* this.subscription = this.platform.backButton.subscribe(()=>{
      navigator['app'].exitApp();
    });*/
  }

  ionViewWillLeave(){
 //   this.subscription.unsubscribe();
  }

  /*
    openModalPost(post: Post) {
      let postModal = this.modalCtrl.create(ModalPost, {post: post});
      postModal.present();
    }
  */

  async openModalSearch() {

    const modal = await this.modalCtrl.create({
      component: ModalGenericSearch,
    });
    return await modal.present();
  }

  async openModalPost(post: Post) {

    const modal = await this.modalCtrl.create({
      component: ModalPost,
      componentProps: {post: post}
    });
    return await modal.present();
  }

  /*
      openModalListing(listing: Listing) {

          this.service.selectedListing = listing;

          const listingModal = this.modalCtrl.create(ListingPage);
          listingModal.present();

          //  this.navCtrl.push(ListingPage);

      }

  */


  getListingDetails(listing) {
    this.GlobalFields.loadingSoft = true;
    this.service.getListingDetailsById(listing.id).subscribe((data: Listing) => {
      this.GlobalFields.selectedListing = data;
      this.openModalListing();

    }, error => {
      console.log(error);
      let msg = '';
      if (error && error.error)
        msg = error.error.message;
      else if (error)
        msg = error.message;
      this.GlobalFields.openAlert(this.alertController, 'Error', 'Error on web server', msg);
      this.GlobalFields.loadingSoft = false;
    });
  }


  async openModalListing() {
    const listingModal = await this.modalCtrl.create({
      component: ListingPage,
    });
    return await listingModal.present();

    //  this.navCtrl.push(ListingPage);

  }

  isFeatured(listing: Listing) {
    /* if (!listing.listing_data._featured)
          return '';
      if (listing.listing_data._featured == '1')
          return 'featured';
      else */
    return '';
  }

  /*
    async openModalListing(listing: Listing) {
      const modal = await this.modalCtrl.create(ListingPage,{ listing: listing });
      return await modal.present();
    }
  */


  getRandomRegionBack(i: number) {
    let a = Math.round(i % 3) + 1;

    return '../../assets/imgs/r_' + a + '.jpg';

  }


  searchByName(ev: any) {
    this.GlobalFields.searchString = ev.target.value;
  }

  doTheSearch(ev?: any) {
    let val = this.GlobalFields.searchString;

    //stessa stringa, per limitare le chiamate
    if (val == this.GlobalFields.oldSearchString) {
      if (!HomePage.popover) {
        const otps = {cssClass: 'searchPopover', mode: 'ios'};
        this.presentPopover(otps);
      }
    }
    //stringa di cerca diversa dalla prima
    else {
      setTimeout(() => {
        this.waitSearch = false;
        if (!this.waitSearch && val && val != '') {
          this.service.getListingsBySearchString(val)
            .subscribe((data: any) => {
              this.resultSearchListings = data;
              this.GlobalFields.searchByStringListings = data;
              this.GlobalFields.oldSearchString = data;
              //this.GlobalFields.getImgFeaturedListing(this.GlobalFields.searchByStringListings, this.service);
            });

          if (!HomePage.popover) {
            const otps = {cssClass: 'searchPopover', mode: 'ios'};
            this.presentPopover(otps);
          }
          this.waitSearch = true;
        }
      }, 500);
    }
  }

  async presentPopover(otps: any) {

    HomePage.popover = await this.popoverController.create({
      component: PopoverSearch,
      cssClass: 'searchPopover',
      mode: 'ios',
      event: event
    });


    await HomePage.popover.present();
    HomePage.popover.onDidDismiss(() => {
      // Navigate to new page.  Popover should be gone at this point completely
      HomePage.popover = undefined;
    });
  }


  searchByType(id: any) {
    GlobalFields.clearFilters();
    GlobalFields.filtersSearch.selectedType = id;
    this.selectListingType();
    GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    this.navController.navigateForward('tabs/search');
  }

  searchByBasicSearchFilter() {
    GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    GlobalFields.basicSearch = true;
    this.navController.navigateForward('tabs/search');
  }

  toStringCategories(): string {
    if (!GlobalFields.filtersSearch.categories || GlobalFields.filtersSearch.categories.length == 0)
      return '';
    else if (GlobalFields.filtersSearch.categories.length > 3)
      return GlobalFields.filtersSearch.categories.length + ' selected';
    else
      return GlobalFields.filtersSearch.categories.toString();

  }

  isSelected(id: any) {
    if (this.GlobalFields.filtersSearch.selectedType == id)
      return ' selectedtypesListHorizontalWhite';
    else
      return '';
  }

  selectListingType() {
    GlobalFields.clearFilters();
    console.log(this.GlobalFields.filtersSearch.selectedType);
    this.GlobalFields.selectListingTypeDetail();

  }


  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(to top, rgba(255, 255, 255, 0.17), rgba(23, 23, 23, 0.38)), url(${image})`);
  }

  getMyAddress() {
    this.GlobalFields.filtersSearch.location = GlobalFields.address;
  }


  searchNearMe() {
    console.log(this.GlobalFields.address);
    this.GlobalFields.filtersSearch.location = this.GlobalFields.address;
    // set default value to the proximity range
    this.GlobalFields.filtersSearch.range = GlobalFields.getDefaultProximity('basic');
    this.GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    this.navController.navigateForward('tabs/search');
  }


  toStringTaxonomies(key: string): string {
    let tax = GlobalFields.getCustomTaxonomiesByKey(key);
    if (tax) {
      return tax.selected;
    }

  }

  toStringCustomFields(key: string): string {
    let tax = GlobalFields.getCustomFieldsByKey(key);
    if (tax) {
      /*  if (!tax.selected || tax.selected.length == 0)
            return "";
        else if (tax.selected.length > 3)
            return tax.selected.length + " selected";
        else {*/
      return tax.selected;
      // }
    }

  }

  toStringRegions(): string {

    if (!GlobalFields.filtersSearch.region)
      return '';
    return GlobalFields.filtersSearch.region;

  }


  onScrollHideHeader(event: CustomEvent) {
    // console.log(event);
    if (event.detail.scrollTop > 50 && !this.isElementInViewPort()) {
      if (this.oldScollPostion < event.detail.scrollTop)
        this.headerClass = 'headerHidden';
      if (this.oldScollPostion > event.detail.scrollTop)
        this.headerClass = 'headerShown';
    }
    this.oldScollPostion = event.detail.scrollTop;
  }

  //This function just check if element is fully in vertical viewport or not
  isElementInViewPort() {
    let el = document.getElementById('check-point');
    if (el) {
      const rect = el.getBoundingClientRect();
      return rect.bottom <= window.innerHeight;
    }
    return true;
  }


  getImgCachedClass(class_to_add: string): ImageAttribute[] {
    let class_name = 'shadedImgCached ' + class_to_add;

    const imageAttributes: ImageAttribute[] = [];
    imageAttributes.push({
      element: 'class',
      value: class_name
    });


    return imageAttributes;
  }

  getBackgroundBasedOnHomeType() {
    if (GlobalFields.site_details.homeType == 3)
      return GlobalFields.getBodyColorBackgroundJson();
  }

  openSideMenu() {
    this.menu.enable(true, 'appMenu');
  }
}


