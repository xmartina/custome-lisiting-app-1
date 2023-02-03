import {Injectable} from '@angular/core';
import {Constants} from '../Constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Listing} from '../entities/listing';
import {GlobalFields} from '../GlobalFields';
import {CacheService} from 'ionic-cache';
import {LocationService} from './LocationService';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NavController, Platform} from '@ionic/angular';
import {Profile} from '../entities/profile';
import {FieldsAddForm} from '../entities/listingTypeDetail';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {Facebook} from '@ionic-native/facebook/ngx';
import {Notification} from '../entities/Notification';
import {OneSignal, OSNotification} from '@ionic-native/onesignal/ngx';
import {User} from '../entities/user';


@Injectable({
  providedIn: 'root'
})

export class Service {

  selectedListing: Listing;

  GlobalFields: GlobalFields;

  public headers = new HttpHeaders({'Content-Type': 'multipart/form-data'});


  public suffix1 = '/wp-json/'; //PLEASE DON'T TOUCH IT
  public suffix2 = 'wp/v2/'; //PLEASE DON'T TOUCH IT
  public suffix3 = '/api/'; //PLEASE DON'T TOUCH IT
  public suffix4 = 'authenticationcla/'; //PLEASE DON'T TOUCH IT
  public suffix5 = 'bookmarkcla/'; //PLEASE DON'T TOUCH IT
  public suffix6 = 'listingcla/'; //PLEASE DON'T TOUCH IT
  public suffix7 = 'messagecla/'; //PLEASE DON'T TOUCH IT
  public suffix8 = 'packagecla/'; //PLEASE DON'T TOUCH IT
  public suffix2CustomApp = 'custom-listing-app/'; //PLEASE DON'T TOUCH IT


  constructor(private http: HttpClient, private cache: CacheService, private locationService: LocationService,
              private nativeStorage: NativeStorage, private statusBar: StatusBar, public platform: Platform,
              private googlePlus: GooglePlus, private fb: Facebook, private oneSignal: OneSignal, private navController: NavController) {
  }


  // doc della cache: https://www.npmjs.com/package/ionic-cache
  getWebSiteDetails() {
    let url = Constants.url + this.suffix1;
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
    //return this.http.get(Constants.url + this.suffix1);
  }

  // doc della cache: https://www.npmjs.com/package/ionic-cache
  getConfig() {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'config';
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
    // return this.http.get(url);
  }

  getCustomTaxonomies() {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'taxonomies';
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
  }

  getRecentListings() {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'search?limit=10&sort=latest&order=DESC';
    let cacheKey = url;
    let request = this.http.get(url);
    return this.cache.loadFromObservable(cacheKey, request);

  }

  getListingsBySearchString(search: any) {
    return this.http.get(Constants.url + this.suffix1 + this.suffix2 + 'job_listing?&orderby=relevance&order=asc&per_page=10&search=' + search);
  }


  getListingDetailsById(id: number) {
//    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'listing_detail/' + id;
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'listing/' + id;
    let cacheKey = url;
    let request = this.http.get(url);

    let TTL = 60 * 60 * 24; // 1 day

    return this.cache.loadFromObservable(cacheKey, request, 'listing-details', TTL);
    //return this.http.get(Constants.url + this.suffix1 + this.suffix2 + 'job_listing/' + id);
  }

  getAllTypesListings() {
    let url = Constants.url + this.suffix1 + this.suffix2 + 'case27_listing_type';
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
    //return this.http.get(Constants.url + this.suffix1 + this.suffix2 + 'case27_listing_type');
  }

  getAllTypeDetails() {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'types';
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
    //return this.http.get(Constants.url + this.suffix1 + this.suffix2CustomApp + 'types');
  }

  getAllTags() {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'tags';
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
    //return this.http.get(Constants.url + this.suffix1 + this.suffix2CustomApp + 'tags');
  }

  getAllCategoriesListings() {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'categories';
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
    //return this.http.get(Constants.url + this.suffix1 + this.suffix2CustomApp + 'categories');
  }

  getRecentPosts(page?: number) {
    var url = Constants.url + this.suffix1 + this.suffix2 + 'posts';
    page = page? page : 1;
    url = url + '?per_page=10&page=' + page

    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
  }

