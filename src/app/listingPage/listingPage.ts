import {Component} from '@angular/core';
import {NavController, Platform, PopoverController} from '@ionic/angular';
import {Listing} from '../../app/entities/listing';
import {GlobalFields} from '../../app/GlobalFields';
import {Constants} from '../../app/Constants';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {ModalController} from '@ionic/angular';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {LaunchNavigator} from '@ionic-native/launch-navigator/ngx';
import {Service} from '../services/Service';

import {SocialSharing} from '@ionic-native/social-sharing/ngx';


import 'hammerjs';
import {TranslateService} from '@ngx-translate/core';
import {PopoverRatings} from './popoverRatings/popoverRatings';
import {PopoverImg} from './popoverImg/popoverImg';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalWriteReview} from './modalWriteReview/modalWriteReview';
import {ImageAttribute} from 'ionic-image-loader';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {WorkHoursDay} from '../entities/FiltersSearch';


@Component({
    selector: 'page-listing',
    templateUrl: 'listingPage.html',
    styleUrls: ['listingPage.scss']

})
export class ListingPage {

    listing: Listing;

    custFields: { key: string, value: string, show_in_detail_view?: boolean }[] = [];
    custRelatedListings: { key: string, label:string, listings:Listing[] }[] = [];
    custTaxonomies: { key: string, label: string, value: any[], show_in_detail_view?: boolean }[] = [];

    GlobalFields = GlobalFields;
    Constants = Constants;

    iniFinished = false;

    existCustomFieldToBeShown = true;

    daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    daysOfTheWeekLabel = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    youtubeUrl;

  slideOpts = {
    slidesPerView: 1
  };

    constructor(public service: Service, public modalCtrl: ModalController,
                private statusBar: StatusBar, private callNumber: CallNumber, private platform: Platform,
                private launchNavigator: LaunchNavigator, private socialSharing: SocialSharing,
                public translate: TranslateService, public popoverController: PopoverController,
                private _sanitizer: DomSanitizer, public navController: NavController, public inAppBrowser: InAppBrowser) {
      this.ini();
    }

    ini(){
      if (GlobalFields.selectedListing._case27_listing_type)
        GlobalFields.selectedTypeDetail = GlobalFields.listingTypesDetails.find(res => res.post_name == GlobalFields.selectedListing._case27_listing_type);
      if (GlobalFields.selectedTypeDetail) {
        GlobalFields.filtersSearch.selectedType = this.GlobalFields.selectedTypeDetail.ID;
        this.GlobalFields.selectListingTypeDetail();
      }

      console.log(GlobalFields.selectedTypeDetail);
      console.log(GlobalFields.selectedListing);

      //controlla se è un array, se non lo è lo converte in array
      if (GlobalFields.selectedListing.job_gallery && !Array.isArray(GlobalFields.selectedListing.job_gallery)) {
        this.translateToArray();
      }

      this.getCategories();
      this.getCustomFields();
      this.getCustomTaxonomies();

      console.log(this.custFields);
      console.log(this.custTaxonomies);
      console.log(this.custRelatedListings);
      this.existCustomFieldToBeShown = this.ifExistCustomFieldTaxToBeShown();
      this.iniFinished = true;
      this.GlobalFields.loadingSoft = false;

      //preprare custom ratings
      GlobalFields.selectedListing.comments.forEach(comm => {
        if (comm.ratings)
          comm.ratings = this.generateArray(comm.ratings);
      });


      //check if is bookmarked
      if (GlobalFields.bookmarkedListings && GlobalFields.bookmarkedListings.find(el => el.id == GlobalFields.selectedListing.id))
        GlobalFields.selectedListing.isBookmarked = true;
      else GlobalFields.selectedListing.isBookmarked = false;

      this.service.storeRecentViewedListing(GlobalFields.selectedListing);


      this.translate.get('DAY_MON').subscribe(msg1 =>{
        this.translate.get('DAY_TUE').subscribe(msg2 =>{
          this.translate.get('DAY_WED').subscribe(msg3 =>{
            this.translate.get('DAY_THU').subscribe(msg4 =>{
              this.translate.get('DAY_FRI').subscribe(msg5 =>{
                this.translate.get('DAY_SAT').subscribe(msg6 =>{
                  this.translate.get('DAY_SUN').subscribe(msg7 =>{
                    this.daysOfTheWeekLabel = [msg1, msg2, msg3, msg4, msg5, msg6, msg7];

                  })
                })
              })
            })
          })
        })
      });
    }

