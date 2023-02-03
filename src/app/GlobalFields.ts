import {Listing} from './entities/listing';
import {Post} from './entities/post';
import {ListingCategory} from './entities/listingCategory';
import {FiltersSearch} from './entities/FiltersSearch';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {AlertController, Platform} from '@ionic/angular';
import {Service} from './services/Service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult
} from '@ionic-native/native-geocoder/ngx';

import {Config} from './entities/config';
import {TranslateService} from '@ngx-translate/core';

import * as Color from 'color';
import {ThemeService} from './services/theme.service';
import {LocationService} from './services/LocationService';
import {ListingTypeDetail} from './entities/listingTypeDetail';
import {Profile} from './entities/profile';
import {Chat} from './entities/Chat';
import {Product} from './entities/Product';
import {Notification} from './entities/Notification';
import {User} from './entities/user';


export class GlobalFields {

  public static mode?: string; //md or ios

  //site details and general data
  public static site_details: Config;
  public static listingTypesDetails: ListingTypeDetail[] = [];
  public static listingTags: ListingCategory[] = [];
  public static listingCategories: ListingCategory[] = [];
  public static listingCustomTaxonomies: any;
  public static listingCustomFieldKeys: string[];
  public static posts: Post[] = [];
  public static filteredListings: Listing[] = [];
  public static recentViewedListings: Listing[] = [];
  public static notifications: Notification[] = [];
  public static searchByStringListings: Listing[] = [];
  public static searchString = '';
  public static oldSearchString = '';
  public static regions: ListingCategory[] = [];


  //filters, selected type part and other selected listings data
  public static basicSearch: boolean; //Used to avoid to replace the basic search when clicling on search home the search tab is opened
  public static filtersSearch: FiltersSearch;
  public static addForm: FiltersSearch;
  public static selectedTypeDetail: ListingTypeDetail;
  public static selectedListing: Listing;
  public static listingToEdit: Listing;
  public static selectedImg: string = '';
  public static customRatingsSelected: { key: string, value: any }[] = [];
  public static oldReview: any = undefined;

  //WooCommerce part
  public static selectedProduct: Product;
  public static selectedOrderUrl: string;

  //geo part
  public static lat: any;
  public static long: any;
  public static address: any;
  public static locationService: LocationService;

  //app status part
  public static loading = true;
  public static loadingSoft = false;
  public static errorIni = false;
  public static errorString;


  //account part
  public static isLoggedIn: Boolean = false;
  public static profile: Profile;
  public static userRole: any;
  public static username = '';
  public static password = '';
  public static nonce = '';
  public static bookmarkedListings: Listing[] = [];


  //Messages part
  public static msgToOwner: any; //whens send a direct msg to a listing owner
  public static msgsSelected: Chat;
  public static showTabs = true;
  public static senderMsgSelected: User;


  //theme data
  public static theme = {
    primary: '#39BFBD',
    secondary: '#4CE0B3',
    tertiary: '#FF5E79',
    light: '#ffffff',
    medium: '#B682A5',
    dark: '#34162A'
  };


  //languages
  public static languages = [
    {val: 'Albanian', isChecked: false, flag: 'al', fontStyleClass: 'fontStyle1'},
    {val: 'Arabic', isChecked: false, flag: 'sa', fontStyleClass: 'fontStyle2'},
    {val: '繁體中文 Chinese (Traditional)', isChecked: false, flag: 'tw', fontStyleClass: 'fontStyle2'},
    {val: '简体中文 Chinese (Simplified)', isChecked: false, flag: 'cn', fontStyleClass: 'fontStyle2'},
    {val: 'Dansk', isChecked: false, flag: 'dk', fontStyleClass: 'fontStyle1'},
    {val: 'Deutsch', isChecked: false, flag: 'de', fontStyleClass: 'fontStyle2'},
    {val: 'Dutch', isChecked: false, flag: 'nl', fontStyleClass: 'fontStyle2'},
    {val: 'English', isChecked: true, flag: 'gb', fontStyleClass: 'fontStyle1'},
    {val: 'Español', isChecked: false, flag: 'es', fontStyleClass: 'fontStyle1'},
    {val: 'Français', isChecked: false, flag: 'fr', fontStyleClass: 'fontStyle1'},
    {val: 'Greek', isChecked: false, flag: 'gr', fontStyleClass: 'fontStyle2'},
    {val: 'Hebrew', isChecked: false, flag: 'il', fontStyleClass: 'fontStyle2'},
    {val: 'Italiano', isChecked: false, flag: 'it', fontStyleClass: 'fontStyle1'},
    {val: 'Japanese', isChecked: false, flag: 'jp', fontStyleClass: 'fontStyle2'},
    {val: 'Malay', isChecked: false, flag: 'my', fontStyleClass: 'fontStyle1'},
    {val: 'Polish', isChecked: false, flag: 'pl', fontStyleClass: 'fontStyle1'},
    {val: 'Portuguese', isChecked: false, flag: 'pt', fontStyleClass: 'fontStyle1'},
    {val: 'Romanian', isChecked: false, flag: 'ro', fontStyleClass: 'fontStyle1'},
    {val: 'Russian', isChecked: false, flag: 'ru', fontStyleClass: 'fontStyle2'}
  ];