  getRegions() {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'regions';
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
    //return this.http.get(Constants.url + this.suffix1 + this.suffix2 + 'region?&order=desc&orderby=count');
  }

  getListingCoverDetails(href: string) {
    return this.http.get(href);
  }

  getMediaById(id: any): Observable<any> {
    return this.http.get(Constants.url + this.suffix1 + this.suffix2 + 'media/' + id);

  }

  getListingFiltered() {
    let cats = [];
    let categoriesParam = '';
    for (let i = 0; i < GlobalFields.filtersSearch.categories.length; i++) {
      let cat = GlobalFields.filtersSearch.categories[i];
      if (cat.isChecked) {
        cats.push(cat.val.id);
      }
    }

    categoriesParam = cats.toString();
    return this.http.get(Constants.url + this.suffix1 + this.suffix2 + 'job_listing?job_listing_category=' + categoriesParam);

  }

  getListingsFilteredByType(id: number) {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'search?limit=10&type=' + GlobalFields.getListingTypeKeyById(id);
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
  }

  getHtmlFromCustomPageUrl(pageID: string) {

    let url = Constants.url + this.suffix1 + this.suffix2 + 'pages/' + pageID;

    let request = this.http.get(url);
    let cacheKey = url;

    // return this.cache.loadFromObservable(cacheKey, request);
    return this.http.get(url, {responseType: 'text'});

  }

  public storeRecentViewedListing(listing: Listing) {
    this.getRecentViewedListing();
    if (!GlobalFields.recentViewedListings)
      GlobalFields.recentViewedListings = [];
    if (GlobalFields.recentViewedListings && GlobalFields.recentViewedListings.find(temp => temp.id == listing.id))
      return;

    if (GlobalFields.recentViewedListings.length == 10)
      GlobalFields.recentViewedListings[9] = listing;
    else
      GlobalFields.recentViewedListings.push(listing);

    this.nativeStorage.setItem('recentViewedListingCLA', {property: 'value', anotherProperty: GlobalFields.recentViewedListings})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
  }

  public getRecentViewedListing() {
    this.nativeStorage.getItem('recentViewedListingCLA')
      .then(
        data => {
          console.log(data);
          GlobalFields.recentViewedListings = data.anotherProperty;
        },
        error => console.error(error)
      );
  }


  public storeNotifications(notification: OSNotification) {

    //first get them
    this.nativeStorage.getItem('notificationsCLA')
      .then(
        data => {
          console.log(data);
          if (notification && data.anotherProperty)
            GlobalFields.notifications = data.anotherProperty;
          //store it
          this.storeNotifications2(notification);
        },
        error => {
          console.error(error);
          this.storeNotifications2(notification);
        }
      );
  }

  public storeNotifications2(notification: OSNotification) {
    if (!GlobalFields.notifications)
      GlobalFields.notifications = [];

    const a = [notification] as Notification[];
    GlobalFields.notifications = a.concat(GlobalFields.notifications);
    if (GlobalFields.notifications.length == 11)
      GlobalFields.notifications = GlobalFields.notifications.slice(0,9);

    this.nativeStorage.setItem('notificationsCLA', {property: 'value', anotherProperty: GlobalFields.notifications})
      .then(
        () => console.log('Stored item!'),
        error => {
          console.error('Error storing item', error);
          GlobalFields.notifications = [];
        }
      );
  }


  public getNotifications() {
    this.nativeStorage.getItem('notificationsCLA')
      .then(
        data => {
          console.log(data);
          if (data && data.anotherProperty)
            GlobalFields.notifications = data.anotherProperty;
        },
        error => {
          console.error(error);
          GlobalFields.notifications = [];
        }
      );
  }