    ifExistCustomFieldTaxToBeShown(){
        if (this.custFields && this.custFields.some(el => el.show_in_detail_view))
            return true;
        else
            return false;
    }

    translateToArray() {
        if (GlobalFields.selectedListing.job_gallery) {
            let i = 1;
            let res = [];
            while (GlobalFields.selectedListing.job_gallery[i + '']) {
                res.push(GlobalFields.selectedListing.job_gallery[i + '']);
                i = i + 1;
            }
            GlobalFields.selectedListing.job_gallery = res;
            return;
        }
    }

    closeModal() {
        this.GlobalFields.selectedListing = undefined;
        //this.navCtrl.pop();
        this.modalCtrl.dismiss({});
    }


    getCustomField(key: string) {
        let res = GlobalFields.selectedListing['_' + key];
        if (!res)
            res = GlobalFields.selectedListing[key];
        return res;
    }

    fieldToBeShown(key: string) {
        let field = this.GlobalFields.selectedTypeDetail.case27_listing_type_fields[key];
        if (field && field.show_in_detail_view)
            return true;
        else
            false;
    }

    isPresentCustomField(key: string) {
        let a = GlobalFields.selectedListing[key];
        let b = this.GlobalFields.selectedTypeDetail.case27_listing_type_fields[key.substr(1)];
        if (a != undefined && b != undefined)
            return true;
        else
            return false;
    }


    /*
      openModalGallery(index: number) {
        let photos = [];
        for (let media of {.listing_data._job_gallery) {
          photos.push({url: media});
        }
        let modal = this.modalCtrl.create(GalleryModal, {
          photos: photos,
          initialSlide: index
        });
        modal.present();
      }
    */

    async openModalGallery(index: number) {
        /* let photos = [];
         for (let media of this.listing.listing_data._job_gallery) {
             photos.push({url: media});
         }
         const modal = await this.modalCtrl.create({
                 component: GalleryModal,
                 componentProps: {
                     photos: photos,
                     initialSlide: index
                 }
             });
         return await modal.present();
         */
    }


    getNiceString(s: string): string {
        let field = this.GlobalFields.selectedTypeDetail.case27_listing_type_fields[s];
        if (field)
            return field.label;
        else
            return '';
    }

    getCustomFieldFromListingType(s: string) {
        let field = this.GlobalFields.selectedTypeDetail.case27_listing_type_fields[s];
        return field;
    }

    generateArray(obj) {
        return Object.keys(obj).map((key) => {
            return {key: key, value: obj[key]};
        });
    }

    getStringFromArray(arr){
        if (arr && Array.isArray(arr))
            return arr.join();
    }


    isHTML(str) {
        if (str && !Array.isArray(str)) {
            let a = document.createElement('div');
            a.innerHTML = str;

            for (let c = a.childNodes, i = c.length; i--;) {
                if (c[i].nodeType == 1) return true;
            }
        }
        return false;
    }

    isURL(str) {

        if (str && !Array.isArray(str)) {

            let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return !!pattern.test(str);
        }
        return false;
    }


    isArray(str) {
        console.log(str)

        if (str && Array.isArray(str)) {
            return true;
        }
        return false;
    }

    isShortCode(str: string){
        if (str && typeof str === 'string')
            return (str.includes("[") && str.includes("]"));
        else true
    }

