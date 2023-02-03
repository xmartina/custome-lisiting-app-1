import {Component, ComponentRef, Input, OnInit} from '@angular/core';
import {ListingPage} from '../listingPage/listingPage';
import {Listing} from '../../app/entities/listing';
import {Post} from '../../app/entities/post';
import {Constants} from '../../app/Constants';
import {GlobalFields} from '../../app/GlobalFields';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {Service} from '../services/Service';
import {TranslateService} from '@ngx-translate/core';
import {ModalPost} from '../home/modalPost/modalPost';
import {DomSanitizer} from '@angular/platform-browser';

import {ImageAttribute} from 'ionic-image-loader';
import {ListingTypeDetail} from '../entities/listingTypeDetail';


// DOC: https://ionicframework.com/docs/building/running

// to build the apk: sudo ionic cordova build --release android


// per testare app: https://cordova-plugin-fcm.appspot.com/

// PER GENERARE APK: sudo cordova build android --release


// FIREBASE EXAMPLE -> https://medium.com/factory-mind/angular-firebase-typescript-step-by-step-tutorial-2ef887fc7d71

@Component({
    selector: 'page-listingList',
    templateUrl: 'listingList.html',
    styleUrls: ['listingList.scss']
})
export class ListingList implements OnInit{

    Constants = Constants;
    GlobalFields = GlobalFields;
    public static popover = undefined;


    @Input() listing: Listing;
    @Input() search: boolean; //true: search, false: not search
    @Input() type: string; //"1": box, "2": list, "3": box with logo

    listingType: ListingTypeDetail;

    constructor(public service: Service, public modalCtrl: ModalController, public navController: NavController,
                public platform: Platform, public translate: TranslateService, private _sanitizer: DomSanitizer,
                public alertController: AlertController) {}

    ngOnInit(){
        if (this.listing && this.listing.listing_data) {
            this.listingType = GlobalFields.getListingTypeBySlug(this.listing.listing_data._case27_listing_type);
        }
    }


    async openModalPost(post: Post) {

        const modal = await this.modalCtrl.create({
            component: ModalPost,
            componentProps: {post: post}
        });
        return await modal.present();
    }

    getListingDetails(listing) {
        console.log("getListingDetails");
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
        console.log("openModalListing")

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

    isWhiteBackgroundBorder(): string {
        if (GlobalFields.isWhiteBackground())
            return '';
        else
            return ' borderList';
    }

    isWhiteBackgroundBoxShadow(): string {
        if (GlobalFields.isWhiteBackground())
            return '';
        else
            return ' boxShadowList';
    }


    getCardClass(): string {
        if (this.search)
            return 'listCardNoFixedHeight card card-ios ';
        else
            return 'listCard card card-ios ';
    }

    getImgClass(): string {
        if (this.search)
            return 'backImgBigger';
        else
            return 'backImg';
    }

    getImgCachedClass(type): ImageAttribute[] {
        let class_name = "imgCachedAsBackground ";

        if (type=='1') {
            if (this.search)
                class_name = class_name + 'backImgBiggerCached backgroundListingImgCached shadedImgCachedAirbnb';
            else
                class_name = class_name + 'backImgCached backgroundListingImgCached shadedImgCachedAirbnb';
        }
        if(type=='2' || type=='2b')
            class_name = class_name + 'backImgListCache';
        if(type=='3')
            class_name = class_name + 'backImgSquaredAndLogoCached shadedImgCached';

        const imageAttributes: ImageAttribute[] = [];
        imageAttributes.push({
            element: 'class',
            value: class_name
        });


        return imageAttributes;
    }

    getImgCachedClassByClass(classes: string): ImageAttribute[] {

        let class_name = "imgCachedAsBackground " + classes;

        const imageAttributes: ImageAttribute[] = [];
        imageAttributes.push({
            element: 'class',
            value: class_name
        });

        return imageAttributes;
    }

    /*
      async openModalListing(listing: Listing) {
        const modal = await this.modalCtrl.create(ListingPage,{ listing: listing });
        return await modal.present();
      }
    */


    isClaimed(): boolean {
        if (this.listing['_claimed'] && this.listing['_claimed'] == '1')
            return true;
        else return false;
    }


    getBackground(listing: Listing) {
        let image = '';

        if (listing.img_cover)
            image = listing.img_cover;
        if (!listing.img_cover && listing.listing_data && listing.listing_data._job_cover)
            image = listing.listing_data._job_cover;
        else if (!listing.img_cover && listing.listing_data && !listing.listing_data._job_cover)
            image = GlobalFields.site_details.placeholderImgUrl;
        return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }


    getListingImg(listing: Listing) {
        let image = '';

        if (listing.img_cover)
            image = listing.img_cover;
        if (!listing.img_cover && listing.listing_data && listing.listing_data._job_cover)
            image = listing.listing_data._job_cover;
        else if (!listing.img_cover && listing.listing_data && !listing.listing_data._job_cover)
            image = GlobalFields.site_details.placeholderImgUrl;
        return image;
    }

    getListingImgNewStructureData(listing: Listing) {
        let image = '';

        if (listing.img_cover)
            image = listing.img_cover;
        if (!listing.img_cover && listing.job_cover)
            image = listing.job_cover;
        else if (!listing.img_cover && !listing.job_cover)
            image = GlobalFields.site_details.placeholderImgUrl;
        return image;
    }


    getBackgroundDarker(listing: Listing) {
        let image = '';

        if (listing.img_cover)
            image = listing.img_cover;
        if (!listing.img_cover && listing.listing_data && listing.listing_data._job_cover)
            image = listing.listing_data._job_cover;
        else if (!listing.img_cover && listing.listing_data && !listing.listing_data._job_cover)
            image = GlobalFields.site_details.placeholderImgUrl;
        return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(to top, rgba(23, 23, 23, 0.52), rgba(23, 23, 23, 0.52)), url(${image})`);
    }

    getStartsHtml(rating: string): string[] {
        let num = (parseFloat(rating)) / 2;
        let res = [];
        while (num >= 1){
            res.push("");
            num = num - 1;
        }
        if (num < 1 && num > 0)
            res.push('-half');

        for (let i = 0; i < 5 - res.length; i++) {
            res.push('-outline');
        }

        return res;
    }

    getTruncatedDecimal(n: any) {
        let num = parseFloat(n);
        return num.toFixed(1);
    }


}