  getFilteredListings(stats?: boolean) {

    let page = '&page=' + GlobalFields.filtersSearch.currentPage;

    //type
    let type = 'type=' + GlobalFields.getListingTypeKeyById(GlobalFields.filtersSearch.selectedType);

    let stats_q = '';
    if (stats)
      stats_q = '&stats=1';

    //tags
    let tags = '';
    console.log(GlobalFields.filtersSearch.tags);
    const selectedTags = GlobalFields.filtersSearch.tags.filter(el => el.isChecked);
    console.log(selectedTags);
    if (selectedTags) {
      for (let i = 0; i < selectedTags.length; i++) {
        let t = selectedTags[i];
        if (t.isChecked) {
          tags += '&job_tags[]=' + t.val.slug;
        }
      }
    }


    //region, it's just 1 or none selected
    let regions = '';
    if (GlobalFields.filtersSearch.region) {
      let r = GlobalFields.regions.find(temp => temp.name == GlobalFields.filtersSearch.region);
      if (r) {
        if (regions == '') //is the first to add
          regions = '&region=' + r.slug;
      }
    }

    //order
    let order = '';
    if (!GlobalFields.filtersSearch.order)
      GlobalFields.filtersSearch.order = GlobalFields.selectedTypeDetail.case27_listing_type_search_page.order.options[0].key;

    let orderObj = GlobalFields.selectedTypeDetail.case27_listing_type_search_page.order.options.find(res => res.key == GlobalFields.filtersSearch.order);
    if (orderObj) {
      let clauses = orderObj.clauses;
      if (clauses && clauses.length > 0)
        order = '&sort=' + orderObj.key + '&order=' + clauses[0].order;
    }


    //categories
    let categories = '';
    for (let i = 0; i < GlobalFields.filtersSearch.categories.length; i++) {
      let c = GlobalFields.listingCategories.find(temp => temp.name == GlobalFields.filtersSearch.categories[i]);
      console.log(GlobalFields.listingCategories);
      console.log(GlobalFields.filtersSearch.categories[i]);
      console.log(c);
      if (c)
        categories += '&job_category[]=' + c.slug;
    }


    //custom taxonomies, is just 1 or none selected per each custom tax
    let customTaxonomies = '';
    if (GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions) {
      for (let i = 0; i < GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions.length; i++) {
        let tax = GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions[i];
        if (tax && tax.selected && tax.options) {
          customTaxonomies = '&' + tax.key + '=';
          let opt = tax.options.find(temp => temp.name == tax.selected);
          if (opt)
            customTaxonomies = '&' + tax.key + '=' + opt.slug;
        }
      }
    }

    //custom fields, is just 1 or none selected per each custom field
    let customFields = '';
    if (GlobalFields.filtersSearch.customFieldsDropdownKeysOptions) {
      for (let i = 0; i < GlobalFields.filtersSearch.customFieldsDropdownKeysOptions.length; i++) {
        let cust = GlobalFields.filtersSearch.customFieldsDropdownKeysOptions[i];
        if (cust && cust.selected && cust.options) {
          let opt = cust.options.find(temp => temp.label == cust.selected);
          if (opt)
            customFields = '&' + cust.key + '=' + opt.value;
        }
      }
    }

    //custom text fields, is just a string or "" per each custom field
    let customTextFields = '';
    if (GlobalFields.filtersSearch.customFieldsText) {
      for (let i = 0; i < GlobalFields.filtersSearch.customFieldsText.length; i++) {
        let field = GlobalFields.filtersSearch.customFieldsText[i];
        if (field && field.selected != '') {
          customTextFields = '&' + field.key + '=' + field.selected;
        }
      }
    }


    //proximity
    let proximity = '';
    if (GlobalFields.filtersSearch.range != undefined)
      proximity = '&proximity=' + GlobalFields.filtersSearch.range;


    //address
    let address = '';
    if (GlobalFields.filtersSearch.location && GlobalFields.filtersSearch.lat && GlobalFields.filtersSearch.lng) //address specified and translated into lat lng
      address = '&lat=' + GlobalFields.filtersSearch.lat + '&lng=' + GlobalFields.filtersSearch.lng;

    //name
    let name = '';
    if (GlobalFields.filtersSearch.name)
      address = '&title=' + GlobalFields.filtersSearch.name;

    //Generic search
    let search_keywords = '';
    if (GlobalFields.filtersSearch.search_keywords)
      address = '&search_keywords=' + GlobalFields.filtersSearch.search_keywords;


    return this.http.get(Constants.url + this.suffix1 + this.suffix2CustomApp + 'search?limit=10&' + type + stats_q + page + name + address + proximity + tags + regions + categories + order + customTaxonomies + customFields + customTextFields);

  }

  getAllListings() {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'search-geo';
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
  }


