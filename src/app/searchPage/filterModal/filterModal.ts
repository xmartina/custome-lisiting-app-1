import {Component} from "@angular/core";
import {GlobalFields} from "../../../app/GlobalFields";
import {CheckboxType} from "../../../app/entities/checkboxType";
import {Service} from '../../services/Service';
import {AlertController, ModalController} from '@ionic/angular';
import {TranslateService} from "@ngx-translate/core";
import {LocationService} from "../../services/LocationService";
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {CacheService} from 'ionic-cache';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';


@Component({
    selector: 'page-filter',
    templateUrl: 'filterModal.html',
    styleUrls: ['filterModal.scss']
})
export class FilterModal {


    GlobalFields = GlobalFields;


    categories: CheckboxType[] = [];
    types: CheckboxType[] = [];
    customFields: string[];

    constructor(public service: Service, public locationService: LocationService, public modalCrtl: ModalController,  public translate: TranslateService, private statusBar: StatusBar,
                public modalCtrl: ModalController, private geolocation: Geolocation,
                private nativeGeocoder: NativeGeocoder, private alertController: AlertController) {

        this.iniFilter();

        this.service.setWhiteBlackBackgroundStatusBar();


        console.log(GlobalFields.filtersSearch.customFieldsText)

    }

    iniFilter(){
        if (!GlobalFields.filtersSearch) {
            this.prepareOptionsTags();
            // this.prepareCustomFieldsDropdown();
        } else {
            GlobalFields.selectListingTypeDetail();
            if (GlobalFields.filtersSearch.tags.length == 0)
                this.prepareOptionsTags();
            /*  if (this.GlobalFields.filtersSearch.customFieldsDropdownKeys.length == 0 ||
                  this.GlobalFields.filtersSearch.customFieldsDropdownKeys.length == 0 ||
                  this.GlobalFields.filtersSearch.customFieldsDropdown.length == 0)
                  this.prepareCustomFieldsDropdown();
                  */

        }
    }


    prepareOptionsTags() {
        this.GlobalFields.selectedTypeDetail.tags.forEach(cat => {
            let c = new CheckboxType();
            c.isChecked = false;
            c.val = cat;
            GlobalFields.filtersSearch.tags.push(c);
            console.log(cat);
        });
    }

    //prepara un array di stringhe per le key dei custom fields dropdown e uno dove ogni elemento è un array di opzioni
    //poi inizializza a [] nella posizione corrispondente
  /*  prepareCustomFieldsDropdown() {
        this.GlobalFields.filtersSearch.customFieldsDropdownKeys = [];
        this.GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions = [];
        this.GlobalFields.filtersSearch.customFieldsDropdown = [];

        this.GlobalFields.selectedTypeDetail.case27_listing_type_search_page.advanced.facets.forEach(filter => {
            if (filter.show_field && filter.show_field != 'job_tags' && filter.show_field != 'job_category' && filter.show_field != 'job_region' && filter.show_field != 'job_title') { //its a custom field
                this.GlobalFields.filtersSearch.customFieldsDropdownKeys.push(filter.show_field);
                let options = [];
                if (this.GlobalFields.selectedTypeDetail.case27_listing_type_fields[filter.show_field].options)
                    for (const key of Object.keys(this.GlobalFields.selectedTypeDetail.case27_listing_type_fields[filter.show_field].options)) {
                        options.push(this.GlobalFields.selectedTypeDetail.case27_listing_type_fields[filter.show_field].options[key]);
                    }
                this.GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions.push(
                    {key: filter.show_field, options: options}
                );
            }
        });
        for (let i = 0; i < this.GlobalFields.filtersSearch.customFieldsDropdownKeys.length; i++) {
            GlobalFields.filtersSearch.customFieldsDropdown.push([]);
        }

        console.log(this.GlobalFields.filtersSearch.customTaxonomiesDropdownKeysOptions);

    }
*/



    getFilteredListingsFirstTime() {
        this.GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    }

    closeModal() {
        this.modalCrtl.dismiss();
    }


    toStringCategories(): string {
        if (!GlobalFields.filtersSearch.categories || GlobalFields.filtersSearch.categories.length == 0)
            return "";
        else if (GlobalFields.filtersSearch.categories.length > 3)
            return GlobalFields.filtersSearch.categories.length + " selected";
        else
            return GlobalFields.filtersSearch.categories.toString();

    }

    toStringRegions(): string {

        if (!GlobalFields.filtersSearch.region)
            return "";
        return GlobalFields.filtersSearch.region;

    }

    toStringTaxonomies(key: string): string {
        let tax = GlobalFields.getCustomTaxonomiesByKey(key);
        if (tax) {
           /* if (!tax.selected || tax.selected.length == 0)
                return "";
            else if (tax.selected.length > 3)
                return tax.selected.length + " selected";
            else {*/
                return tax.selected;
           // }
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


    getMyAddress(){
      this.GlobalFields.getLocation(this.geolocation, this.nativeGeocoder, this.alertController, this.service, this.locationService);
        this.GlobalFields.filtersSearch.location = GlobalFields.address;
    }


    selectListingType(reloadOrder){
        this.GlobalFields.filteredListings = undefined;
        this.GlobalFields.clearFilters();


        this.GlobalFields.selectListingTypeDetail();
        console.log(this.GlobalFields.selectedTypeDetail);
        if (reloadOrder)
            this.GlobalFields.filtersSearch.order = this.GlobalFields.selectedTypeDetail.case27_listing_type_search_page.order.options[0].key;
        if (GlobalFields.filtersSearch.tags.length == 0)
            this.prepareOptionsTags();
        this.GlobalFields.getFilteredListingFirstTime(this.service,this.locationService);

    }




    isSelected(id: any) {
        if (this.GlobalFields.filtersSearch.selectedType == id)
            return ' selectedtypesListHorizontal';
        else
            return '';
    }

    isSelectedGetPrimaryColor(id: any) {
        if (this.GlobalFields.filtersSearch.selectedType == id)
            return this.GlobalFields.getPrimaryColorJson();
        else
            return undefined;
    }


    clearFilters(){
        GlobalFields.clearFilters();
        this.iniFilter();
    }



}
