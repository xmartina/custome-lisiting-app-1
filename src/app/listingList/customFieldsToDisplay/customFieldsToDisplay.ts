import {Component, ComponentRef, Input, OnInit} from '@angular/core';
import {ListingPage} from '../../listingPage/listingPage';
import {Listing} from '../../../app/entities/listing';
import {Post} from '../../../app/entities/post';
import {Constants} from '../../../app/Constants';
import {GlobalFields} from '../../../app/GlobalFields';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {Service} from '../../services/Service';
import {TranslateService} from '@ngx-translate/core';
import {ModalPost} from '../../home/modalPost/modalPost';
import {DomSanitizer} from '@angular/platform-browser';

import {ImageAttribute} from 'ionic-image-loader';
import {ListingTypeDetail} from '../../entities/listingTypeDetail';


// DOC: https://ionicframework.com/docs/building/running

// to build the apk: sudo ionic cordova build --release android


// per testare app: https://cordova-plugin-fcm.appspot.com/

// PER GENERARE APK: sudo cordova build android --release


// FIREBASE EXAMPLE -> https://medium.com/factory-mind/angular-firebase-typescript-step-by-step-tutorial-2ef887fc7d71

@Component({
  selector: 'custom-fields',
  templateUrl: 'customFieldsToDisplay.html',
  styleUrls: ['customFieldsToDisplay.scss']
})
export class CustomFieldsToDisplay implements OnInit {

  Constants = Constants;
  GlobalFields = GlobalFields;
  public static popover = undefined;

  @Input() listing: Listing;
  @Input() customFieldsType?: number; //1: Info fields, 2: Buttons
  @Input() customFields: { label?: string, show_field?: string, icon?: string }[] = [];
  @Input() listingType: ListingTypeDetail;
  @Input() type: string; //"1": Buttons (header), "2": Info fields (under title), "3": footer

  todayDayKey: string;

  //Info fiends and buttons
  filteredCustomFields: { label?: string, show_field?: string, icon?: string }[] = [];
  //Footers
  customTaxonomies: { icon_font?: string, first_category?: string, others?: string[] }[] = [];

  constructor(public service: Service, public modalCtrl: ModalController, public navController: NavController,
              public platform: Platform, public translate: TranslateService, private _sanitizer: DomSanitizer,
              public alertController: AlertController) {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.todayDayKey = days[(new Date()).getDay()];

  }

  ngOnInit() {
    if (this.listing && this.listingType) {
      if (this.type == '1') {
        //Buttons (Header)
        this.filteredCustomFields = this.filteredCustomFields.concat(this.listingType.case27_listing_type_result_template.buttons);
        /*this.filteredCustomFields = this.customFields.filter(field =>
          field.show_field && (
            field.show_field == 'work_hours' ||
            field.show_field == 'job_phone' ||
            field.show_field == 'job_email' ||
            field.show_field == 'job_date' ||
            field.show_field == 'price_range' ||
            field.show_field.includes('price')
          )
        );*/
        console.log(this.filteredCustomFields);
      }
      else if (this.type == '2') {
        //Info fields (Under title)
        this.filteredCustomFields = this.filteredCustomFields.concat(this.listingType.case27_listing_type_result_template.info_fields);
        /*this.filteredCustomFields = this.customFields.filter(field =>
          field.show_field && (
            field.show_field == 'work_hours' ||
            field.show_field == 'job_phone' ||
            field.show_field == 'job_email' ||
            field.show_field == 'job_date' ||
            field.show_field == 'price_range' ||
            field.show_field.includes('price')
          )
        );*/
        console.log(this.filteredCustomFields);
      }
      else if (this.type == '3') { //taxonimies in the footer
        if (this.listing.footer && this.listing.footer.sections && this.listing.footer.sections.length > 0)
          this.customTaxonomies = this.customTaxonomies.concat(this.listing.footer.sections && this.listing.footer.sections);
      }
    }
  }

  isWhiteBackground() {
    return GlobalFields.isWhiteBackground();
  }


}