  //Sitemenu controller
  public static navigateAsRoot = false;

  public static timeZones = ['Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara', 'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre', 'Africa/Brazzaville', 'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala', 'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 'Africa/Juba', 'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos', 'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey', 'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua', 'America/Araguaina', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 'America/Argentina/Cordoba', 'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 'America/Argentina/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia', 'America/Aruba', 'America/Asuncion', 'America/Atikokan', 'America/Bahia', 'America/Bahia_Banderas', 'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota', 'America/Boise', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun', 'America/Caracas', 'America/Cayenne', 'America/Cayman', 'America/Chicago', 'America/Chihuahua', 'America/Costa_Rica', 'America/Creston', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Dominica', 'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Fort_Nelson', 'America/Fortaleza', 'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil', 'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo', 'America/Indiana/Indianapolis', 'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Tell_City', 'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Juneau', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Kralendijk', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Lower_Princes', 'America/Maceio', 'America/Managua', 'America/Manaus', 'America/Marigot', 'America/Martinique', 'America/Matamoros', 'America/Mazatlan', 'America/Menominee', 'America/Merida', 'America/Metlakatla', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Monterrey', 'America/Montevideo', 'America/Montserrat', 'America/Nassau', 'America/New_York', 'America/Nipigon', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama', 'America/Pangnirtung', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 'America/Port_of_Spain', 'America/Porto_Velho', 'America/Puerto_Rico', 'America/Punta_Arenas', 'America/Rainy_River', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute', 'America/Rio_Branco', 'America/Santarem', 'America/Santiago', 'America/Santo_Domingo', 'America/Sao_Paulo', 'America/Scoresbysund', 'America/Sitka', 'America/St_Barthelemy', 'America/St_Johns', 'America/St_Kitts', 'America/St_Lucia', 'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current', 'America/Tegucigalpa', 'America/Thule', 'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 'America/Tortola', 'America/Vancouver', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat', 'America/Yellowknife', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Macquarie', 'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok', 'Arctic/Longyearbyen', 'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat', 'Asia/Atyrau', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Barnaul', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 'Asia/Chita', 'Asia/Choibalsan', 'Asia/Colombo', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Famagusta', 'Asia/Gaza', 'Asia/Hebron', 'Asia/Ho_Chi_Minh', 'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Kathmandu', 'Asia/Khandyga', 'Asia/Kolkata', 'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Kuwait', 'Asia/Macau', 'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novokuznetsk', 'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang', 'Asia/Qatar', 'Asia/Qyzylorda', 'Asia/Riyadh', 'Asia/Sakhalin', 'Asia/Samarkand', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Srednekolymsk', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Tomsk', 'Asia/Ulaanbaatar', 'Asia/Urumqi', 'Asia/Ust-Nera', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yangon', 'Asia/Yekaterinburg', 'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faroe', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena', 'Atlantic/Stanley', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Currie', 'Australia/Darwin', 'Australia/Eucla', 'Australia/Hobart', 'Australia/Lindeman', 'Australia/Lord_Howe', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney', 'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Astrakhan', 'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Busingen', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man', 'Europe/Istanbul', 'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Kirov', 'Europe/Lisbon', 'Europe/Ljubljana', 'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Mariehamn', 'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Saratov', 'Europe/Simferopol', 'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane', 'Europe/Ulyanovsk', 'Europe/Uzhgorod', 'Europe/Vaduz', 'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Volgograd', 'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zaporozhye', 'Europe/Zurich', 'Indian/Antananarivo', 'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro', 'Indian/Kerguelen', 'Indian/Mahe', 'Indian/Maldives', 'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion', 'Pacific/Apia', 'Pacific/Auckland', 'Pacific/Bougainville', 'Pacific/Chatham', 'Pacific/Chuuk', 'Pacific/Easter', 'Pacific/Efate', 'Pacific/Enderbury', 'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro', 'Pacific/Marquesas', 'Pacific/Midway', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk', 'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Pohnpei', 'Pacific/Port_Moresby', 'Pacific/Rarotonga', 'Pacific/Saipan', 'Pacific/Tahiti', 'Pacific/Tarawa', 'Pacific/Tongatapu', 'Pacific/Wake', 'Pacific/Wallis', 'UTC'];