    getWorkingHours(day: WorkHoursDay) {
        let res = '';
        if(day && day.entry_hours)
          day.entry_hours.forEach((d, i) =>{
            res = res + d.from + ' - ' + d.to;
            if (i<day.entry_hours.length-1)
              res = res + "<br>"
          })
        if (res != '')
            return res;
        else
            return '-';
    }

    getStartsHtml(rating: string): string[] {
        let num = (parseFloat(rating));
        let res = [];
        let maxNumberStarts = 5;
        for (let i = 0; i < maxNumberStarts; i++) {
            if (num >= 1) {
                res.push('');
                num = num - 1;
            } else if (num > 0) {
                res.push('-half');
                num = 0;
            } else {
                res.push('-outline');
            }
        }
        return res;
    }

    getNumberFromString(s: string): number {
        return parseInt(s);
    }

    getCategories() {
        let res = [];
        if (GlobalFields.selectedListing.job_listing_category) {
            GlobalFields.selectedListing.job_listing_category.forEach(id => {
                let p = GlobalFields.getCategoryId(id);
                GlobalFields.listingCategories.forEach(cat => {
                    if (cat.id == id) {
                        res.push(cat);
                    }
                });
            });
        }
        GlobalFields.selectedListing.job_listing_category = res;
    }

    getCustomFields(){
        //filtra tutti i campi che non devono compararire
        let keys = GlobalFields.filterNotCustomFields(Object.keys(GlobalFields.selectedListing));
        this.custFields = [];
        this.custRelatedListings = [];
        if (keys && Array.isArray(keys))
            keys.forEach(key => {
                let okKey;
                if (key[0] == '_')
                    okKey = key.substr(1); //starts with "_" only in listing.listing_data
                else
                    okKey = key;

                if (okKey != 'related_listing' && okKey != 'job_duration') {
                    const listingTypeField = this.getCustomFieldFromListingType(okKey);
                    console.log(listingTypeField);
                    if(listingTypeField) {
                        let value = this.getCustomFieldTaxonomyOptionByKey(okKey, this.getCustomField(okKey));
                        console.log(value);
                        if (value) {
                            //not custom related listings
                            if (value != '' && !this.isShortCode(value) && listingTypeField.type != "related-listing")
                                this.custFields.push({key: okKey, value: value, show_in_detail_view: this.fieldToBeShown(okKey)});
                            //custom related listings
                            if (listingTypeField.type == "related-listing")
                                this.custRelatedListings.push({key: okKey, label: listingTypeField.label, listings: value as any[]});
                        }
                    }
                }
            });
    }

    getCustomTaxonomies(){
        let keys = GlobalFields.filterNotCustomTaxonomies(GlobalFields.selectedListing.pure_taxonomies);
        this.custTaxonomies = [];
        console.log(keys);
        if (keys && Array.isArray(keys))
            keys.forEach(key => {
                const listingTypeField = this.getCustomFieldFromListingType(key);
                console.log(listingTypeField);
                if(listingTypeField){
                    let value = GlobalFields.selectedListing.pure_taxonomies[key];
                    console.log(value);
                    if (value && value != '')
                        this.custTaxonomies.push({key: key, label: listingTypeField.default_label, value: value, show_in_detail_view: this.fieldToBeShown(key)});
                }
            });
    }


    getLinkIcon(net: string) {


        switch (net) {
            case 'Facebook' :
            case 'facebook' :
            case 'fb' : {
                return 'fab fa-facebook';
            }
            case 'Instagram' :
            case 'instagram' :
            case 'insta' : {
                return 'fab fa-instagram';
            }
            case 'Website' :
            case 'website' :
            case 'web' : {
                return 'fas fa-globe';
            }
            case 'Twitter' :
            case 'twitter' : {
                return 'fab fa-twitter';
            }
            case 'Pinterest' :
            case 'pinterest' : {
                return 'fab fa-pinterest';
            }
            case 'YouTube' :
            case 'youtube' : {
                return 'fab fa-youtube';
            }
            case 'Google+' :
            case 'google': {
                return 'fab fa-google';
            }
            case 'Reddit' :
            case 'reddit': {
                return 'fab fa-reddit';
            }
            case 'Snapchat' :
            case 'snapchat': {
                return 'fab fa-snapchat';
            }
            case 'Tumblr' :
            case 'tumblr': {
                return 'fab fa-tumblr';
            }
            default :
                return 'fas fa-link';
        }
    }