  getRegionsByType(listingTypeId: number) {
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'terms?taxonomy=region&format_levels=true&';
    url = url + 'listing_type=' + listingTypeId;
    let cacheKey = url;
    let request = this.http.get(url);

    return this.cache.loadFromObservable(cacheKey, request);
  }

  clearAllCache() {
    this.cache.clearAll();

  }


  setTransparentBackgroundStatusBar() {
    /*  console.log("setTransparentBackgroundStatusBar");
      if (this.platform.is('android')){
          this.statusBar.overlaysWebView(false);
      }else {
          this.statusBar.overlaysWebView(true);
          //this.statusBar.styleLightContent();
          this.statusBar.backgroundColorByName('black');
          this.statusBar.styleDefault();
      }*/
  }

  setWhiteBlackBackgroundStatusBar() {
    /* console.log("setWhiteBlackBackgroundStatusBar");
     if (this.platform.is('android'))
         this.setTransparentBackgroundStatusBar();
     else{
         this.statusBar.overlaysWebView(false);
         this.statusBar.backgroundColorByName('black');
         this.statusBar.styleDefault();
     }
     */
  }

  initOneSignal() {

    console.log('Oensignal startInit');
    console.log(
      this.oneSignal.startInit(Constants.OneSignal_appID, Constants.OneSignal_googleProjectNumber)
    );

    console.log('Oensignal inFocusDisplaying');
    console.log(this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification));

    this.oneSignal.handleNotificationReceived().subscribe((res) => {
      // do something when notification is received
      //Is a direct message notification, no need to store it
      if (res && res.payload && !res.payload.additionalData)
        this.storeNotifications(res);
      console.log(res);
    });

    this.oneSignal.handleNotificationOpened().subscribe((res) => {
        // do something when a notification is opened

        //Is a direct message notification
        if (GlobalFields.isLoggedIn && res && res.notification.payload && res.notification.payload.additionalData
          && res.notification.payload.additionalData.notification_type == 1 && res.notification.payload.additionalData.sender) {
          GlobalFields.senderMsgSelected = new User();
          GlobalFields.senderMsgSelected.id = res.notification.payload.additionalData.sender.id;
          GlobalFields.senderMsgSelected.name = res.notification.payload.additionalData.sender.nickname;
          GlobalFields.loadingSoft = true;
          this.getMsgsOfAChat(GlobalFields.senderMsgSelected.id).subscribe((data: any) => {
            GlobalFields.msgsSelected = data;
            GlobalFields.loadingSoft = false;
            this.navController.navigateForward('tabs/messages/chatPage');
          });

          console.log(res);
        }
      }
    );