  public static dataIsReady = true;


  public static async presentAlert(alertController: AlertController) {
    const alert = await alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }


  public static init(service: Service, dialogs: Dialogs, platform: Platform, geolocation: Geolocation,
                     nativeGeocoder: NativeGeocoder, alertController: AlertController, translate: TranslateService,
                     themeService: ThemeService, locationService: LocationService) {

    console.log('loading');

    this.loading = true;

    // chiamate concatenate per mostrare loading

    GlobalFields.filtersSearch = new FiltersSearch();

    let goodAPIs = 0;
    setTimeout(() => {
      if (goodAPIs < 3) {
        GlobalFields.errorIni = true;
        GlobalFields.errorString = 'Timeout reached. Check your internet connection or the website availability.';
      }

    }, 20000);

    // call 1
    service.getConfig()
      .subscribe((data: any) => {
        //this.presentAlert(alertController);
        this.site_details = data;
        this.site_details.listingPageType = parseInt(this.site_details.listingPageType);
        this.setLang(this.site_details.language, translate);
        this.updateColor(themeService);
        this.setCustomFont(themeService);
        if (!this.site_details.placeholderImgUrl || this.site_details.placeholderImgUrl == '')
          this.site_details.placeholderImgUrl = 'assets/imgs/no_img.jpg';

        goodAPIs++;
        GlobalFields.endOfCalls(goodAPIs, geolocation, nativeGeocoder, alertController, service, locationService);

        // OneSignal Code start:
        if (this.site_details.enableNotifications)
          service.initOneSignal();

      }, err => {
        GlobalFields.errorIni = true;
        GlobalFields.errorString = err.message;
        console.log(err);
      });

    // call 2
    service.getAllCategoriesListings()
      .subscribe((data: any) => {
        this.listingCategories = data;

        console.log('getAllCategoriesListings');

        // goodAPIs++;
        // GlobalFields.endOfCalls(goodAPIs, geolocation, nativeGeocoder, alertController, service, locationService);

      }, err => {
        //GlobalFields.errorIni = true; GlobalFields.errorString = err.message; console.log(err)
      });


    // call 3
    service.getAllTypeDetails()
      .subscribe((data: any) => {
        this.listingTypesDetails = data;
        for (const type of this.listingTypesDetails) {
          if (type.featured_media != 0) {
            service.getMediaById(type.featured_media)
              .subscribe((data: any) => {
                  console.log('url: ' + data.source_url);
                  if (data) {
                    type.img_cover = data.source_url;
                  }
                }
              );
          }
        }
        this.filtersSearch.selectedType = this.listingTypesDetails[0].ID;
        GlobalFields.selectListingTypeDetail();

        console.log(GlobalFields.listingCustomFieldKeys);

        for (var key in data) {
          let opts = data[key];
          GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions.push({key: key, options: opts, selected: []});
        }


        goodAPIs++;
        GlobalFields.endOfCalls(goodAPIs, geolocation, nativeGeocoder, alertController, service, locationService);

        // call 4
        service.getCustomTaxonomies()
          .subscribe((data: any) => {
            this.listingCustomTaxonomies = data;
            console.log('getCustomTaxonomies');

            GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions = [];

            //prepare the custom taxonomies
            for (var key in data) {
              let opts = data[key];
              GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions.push({key: key, options: opts, selected: []});
            }

            //prepare the custom fields

            GlobalFields.listingCustomFieldKeys = [];
            GlobalFields.filtersSearch.customFieldsDropdownKeysOptions = [];
            GlobalFields.filtersSearch.customFieldsText = [];
            GlobalFields.listingTypesDetails.forEach(type => {
              //array of keys
              for (let key in type.case27_listing_type_fields) {
                if (type.case27_listing_type_fields[key]) {
                  if (type.case27_listing_type_fields[key].is_custom) {
                    GlobalFields.listingCustomFieldKeys.push(key);
                  }
                }
              }
              //array of custom fields for dropdowns
              let facets = type.case27_listing_type_search_page.advanced.facets as any[];
              GlobalFields.listingCustomFieldKeys.forEach(key => {
                let field = type.case27_listing_type_search_page.advanced.facets.find(temp => temp.show_field == key);
                if (field) {
                  if (field.type == 'text' || field.type == 'wp-search')
                    GlobalFields.filtersSearch.customFieldsText.push({key: field.show_field, selected: ''});
                  else
                    GlobalFields.filtersSearch.customFieldsDropdownKeysOptions.push({
                      key: field.show_field,
                      options: field.data_choices,
                      selected: []
                    });
                }
              });
            });


            goodAPIs++;
            GlobalFields.endOfCalls(goodAPIs, geolocation, nativeGeocoder, alertController, service, locationService);

          }, err => {
            GlobalFields.errorIni = true;
            GlobalFields.errorString = err.message;
          });

      }, err => {
        GlobalFields.errorIni = true;
        GlobalFields.errorString = err.message;
        console.log(err);
      });

    // call 5
    service.getAllTags()
      .subscribe((data: any) => {
        this.listingTags = data;
        //goodAPIs++;
        //GlobalFields.endOfCalls(goodAPIs, geolocation, nativeGeocoder, alertController, service, locationService);

      }, err => {
        // GlobalFields.errorIni = true; GlobalFields.errorString = err.message; console.log(err)
      });

    // call 6
    service.getRegions()
      .subscribe((data: any) => {
        this.regions = data;
        console.log('getRegions');

        //goodAPIs++;
        //GlobalFields.endOfCalls(goodAPIs, geolocation, nativeGeocoder, alertController, service, locationService);

      }, err => {
        //GlobalFields.errorIni = true; GlobalFields.errorString = err.message;
      });


    service.getRecentViewedListing();


    if (!platform.is('mobileweb')) {
      console.log('non è browser');
      console.log(platform);
      /*dialogs.alert('Please wait')
          .then(() => console.log('Dialog dismissed'))
          .catch(e => console.log('Error displaying dialog', e));
          */
    }
  }