    getLinkColor(net: string) {
        switch (net) {
            case 'Facebook' :
            case 'facebook' :
            case 'fb' : {
                return '#3B5998';
            }
            case 'Instagram' :
            case 'instagram' :
            case 'insta' : {
                return '#E1306C';
            }
            case 'Website' :
            case 'website' :
            case 'web' : {
                return '#499EFF';
            }
            case 'Twitter' :
            case 'twitter' : {
                return '#1dcaff';
            }
            case 'Pinterest' :
            case 'pinterest' : {
                return '#E60023';
            }
            case 'YouTube' :
            case 'youtube' : {
                return '#F44336';
            }
            case 'Google+' :
            case 'google': {
                return '#F44336';
            }
            case 'Reddit' :
            case 'reddit': {
                return '#ff4500';
            }
            case 'Snapchat' :
            case 'snapchat': {
                return '#FFEB3B';
            }
            case 'Tumblr' :
            case 'tumblr': {
                return '#34526f';
            }
            default :
                return '#499EFF';
        }
    }


    callNumberAction(number: string) {
        console.log('Call number ' + number);
        if (!this.platform.is('mobileweb')) //non è browser
        {
            this.callNumber.callNumber(this.clearSpaces(number) + '', true)
                .then(res => console.log('Launched dialer!', res))
                .catch(err => console.log('Error launching dialer', err));
        }
    }

    goToNavigatorAction(address: string) {
        console.log('Go to ' + address);
        if (!this.platform.is('mobileweb')) //non è browser
        {
            this.launchNavigator;
            this.launchNavigator.navigate(address)
                .then(
                    success => console.log('Launched navigator'),
                    error => console.log('Error launching navigator', error)
                );
        }
    }

    clearSpaces(s: string) {
        return s.replace(' ', '').replace(' ', '').replace(' ', '');
    }


    share() {

        this.socialSharing.share('Check this link', '', '', GlobalFields.selectedListing.link).then(function () {
            console.log('Successful share');
        }).catch(function (error) {
            console.log('Error sharing:', error);
        });
    }

    getActionContainerClass(): string {
        if (GlobalFields.site_details.actionButtonStyle == '2')
            return 'fastBtnsContainer';
        else
            return 'fastBtnsContainerFull';
    }

    getActionLabelClass(): string {
        if (GlobalFields.site_details.actionButtonStyle == '2')
            return 'fastBtnLabel';
        else
            return 'fastBtnLabelWhite';
    }


    getCustomFieldTaxonomyOptionByKey(key: string, optID: any): string | any | any[] {
     /*   console.log(key);
        console.log(optID);
        console.log(GlobalFields.filtersSearch.customFieldsDropdownKeysOptions);
        console.log(GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions);
    */
        //is a custom field ?
        let field = GlobalFields.filtersSearch.customFieldsDropdownKeysOptions.find(term => term.key == key);
        if (field && field.options) {
            let opt = field.options.find(temp => temp.term_id == optID);
            if (opt) //is not an array
                return opt.name;
            else if (Array.isArray(optID)) { //is an array
                let res = '';
                for (let i = 0; i < optID.length; i++) {
                    let opt = field.options.find(temp => temp.term_id == optID[i]);
                    if (opt) {
                        if (i < optID.length - 1)
                            res += opt.name + ', ';
                        else
                            res += opt.name;
                    }
                }
                return res;
            }
            else if (optID.constructor === Object) {//is an object
                let res = '';
                for (let property in optID) {
                    res += optID[property] + ' ';
                }
                return res;
            }
        }

        //is a taxonomy ?
        field = GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions.find(term => term.key == key);
        if (field && field.options) {
            let opt = field.options.find(temp => temp.term_id == optID);
            if (opt) //is not an array
                return opt.name;
            else if (Array.isArray(optID)) { //is an array
                let res = '';
                for (let i = 0; i < optID.length; i++) {
                    let opt = field.options.find(temp => temp.term_id == optID[i]);
                    if (opt) {
                        if (i < optID.length - 1)
                            res += opt.name + ', ';
                        else
                            res += opt.name;
                    }
                }
                return res;
            }
            else if (optID.constructor === Object) {//is an object
                let res = '';
                for (let property in optID) {
                    res += optID[property] + ' ';
                }
                return res;
            }
        }

        return optID;
    }