    console.log('Oensignal endInit');
    this.oneSignal.endInit();
  }

  getGeneralSearch(q: string){
    let url = Constants.url + this.suffix1 + this.suffix2CustomApp + 'quick-search?s=' + q;
    return this.http.get(url);
  }

  //**************************************************** AUTHENTICATED AND LOGIN CALLS ***************************************************

  socialLogin(type: number, authToken: string) {
    let url = Constants.url + this.suffix3 + this.suffix4 + 'connect';

    let body = new FormData();

    body.append('type', type + '');
    body.append('access_token', authToken);

    return this.http.post(url, body);
  }

  getNonce() {
    let url = Constants.url + this.suffix3 + 'get_nonce/?controller=authenticationcla&method=generate_auth_cookie';
    let request = this.http.get(url);

    return this.http.get(url, {responseType: 'text'});
  }

  getNonceRegistration() {
    let url = Constants.url + this.suffix3 + 'get_nonce/?controller=authenticationcla&method=register_user';
    let request = this.http.get(url);

    return this.http.get(url, {responseType: 'text'});
  }

  getNoncePswRecovery() {
    let url = Constants.url + this.suffix3 + 'get_nonce/?controller=authenticationcla&method=reset_password';
    let request = this.http.get(url);

    return this.http.get(url, {responseType: 'text'});
  }


  loginOld(username: string, password: string, nonce: string) {
    let url = Constants.url + this.suffix3 + this.suffix4 + 'generate_auth_cookie/?username='
      + username +
      '&password=' + password +
      '&nonce=' + nonce;

    let request = this.http.get(url);

    return this.http.get(url, {responseType: 'text'});
  }

  login(username: string, password: string, nonce: string) {
    let url = Constants.url + this.suffix3 + this.suffix4 + 'generate_auth_cookie';

    let body = new FormData();

    body.append('username', username);
    body.append('password', password);
    body.append('nonce', nonce);

    return this.http.post(url, body);
  }

  registration(email: string, password: string, nonce: string) {
    let url = Constants.url + this.suffix3 + this.suffix4 + 'register_user';

    let body = new FormData();

    body.append('user_email', email);
    body.append('user_login', email);
    body.append('user_pass', password);
    body.append('nonce', nonce);
    body.append('notify', 'both');

    return this.http.post(url, body);
  }

  pswRecovery(email: string, nonce: string) {
    let url = Constants.url + this.suffix3 + this.suffix4 + 'reset_password';

    let body = new FormData();

    body.append('user_login', email);
    body.append('nonce', nonce);

    return this.http.post(url, body);
  }


  public storeProfile(profile: Profile) {
    GlobalFields.profile.auth_username = GlobalFields.username;
    GlobalFields.profile.auth_password = GlobalFields.password;

    this.nativeStorage.setItem('profileCLA', {property: 'value', anotherProperty: GlobalFields.profile})
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
  }

  public getProfileFromStorage() {
    this.nativeStorage.getItem('profileCLA')
      .then(
        data => {
          console.log(data);
          GlobalFields.profile = data.anotherProperty;
          GlobalFields.getUserRole();
          if (GlobalFields.profile)
            GlobalFields.isLoggedIn = true;
        },
        error => console.error(error)
      );
  }

  public logout() {
    //Send External ID to OneSignal
    if (GlobalFields.site_details.enableNotifications && GlobalFields.profile && GlobalFields.profile.user)
      try {
        this.oneSignal.setExternalUserId('');
      } catch (e) {
        console.log(e);
      }

    this.nativeStorage.remove('profileCLA')
      .then(
        data => {
          console.log(data);
          GlobalFields.isLoggedIn = false;
          GlobalFields.profile = undefined;
        },
        error => {
          console.error(error);
          GlobalFields.isLoggedIn = false;
          GlobalFields.profile = undefined;
        }
      );

    try {
      this.googlePlus.disconnect().then(res => {
        console.log(res);
      }).catch(e => {
        console.log(e);
      });
      this.fb.logout().then(res => {
        console.log(res);
      }).catch(e => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }

  }

  public refreshCookie() {
    GlobalFields.loading = true;
    this.getNonce().subscribe((data: string) => {
      if (data) {
        GlobalFields.nonce = JSON.parse(data).nonce;

        this.getProfileFromStorage();
        console.log(GlobalFields.profile);
        GlobalFields.username = GlobalFields.profile.auth_username;
        GlobalFields.password = GlobalFields.profile.auth_password;

        this.login(GlobalFields.username, GlobalFields.password, GlobalFields.nonce).subscribe((data: any) => {
          GlobalFields.getUserRole();
          if (GlobalFields.profile.status == 'error') { //Login error
            GlobalFields.isLoggedIn = false;
            GlobalFields.loading = false;
          } else { //Login ok
            GlobalFields.profile = data;
            this.storeProfile(GlobalFields.profile);
            GlobalFields.isLoggedIn = true;
            GlobalFields.loading = true;
          }

          GlobalFields.loading = false;
        }, err => {
          GlobalFields.loading = false;
        });
      }
    }, err => {
      try {
        this.logout();
        GlobalFields.profile = JSON.parse(err.error);
        GlobalFields.isLoggedIn = false;
        GlobalFields.loadingSoft = false;
      } catch (e) { //no network
        GlobalFields.loadingSoft = false;
      }
    });
  }

  public getCurrentUserInfo() {
    let url = Constants.url + this.suffix3 + this.suffix4 + 'get_currentuserinfo/?cookie=' + GlobalFields.profile.cookie;
    let cacheKey = url;
    return this.http.get(url);

  }

  public getMyListings(currentPage: number) {
    let page = '&page=' + currentPage;
    let url = Constants.url + this.suffix3 + this.suffix6 + 'get_listings/?limit=20' + page + '&cookie=' + GlobalFields.profile.cookie;

    return this.http.get(url);
  }

  public getBookmarkedListings() {
    let url = Constants.url + this.suffix3 + this.suffix5 + 'get_bookmarks/?cookie=' + GlobalFields.profile.cookie;

    return this.http.get(url);
  }

  public doBookmark(listing_id: any) {
    let url = Constants.url + this.suffix3 + this.suffix5 + 'bookmark_listing/?cookie=' + GlobalFields.profile.cookie + '&listing_id=' + listing_id;

    return this.http.get(url);
  }

  public undoBookmark(listing_id: any) {
    let url = Constants.url + this.suffix3 + this.suffix5 + 'remove_bookmark/?cookie=' + GlobalFields.profile.cookie + '&listing_id=' + listing_id;

    return this.http.get(url);
  }

  public postAReview(listingId: any, text: string, customFieldsStars: { key: string, value: number, label: string }[], gallery: number[], new_galleryFile: Blob[], new_galleryName: string[]) {
    let url = Constants.url + this.suffix3 + this.suffix6 + 'post_review';

    let body = new FormData();
    // Add your values in here
    //body.append('review_gallery[]', "");
    body.append('cookie', GlobalFields.profile.cookie);
    body.append('content', text);
    body.append('post_id', listingId);
    if (new_galleryFile && new_galleryName) {
      for (let i = 0; i < new_galleryFile.length; i++) {
        const el = new_galleryFile[i]; //BLOB -> image to upload (one entry per image to upload)
        console.log(el);
        const ns = new_galleryName[i].split('/');
        let fileName = 'reviewImg.jpeg';
        if(ns && ns.length>0)
          fileName =ns[ns.length-1]
        let ext = (el.type && el.type.split('/') && el.type.split('/').length > 0) ? el.type.split('/')[1] : 'jpg';
        body.append('review_gallery[]', el, fileName);
      }
    }
    if (gallery) {
      gallery.forEach( el =>{
        body.append('review_gallery_ids[]', el + '')
      });
    }

    for (let i = 0; i < customFieldsStars.length; i++) {
      let field = customFieldsStars[i];
      body.append(field.key, (field.value * 2) + '');
    }


    return this.http.post(url, body);
  }

  //get users to start a new conversation
  public getRecipientsList() {
    let url = Constants.url + this.suffix3 + this.suffix7 + 'post_review/?cookie=' + GlobalFields.profile.cookie;

  }

  public uploadImgListing(file: Blob, file_name: string, field: string) {

    let url = Constants.url + this.suffix3 + this.suffix6 + 'upload';

    console.log(file);
    console.log(file_name);
    let body = new FormData();
    let ext = (file.type && file.type.split('/') && file.type.split('/').length > 0) ? file.type.split('/')[1] : 'jpg';
    if (ext.includes('*') && file_name.split('.').length > 0)
      ext = file_name.split('.')[file_name.split('.').length - 1];
    body.append('cookie', GlobalFields.profile.cookie);
    body.append(field, file, 'imgListing.' + ext);

    return this.http.post(url, body);
  }

  public getChats() {
    let url = Constants.url + this.suffix3 + this.suffix7 + 'read_messages/?cookie=' + GlobalFields.profile.cookie;

    return this.http.get(url);
  }

  public getMsgsOfAChat(userID: number) {
    let url = Constants.url + this.suffix3 + this.suffix7 + 'read_conversation/?cookie=' + GlobalFields.profile.cookie;
    url = url + '&opponent_id=' + userID;

    return this.http.get(url);
  }


  public markAsSeenChat(userID: number) {
    let url = Constants.url + this.suffix3 + this.suffix7 + 'mark_as_seen/?cookie=' + GlobalFields.profile.cookie;
    url = url + '&opponent_id=' + userID;

    return this.http.get(url);
  }


  public sendMsg(message: string, receiver_id: number) {
    let url = Constants.url + this.suffix3 + this.suffix7 + 'send_message';

    let body = new FormData();

    body.append('cookie', GlobalFields.profile.cookie);
    body.append('message', message);
    body.append('receiver_id', receiver_id.toString());

    return this.http.post(url, body);
  }

  public getMsgUsersByString(term: string) {
    let url = Constants.url + this.suffix3 + this.suffix7 + 'get_recipients_list';

    let body = new FormData();
    body.append('cookie', GlobalFields.profile.cookie);
    body.append('term', term);

    return this.http.post(url, body);
  }

  public saveListing(listing: Listing, fieldsTypeSelected: FieldsAddForm[], status?: string,) {

    let url = Constants.url + this.suffix3 + this.suffix6 + 'save';
    let listingTypeSlug = listing._case27_listing_type;
    let listingType = GlobalFields.listingTypesDetails.find(res => res.post_name == listingTypeSlug);
    let body = new FormData();
    body.append('cookie', GlobalFields.profile.cookie);
    body.append('_case27_listing_type', listingTypeSlug);
    body.append('post_status', status ? status : 'pending');
    if (listing.id)
      body.append('id', listing.id + '');

    //Consuming of a package if selected one
    if (listing.listing_package)
      body.append('listing_package', listing.listing_package + '');

    fieldsTypeSelected.forEach(field => {

      if (field.show_in_submit_form) {

        //text
        if (field.type == 'text' || field.type == 'wp-editor' || field.type == 'texteditor' || field.type == 'email'
          || field.type == 'location' || field.type == 'date' || field.type == 'number')
          if (listing[field.slug])
            body.append(field.slug, listing[field.slug]);

        if (field.type == 'file'){
          console.log(field)
        }
        //logo, cover img
        if (field.type == 'file' && !field.multiple)
          if (listing[field.slug])
            body.append('current_' + field.slug, listing[field.slug]);

        //gallery
        if (field.type == 'file' && field.multiple && listing[field.slug]) {
          const gallery: any[] = listing[field.slug];
          console.log(gallery);
          if (gallery)
            gallery.forEach(url => {
              body.append('current_' + field.slug + '[]', url);
            });
        }

        //Categories
        if (field.type == 'term-select' && field.slug == 'job_category') {
          for (let i = 0; i < GlobalFields.addForm.categories.length; i++) {
            let c = GlobalFields.listingCategories.find(temp => temp.name == GlobalFields.addForm.categories[i]);
            if (c)
              body.append('job_category[]', c.id + '');
          }
        }

        //Tags
        if (field.type == 'term-select' && field.slug == 'job_tags') {
          console.log( GlobalFields.addForm.tags)
          const selectedTags = GlobalFields.addForm.tags.filter(el => el.isChecked);
          if (selectedTags) {
            for (let i = 0; i < selectedTags.length; i++) {
              let t = selectedTags[i];
              if (t.isChecked && t.val) {
                body.append('job_tags[]', t.val.term_taxonomy_id + '');
              }
            }
          }
        }

        //Regions
        if (field.type == 'term-select' && field.slug == 'region') {
          const selectedUIElements = GlobalFields.addForm.regions.filter(el => el.isChecked);
          if (selectedUIElements) {
            let regions = GlobalFields.regions;
            for (let i = 0; i < GlobalFields.addForm.regions.length; i++) {
              let uiElement = GlobalFields.addForm.regions[i];
              if (uiElement.isChecked){
                let region = regions[i];
                if(field['terms-template'] == "single-select") {
                  body.append('region', region.id + '');
                  break;
                }else{
                  body.append('region[]', region.id + '');
                }
              }
            }
          }
        }

        //prices
        if ((field.type == 'select' && field.slug == 'price_range') && GlobalFields.addForm.price_range) {
          if (Array.isArray(GlobalFields.addForm.price_range))
            GlobalFields.addForm.price_range.forEach(value => {
              body.append(field.slug, value);
            });
          else
            body.append(field.slug, GlobalFields.addForm.price_range);

        }


        //Working hours
        if (field.type == 'work-hours' && listing.work_hours) {
          let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          days.forEach(day => {
            if (listing.work_hours[day]) {
              body.append(field.slug + '[' + day + ']' + '[status]', listing.work_hours[day].status);
              if (listing.work_hours[day].entry_hours && listing.work_hours[day].entry_hours.length > 0) {
                listing.work_hours[day].entry_hours.forEach((e, i) => {
                  body.append(field.slug + '[' + day + ']' + '[' + i + ']' + '[from]', GlobalFields.getOnlyTimeFromDate(e.from));
                  body.append(field.slug + '[' + day + ']' + '[' + i + ']' + '[to]', GlobalFields.getOnlyTimeFromDate(e.to));
                });
              }
            }
          });
          body.append(field.slug + '[timezone]', listing.work_hours.timezone);
        }

        //Social Networks Links
        if (field.type == 'links' && listing.links) {
          listing.links.forEach((link, i) => {
            body.append(field.slug + '[' + i + ']' + '[network]', link.network);
            body.append(field.slug + '[' + i + ']' + '[url]', link.url);
          });
        }

        //custom taxonomies, is just 1 or none selected for each custom tax
        if (GlobalFields.addForm.customTaxonomiesDropdownKeysOptions) {
          const customTax = GlobalFields.addForm.customTaxonomiesDropdownKeysOptions.find(el => el.key == field.slug);
          if(customTax && customTax.selected) {
            console.log(GlobalFields.addForm.customTaxonomiesDropdownKeysOptions)
            console.log(customTax);
            //If has options as array
            if (customTax.options && Array.isArray(customTax.options) && ! Array.isArray(customTax.selected)) {
              console.log("opt1")
              let opt = customTax.options.find(temp => temp.label == customTax.selected);
              if (opt)
                body.append(field.slug + '[]', opt.id + '');
            }
            //If has options is not an array and selected is an array
            else if (customTax && customTax.selected && customTax.options && Array.isArray(customTax.selected)) {
              console.log("opt2")
              customTax.selected.forEach(sel => {
                body.append(field.slug + '[]', sel + '');
              });
            }
            //If has options is not an array and selected is not an array
            else if (customTax && customTax.selected && customTax.options && !Array.isArray(customTax.selected)) {
              console.log("opt3")
              body.append(field.slug, customTax.selected + '');
            }
          }
        }


        //custom fields, is just 1 or none selected for each custom field
        if (GlobalFields.addForm.customFieldsDropdownKeysOptions) {
          const customField = GlobalFields.addForm.customFieldsDropdownKeysOptions.find(el => el.key == field.slug);
          //If has options as array
          if (customField && customField.selected && customField.options && Array.isArray(customField.options)) {
            let opt = customField.options.find(temp => temp.label == customField.selected);
            if (opt)
              body.append(field.slug + '[]', opt.id + '');
            //If has options is not an array and selected is an array
          } else if (customField && customField.selected && customField.options && Array.isArray(customField.selected)) {
            customField.selected.forEach(sel => {
              body.append(field.slug + '[]', sel + '');
            });
            //If has options is not an array and selected is not an array
          } else if (customField && customField.selected && customField.options && !Array.isArray(customField.selected)) {
            body.append(field.slug, customField.selected + '');
          }
        }
      }


    });

    return this.http.post(url, body);
  }


  getMyListingDetailsById(id: number) {
    let url = Constants.url + this.suffix3 + this.suffix6 + 'get/?cookie=' + GlobalFields.profile.cookie + '&listing_id=' + id;
    let cacheKey = url;
    let request = this.http.get(url);

    let TTL = 60 * 60 * 24; // 1 day

    return this.http.get(url);
    //  return this.http.get(Constants.url + this.suffix1 + this.suffix2CustomApp + this.suffix6 + 'get/?listing_id=' + id);
  }


  public deleteListing(id: number) {
    let url = Constants.url + this.suffix3 + this.suffix6 + 'delete';

    let body = new FormData();

    body.append('cookie', GlobalFields.profile.cookie);
    body.append('listing_id', id + '');

    return this.http.post(url, body);
  }

  /*Example response:
   {
    "success": true,
    "can_create_listing": false,
    "packages": []
   }
  if the value of can_create_listing" is false, the user must buy one of the "packages" returned by this endpoint.
  */
  public getPackagesPermission(listingTypeSelectedID?: number) {
    let url = Constants.url + this.suffix3 + this.suffix8 + 'list_by_type/?';
    url = url + 'cookie=' + GlobalFields.profile.cookie;
    url = url + '&type=' + listingTypeSelectedID;
    return this.http.get(url);
  }


  public getImgBlob(file_uri: string) {
    return this.http.get(file_uri, {'responseType': 'blob'});
  }

  public dataURItoBlob(dataURI: string): Blob {
    // convert base64 to raw binary data held in a string
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let _ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }

    let dataView = new DataView(arrayBuffer);
    let blob = new Blob([dataView], {type: mimeString});
    return blob;

  }


}