  public static endOfCalls(goodAPIs: number, geolocation, nativeGeocoder, alertController, service, locationService) {
    if (goodAPIs == 3) {
      // fine
      this.getLocation(geolocation, nativeGeocoder, alertController, service, locationService);
      service.getProfileFromStorage();
      this.loading = false;
      console.log('end loading');
    }
  }


  //Get the user role if the user is logged in to avoid getting in n times
  public static getUserRole() {
    if (GlobalFields.site_details.userRoles && GlobalFields.site_details.userRoles.roles && GlobalFields.site_details.userRoles.roles.length > 0 &&
      GlobalFields.profile && GlobalFields.profile.user && GlobalFields.profile.user.role) {
      GlobalFields.userRole = GlobalFields.site_details.userRoles.roles.find( r => r.slug == GlobalFields.profile.user.role)
    }
  }

  //get current location in myLat long
  public static getLocation(geolocation: Geolocation, nativeGeocoder: NativeGeocoder, alertController: AlertController, service: Service, locationService: LocationService) {

    console.log("Getting the location")

    console.log(geolocation)
    geolocation.getCurrentPosition({enableHighAccuracy: true}).then((resp) => {
      GlobalFields.lat = resp.coords.latitude;
      GlobalFields.long = resp.coords.longitude;
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);


      GlobalFields.getMyAddress(service, locationService, nativeGeocoder);

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });

  }


  public static getListingTypeNameBySlug(slug: string): string {
    const res = GlobalFields.listingTypesDetails.find(temp => temp.post_name == slug);
    if (res)
      return res.post_title;
    else
      return '-';
  }

  public static getListingTypeBySlug(slug: string): ListingTypeDetail {
    const res = GlobalFields.listingTypesDetails.find(temp => temp.post_name == slug);
    if (res)
      return res;
    else
      return undefined;
  }

  public static getListingTypeKeyById(id: number): string {
    const res = GlobalFields.listingTypesDetails.find(temp => temp.ID == id);
    if (res)
      return res.post_name;
    else
      return '-';
  }


  public static getListingTypeById(id: number) {
    const res = GlobalFields.listingTypesDetails.find(temp => temp.ID == id);
    return res;
  }

  public static getListingTypeTitleById(id: number): string {
    const res = GlobalFields.listingTypesDetails.find(temp => temp.ID == id);
    if (res)
      return res.post_title;
    else
      return '-';
  }

  public static getListingTypeTitleBySlug(slug: string): string {
    const res = GlobalFields.listingTypesDetails.find(temp => temp.post_name == slug);
    if (res)
      return res.post_title;
    else
      return '-';
  }


  //means the page must be the first
  public static getFilteredListingFirstTime(service: Service, locationService: LocationService, stats?: boolean) {
    GlobalFields.filteredListings = undefined;
    GlobalFields.filtersSearch.currentPage = 1;
    GlobalFields.filtersSearch.countListings = undefined;

    if (GlobalFields.filtersSearch.location) { //address


      if (GlobalFields.site_details.mapType == 1) { //Google Maps
        locationService.getMyLatLongFromGoogle(GlobalFields.filtersSearch.location).subscribe((d: any) => {  //traduco indirizzo

          let data = d.data ? d.data : d;
          if (stats)
            GlobalFields.filtersSearch.countListings = d.count;

          if (data && data.results && data.results.length > 0 && data.results[0].geometry && data.results[0].geometry.location) {
            GlobalFields.filtersSearch.lat = data.results[0].geometry.location.lat;
            GlobalFields.filtersSearch.lng = data.results[0].geometry.location.lng;
          }

          console.log('Get listings near lat long gmap ' + GlobalFields.filtersSearch.lat + ';' + GlobalFields.filtersSearch.lng);
          service.getFilteredListings(stats)
            .subscribe((d: any) => {
              let data = d.data ? d.data : d;
              if (stats)
                GlobalFields.filtersSearch.countListings = d.count;

              if (GlobalFields.filtersSearch.currentPage == 1) {
                GlobalFields.filteredListings = [];
                GlobalFields.filtersSearch.noMorePage = false;
              }

              GlobalFields.filteredListings = GlobalFields.filteredListings.concat(GlobalFields.fixWrongImgCoverField(data));
              if (GlobalFields.filteredListings.length < 10 || data.length == 0)
                GlobalFields.filtersSearch.noMorePage = true;
            });
        });
      } else { //Open Street Maps
        locationService.getLatLongFromOpenMaps(GlobalFields.filtersSearch.location).subscribe((data: any[]) => {
          console.log(data);
          if (data && data.length > 0) {
            GlobalFields.filtersSearch.lat = parseFloat(data[0].lat);
            GlobalFields.filtersSearch.lng = parseFloat(data[0].lon);
          }

          console.log('Get listings near lat long openstreet ' + GlobalFields.filtersSearch.lat + ';' + GlobalFields.filtersSearch.lng);

          service.getFilteredListings(stats)
            .subscribe((d: any) => {

              let data = d.data ? d.data : d;
              if (stats)
                GlobalFields.filtersSearch.countListings = d.count;

              if (GlobalFields.filtersSearch.currentPage == 1) {
                GlobalFields.filteredListings = [];
                GlobalFields.filtersSearch.noMorePage = false;
              }

              GlobalFields.filteredListings = GlobalFields.filteredListings.concat(GlobalFields.fixWrongImgCoverField(data));
              if (GlobalFields.filteredListings.length < 10 || data.length == 0)
                GlobalFields.filtersSearch.noMorePage = true;
            });
        });
      }
    } else {
      service.getFilteredListings(stats)
        .subscribe((d: any) => {
          if (d) {

            let data = d.data ? d.data : d;
            if (stats)
              GlobalFields.filtersSearch.countListings = d.count;

            if (GlobalFields.filtersSearch.currentPage == 1) {
              GlobalFields.filteredListings = [];
              GlobalFields.filtersSearch.noMorePage = false;
            }

            GlobalFields.filteredListings = GlobalFields.filteredListings.concat(GlobalFields.fixWrongImgCoverField(data));
            if (GlobalFields.filteredListings.length < 10 || data.length == 0)
              GlobalFields.filtersSearch.noMorePage = true;
          } else
            GlobalFields.filteredListings = [];
        });

    }
  }

  public static fixWrongImgCoverField(listings: Listing[]): Listing[] {
    if (listings) {
      for (let i = 0; i < listings.length; i++) {
        if (!listings[i].img_cover)
          listings[i].img_cover = listings[i].img_cover;
      }
      return listings;
    } else
      return [];
  }

  public static getImgFeaturedListing(listings: Listing[], service: any) {
    if (listings) {
      for (let i = 0; i < listings.length; i++) {
        service.getListingCoverDetails(listings[i]._links['wp:attachment'][0].href).subscribe((data: any) => {
          if (data && data.length > 0) {
            listings[i].img_cover = (data[0]).source_url;
          } else {
            listings[i].img_cover = '';
          }
        });
      }
    }
  }


  public static getCategoryId(id: any): ListingCategory {
    this.listingCategories.forEach(cat => {
      if (cat.id == id) {
        return cat;
      }
    });
    return undefined;
  }

  public static getMyAddress(service: Service, locationService: LocationService, nativeGeocoder: NativeGeocoder) {

    console.log('Get my location');

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    if (GlobalFields.site_details.mapType == 1) { //Google Maps
      nativeGeocoder.reverseGeocode(GlobalFields.lat, GlobalFields.long, options)
        .then((result: NativeGeocoderResult[]) => {
          console.log(JSON.stringify(result));

          GlobalFields.address = ''
          if(result[0].thoroughfare) //Street
            GlobalFields.address = result[0].thoroughfare + ', '
          if(result[0].subThoroughfare) //Address number
            GlobalFields.address = GlobalFields.address + result[0].subThoroughfare + ', '

          GlobalFields.address = GlobalFields.address + result[0].locality + ', ' + result[0].countryName;
        })
        .catch((error: any) => { //not avalailable the native service
          console.log(error);
          locationService.getMyAddressFromGoogle(GlobalFields.lat, GlobalFields.long).subscribe((data: any) => {
            if (data && data.results && data.results.length > 0) {
              GlobalFields.address = data.results[0].formatted_address;
            }
          });

        });
    } else { //Open Street Maps
      locationService.getAddressFromOpenMaps(GlobalFields.lat, GlobalFields.long).subscribe(res => {
          GlobalFields.address = res.display_name;
        }
      );
    }


  }


  public static setLang(lang, translate: TranslateService) {
    GlobalFields.languages.forEach(l => {
      if (l.flag == lang) {
        l.isChecked = true;
        translate.use(lang);
        console.log('language setted');
        //change font based on language
        let html = document.getElementById('mainHtmlTag');
        if (html)
          html.className = l.fontStyleClass;
      } else {
        l.isChecked = false;
      }
    });
  }


  public static getPrimaryColorJson(): any {
    return {'color': this.site_details.primaryColor};
  }

  public static getPrimaryColorBackgroundJson(): any {
    return {'background-color': this.site_details.primaryColor};
  }


  public static getBodyColorJson(): any {
    return {'color': this.site_details.bodyBackgroundColor};
  }

  public static isWhiteBackground(): boolean {
    if (!this.site_details.bodyBackgroundColor ||
      this.site_details.bodyBackgroundColor == 'white' ||
      this.site_details.bodyBackgroundColor == '#fff' ||
      this.site_details.bodyBackgroundColor == '#ffffff')
      return true;
    else
      return false;
  }

  public static getBodyColorBackgroundJson(): any {
    return {'background-color': this.site_details.bodyBackgroundColor};
  }

  //Return white background if listing list type is airbnb
  public static getBodyColorBackgroundJsonSearchPage(): any {
    return {'background-color': this.site_details.bodyBackgroundColor};
  }

  public static updateColor(themeService: ThemeService) {
    const color: string = this.site_details.primaryColor; // I'M ASSUMING THE PICKER RETURNS IT AS A STRING LIKE '#333333'

    GlobalFields.theme.primary = this.site_details.primaryColor;
    themeService.setTheme(GlobalFields.theme);

    let myTags = document.getElementsByClassName('dynamic-primary-color');
    for (let i = 0; i < myTags.length; i++) {
      (myTags.item(i) as HTMLElement).style.color = color;
      // myTags[i].style.backgroundColor = color;
      // UPDATE ANYTHING ELSE YOU WANT
    }
  }

  public static setCustomFont(themeService: ThemeService){
    if(this.site_details.customGoogleFontFamily)
      themeService.setGlobalFont(this.site_details.customGoogleFontFamily)
  else
      themeService.setGlobalFont('Didact Gothic')
  }


  public static getLatLongFromAddress(locationService: LocationService, address: string) {

    if (GlobalFields.site_details.mapType == 1) {
      locationService.getMyLatLongFromGoogle(address).subscribe((data: any) => {
        if (data.results && data.results.length > 0 && data.results[0].geometry && data.results[0].geometry.location) {
          GlobalFields.filtersSearch.lat = data.results[0].geometry.location.lat;
          GlobalFields.filtersSearch.lng = data.results[0].geometry.location.lng;
        }
      });
    } else { //Open Street Maps
      locationService.getLatLongFromOpenMaps(address).subscribe((data: any) => {
        console.log(data);
        if (data && data.length > 0) {
          GlobalFields.filtersSearch.lat = data[0].lat;
          GlobalFields.filtersSearch.lng = data[0].lon;
        }

      });
    }
  }


  public static clearFilters() {

    //clear all but not the location

    GlobalFields.filtersSearch.categories = [];
    GlobalFields.filtersSearch.location = undefined;
    GlobalFields.filtersSearch.region = undefined;
    GlobalFields.filtersSearch.tags = [];
    GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions.forEach(t => t.selected = undefined);
    GlobalFields.filtersSearch.customFieldsDropdownKeysOptions.forEach(t => t.selected = undefined);
    GlobalFields.filtersSearch.range = undefined;
    GlobalFields.filtersSearch.name = undefined;
    GlobalFields.filtersSearch.date = undefined;
    //GlobalFields.filtersSearch.lat = undefined;
    //GlobalFields.filtersSearch.lng = undefined;
    //GlobalFields.filtersSearch.location = undefined;

  }

  public static selectListingTypeDetail() {
    GlobalFields.selectedTypeDetail = GlobalFields.listingTypesDetails.find(res => res.ID == GlobalFields.filtersSearch.selectedType);
    // set default value to the range
    if (GlobalFields.selectedTypeDetail)
      GlobalFields.selectedTypeDetail.case27_listing_type_search_page.advanced.facets.forEach(filter => {
        if (filter.type == 'proximity') {
          GlobalFields.filtersSearch.range = GlobalFields.getDefaultProximity('advanced');
        }
      });
  }


  public static getCustomTaxonomiesByKey(key: string): any {
    let res = GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions.find(a => a.key == key);
    return res;
  }

  public static getCustomFieldsByKey(key: string): any {
    let res = GlobalFields.filtersSearch.customFieldsDropdownKeysOptions.find(a => a.key == key);
    return res;
  }

  public static getCustomTextFieldsByKey(key: string): any {
    let res = GlobalFields.filtersSearch.customFieldsText.find(a => a.key == key);
    return res;
  }

  public static getCustomTaxonomiesByKeyAddForm(key: string): any {
    let res = GlobalFields.addForm.customTaxonomiesDropdownKeysOptions.find(a => a.key == key);
    return res;
  }

  public static getCustomFieldsByKeyAddForm(key: string): any {
    let res = GlobalFields.addForm.customFieldsDropdownKeysOptions.find(a => a.key == key);
    return res;
  }

  public static getCustomFieldsMultiselectByKeyAddForm(key: string): any {
    let res = GlobalFields.addForm.customFieldsMultiselectKeysOptions.find(a => a.key == key);
    return res;
  }


  public static filterNotCustomFields(fields: any[]): any[] {
    let res = [];
    if(fields && fields.length>0)
      fields.forEach(key => {
        if (!key.includes('cover') &&
          !key.includes('job_video') &&
          !key.includes('description') &&
          !key.includes('edited') &&
          !key.includes('logo') &&
          !key.includes('expires') &&
          !key.includes('tagline') &&
          !key.includes('links') &&
          !key.includes('geo') &&
          !key.includes('price_range') &&
          !key.includes('key') &&
          !key.includes('thumbnail_id') &&
          !key.includes('work_hours') &&
          !key.includes('case27_listing_type') &&
          !key.includes('job_category') &&
          !key.includes('location') &&
          !key.includes('phone') &&
          !key.includes('email') &&
          !key.includes('title') &&
          !key.includes('yoast') &&
          !key.includes('gallery') &&
          !key.includes('tags') &&
          !key.includes('package_id') &&
          !key.includes('region') &&
          !key.includes('edit') &&
          !key.includes('claimed') &&
          !key.includes('case27') &&
          !key.includes('meta') &&
          !key.includes('Meta') &&
          !key.includes('wp') &&
          !key.includes('application') &&
          !key.includes('featured') &&
          !key.includes('jetpack') &&
          !key.includes('_job_date') &&
          !key.includes('oembed') &&
          !key.includes('cache')
        )
          if (!GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions.find(tax => tax.key == key)) {
            res.push(key);
          }
      });
    return res;
  }

  public static filterNotCustomTaxonomies(fields: any[]): string[] {
    let res = [];
    for (let key in fields) {
      if (!key.includes('job_listing_category') &&
        !key.includes('region') &&
        !key.includes('case27_job_listing_tags')
      )
        res.push(key);
    }
    return res;
  }

  public static keyIsACustomField(key: string): boolean {
    let a = GlobalFields.listingCustomFieldKeys.find(k => k == key);
    if (a)
      return true;
    else
      return false;
  }

  public static duplicateObj(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }


  public static async openAlert(alertController: AlertController, header?: string, subHeader?: string, msg?: string) {
    const alert = await alertController.create({
      header: 'Error',
      subHeader: 'Error on your server',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


  public static async openSuccessAlert(alertController: AlertController, header?: string, subHeader?: string, msg?: string, btnMsg?: string) {
    const alert = await alertController.create({
      header: header,
      subHeader: subHeader,
      message: msg,
      buttons: [btnMsg]
    });

    await alert.present();
  }

  public static getLanguageLayout() {

    const language = GlobalFields.languages.find(l => l.isChecked);
    if (language) {
      if (language.flag == 'sa' || language.flag == 'il')
        return 'rtl';
      else
        return 'ltr';
    }
  }


  //Proximity default values
  /*
  In the array GlobalFields.selectedTypeDetail.case27_listing_type_search_page.advanced.facets[] search for type=='proximity'
  Can also have options setted instead of the single fields
  * {
    default: "20"
    default_label: ""
    is_primary: false
    label: "Proximity:"
    max: "80"
    options: []
    step: 1
    type: "proximity"
    units: "metric"
    }
  *
  * */
  public static getMinimumProximity(search_type: string) { //'advanced' or 'basic' search
    let v = 0;

    if (GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type] &&
      GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets) {
      const opt = GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets.find(el => el.type == 'proximity');
      if (opt)
        v = opt.min;
      if (!v && opt.options && opt.options.lenght > 0) { //case it has options array
        const o = opt.options.find(el => el.name == 'min');
        if (o)
          v = o.value;
      }
      if (!v)
        v = 0;
    }
    return v;

    /*let v = 0;
    if (obj.options && obj.options.length > 0) {
      obj.options.forEach(o => {
        if (o.name == 'min')
          v = parseInt(o.value);
      });
    } else {
      if (obj.min)
        v = parseInt(obj.min);
    }
    return v;
    */
  }

  public static getMaximumProximity(search_type: string) { //'advanced' or 'basic' search
    let v = 500;

    if (GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type] &&
      GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets) {
      const opt = GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets.find(el => el.type == 'proximity');
      if (opt)
        v = opt.max;
      if (!v && opt.options && opt.options.lenght > 0) { //case it has options array
        const o = opt.options.find(el => el.name == 'max');
        if (o)
          v = o.value;
      }
      if (!v)
        v = 500;
    }
    return v;

    /*
    if (obj.options && obj.options.length > 0) {
      obj.options.forEach(o => {
        if (o.name == 'max')
          v = parseInt(o.value);
      });
    } else {
      if (obj.max)
        v = parseInt(obj.max);
    }
    return v;

    */

  }

  public static getUnitRangeProximity(search_type: string) { //'advanced' or 'basic' search
    let v = 'metric';
    if (GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type] &&
      GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets) {
      const opt = GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets.find(el => el.type == 'proximity');
      if (opt)
        v = opt.units;
      if (!v && opt.options) { //case it has options array
        const o = opt.options.find(el => el.name == 'units');
        if (o)
          v = o.value;
      }
      if (!v)
        v = 'metric';
    }
    return v;

    /*  let v = '';
      if (obj.options && obj.options.length > 0) {
        obj.options.forEach(o => {
          if (o.name == 'units')
            v = o.value;
        });
      } else {
        if (obj.units)
          v = obj.units;
      }
      return v;
     */

  }


  public static getStepProximity(search_type: string) { //'advanced' or 'basic' search
    let v = 1;
    if (GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type] &&
      GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets) {
      const opt = GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets.find(el => el.type == 'proximity');
      if (opt)
        v = opt.step;
      if (!v && opt.options && opt.options.lenght > 0) { //case it has options array
        const o = opt.options.find(el => el.name == 'step');
        if (o)
          v = o.value;
      }
      if (!v)
        v = 1;
    }
    return v;
  }


  public static getDefaultProximity(search_type: string) { //'advanced' or 'basic' search

    let v = 10;
    if (GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type] &&
      GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets) {
      const opt = GlobalFields.selectedTypeDetail.case27_listing_type_search_page[search_type].facets.find(el => el.type == 'proximity');
      if (opt)
        v = opt.default;
      if (!v && opt.options && opt.options.lenght > 0) { //case it has options array
        const o = opt.options.find(el => el.name == 'default');
        if (o)
          v = o.value;
      }
      if (!v)
        v = 10;
    }
    return v;
  }


  public static getOnlyTimeFromDate(time?: string) {
    const t1 = time.split('T');
    console.log(t1);
    if (t1 && t1.length > 1) { //the format is 2020-09-01T07:00:54.821-00:00
      const t2 = t1[1].split(':');
      if (t2.length > 1) {
        const hr = t2[0];
        const mm = t2[1];
        console.log(hr + ':' + mm);
        return hr + ':' + mm;
      }
    } else if (t1 && t1.length == 1) { //the format is 18:00
      const t2 = t1[0].split(':');
      if (t2.length > 1) {
        const hr = t2[0];
        const mm = t2[1];
        console.log(hr + ':' + mm);
        return hr + ':' + mm;
      }
    }
  }

}