    showContactInfo(): boolean {
        //if no data to show
        if ((!GlobalFields.selectedListing || (!GlobalFields.selectedListing.job_email && !GlobalFields.selectedListing.job_phone &&
          !GlobalFields.selectedListing.job_location && !GlobalFields.selectedListing.links)))
          return false;

        if (this.GlobalFields.site_details.contactInfoChoice == '1') //show always
            return true;
        if (this.GlobalFields.site_details.contactInfoChoice == '3') //hide always
            return false;
        if (this.GlobalFields.site_details.contactInfoChoice == '2' &&
            this.GlobalFields.selectedListing['claimed'] && this.GlobalFields.selectedListing['claimed'] == '1')
            return true;
        else return false;
    }

    isClaimed(): boolean {
        if (this.GlobalFields.selectedListing['claimed'] && this.GlobalFields.selectedListing['claimed'] == '1')
            return true;
        else return false;
    }

    async openRatingsPopover(ev: any, ratings: any) {

        GlobalFields.customRatingsSelected = ratings;

        const popover = await this.popoverController.create({
            component: PopoverRatings,
            cssClass: '',
            event: ev,
            translucent: true
        });
        return await popover.present();

    }


    async openImgPopover(url: string) {

        GlobalFields.selectedImg = url;

        const popover = await this.popoverController.create({
            component: PopoverImg,
            cssClass: 'popoverImg',
            translucent: true
        });
        return await popover.present();

    }


    getClassContainer() {
        if (this.GlobalFields.isWhiteBackground())
            return 'sectionContainer';
        else return 'sectionContainerNotWhiteBackground';

    }


    getBackground(listing: Listing) {
        let image = '';

        if (listing && listing.img_cover)
            image = listing.img_cover;
        if (listing && !listing.img_cover && listing.job_cover)
            image = listing.job_cover;
        else if (!listing || (!listing.img_cover && !listing.job_cover))
            image = GlobalFields.site_details.placeholderImgUrl;
        return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }


    getBackgroundDarker(listing: Listing) {
        let image = '';

        if (listing.img_cover)
            image = listing.img_cover;
        if (!listing.img_cover && listing.job_cover)
            image = listing.job_cover;
        else if (!listing.img_cover)
            image = GlobalFields.site_details.placeholderImgUrl;
        return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(to top, rgba(23, 23, 23, 0.52), rgba(23, 23, 23, 0.52)), url(${image})`);
    }

    getBackgroundDarkerCached(listing: Listing) {
        let image = '';

        if (listing.img_cover)
            image = listing.img_cover;
        if (!listing.img_cover && listing.job_cover)
            image = listing.job_cover;
        else if (!listing.img_cover && !listing.job_cover)
            image = GlobalFields.site_details.placeholderImgUrl;
        return image;
    }

    async writeReview() {

        this.GlobalFields.oldReview = this.youAlreadyReviewed();

        const modal = await this.modalCtrl.create({
          component: ModalWriteReview,
        });
        modal.present();

        const { data } = await modal.onWillDismiss();
        this.ini();

    }

    goToLogin() {
        this.navController.navigateForward('tabs/menuPage');
        this.closeModal();
    }

    doBookmark() {
        GlobalFields.selectedListing.isBookmarked = true;
        GlobalFields.loadingSoft = true;
        this.service.doBookmark(GlobalFields.selectedListing.id).subscribe((data: any) => {
            GlobalFields.loadingSoft = false;
            this.service.getBookmarkedListings().subscribe((data: any) => {
                GlobalFields.bookmarkedListings = data;
            });

        }, err => {
            GlobalFields.loadingSoft = false;
            this.service.refreshCookie();
        });
    }

    undoBookmark() {
        GlobalFields.selectedListing.isBookmarked = false;
        GlobalFields.loadingSoft = true;
        this.service.undoBookmark(GlobalFields.selectedListing.id).subscribe((data: any) => {
            GlobalFields.loadingSoft = false;
            this.service.getBookmarkedListings().subscribe((data: any) => {
                GlobalFields.bookmarkedListings = data;
            });

        }, err => {
            GlobalFields.loadingSoft = false;
            this.service.refreshCookie();
        });
    }


    getTruncatedDecimal(n: any) {
        let num = parseFloat(n);
        return num.toFixed(1);
    }

    youAlreadyReviewed() {

        return GlobalFields.selectedListing.comments.find(comm => comm.author_id == this.GlobalFields.profile.user.id);
    }

    getImgCachedClass(class_to_add: string): ImageAttribute[] {
        let class_name = " " + class_to_add;

        const imageAttributes: ImageAttribute[] = [];
        imageAttributes.push({
            element: 'class',
            value: class_name
        });


        return imageAttributes;
    }


    goToMessage(){
        this.GlobalFields.msgToOwner = GlobalFields.selectedListing.author;
        this.closeModal();
        this.navController.navigateForward('tabs/messages');
    }


    openLink(url: string){
        console.log(url);
        const browser = this.inAppBrowser.create(url, '_system');


       // browser.close();
    }


    getPrefixIfExist(field: { key: string, value: string, show_in_detail_view?: boolean }){
        let res = "";
        if(this.GlobalFields.selectedTypeDetail.case27_listing_type_single_page_options && this.GlobalFields.selectedTypeDetail.case27_listing_type_single_page_options.cover_details && this.GlobalFields.selectedTypeDetail.case27_listing_type_single_page_options.cover_details.length>0){
            this.GlobalFields.selectedTypeDetail.case27_listing_type_single_page_options.cover_details.forEach(obj =>{
                if(obj.field == field.key)
                    res = obj.prefix
            })
        }
        return res;
    }
    getSuffixIfExist(field: { key: string, value: string, show_in_detail_view?: boolean }){
        let res = "";
        if(this.GlobalFields.selectedTypeDetail.case27_listing_type_single_page_options && this.GlobalFields.selectedTypeDetail.case27_listing_type_single_page_options.cover_details && this.GlobalFields.selectedTypeDetail.case27_listing_type_single_page_options.cover_details.length>0){
            this.GlobalFields.selectedTypeDetail.case27_listing_type_single_page_options.cover_details.forEach(obj =>{
                if(obj.field == field.key)
                    res = obj.suffix
            })
        }
        return res;
    }

    checkIfHasPackageToBeShown(_key: string): boolean{
        const key = _key.replace('_','');
        const field = this.GlobalFields.selectedTypeDetail.case27_listing_type_fields[key];
        //    conditions?: {key?: string, compare?: string, value?: string}[];
        if(field) {
            if (!field.conditions) return true;
            if (field.conditions.length == 0) return true;

            if (
                field.conditions.some(cond => {
                    return cond.some(c =>{
                        if (c.key == '__listing_package' && c.compare == '==' &&
                            (!c.value || c.value == "" || c.value == this.GlobalFields.selectedListing.package_id)
                        )
                            return true;
                        else return false;
                    })

                })
            )
                return true;
        }
        return false;
    }


    getSanifiedUrl(url: string) {
        if(url && url.includes('youtube') && url.split('?').length>0) {
            const r_url = 'https://youtube.com/embed/' + url.split('?')[1].replace('v=','');
            console.log(r_url);
            return this._sanitizer.bypassSecurityTrustResourceUrl(r_url);
        }
    }

}
