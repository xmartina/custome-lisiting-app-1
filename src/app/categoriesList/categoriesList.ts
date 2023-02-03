import {Component, OnInit} from '@angular/core';
import {NavController, Platform, PopoverController} from '@ionic/angular';
import {Listing} from '../../app/entities/listing';
import {GlobalFields} from '../../app/GlobalFields';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {ModalController} from '@ionic/angular';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {LaunchNavigator} from '@ionic-native/launch-navigator/ngx';
import {Service} from '../services/Service';

import {SocialSharing} from '@ionic-native/social-sharing/ngx';


import 'hammerjs';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ListingCategory} from '../entities/listingCategory';
import {LocationService} from '../services/LocationService';
import {ImageAttribute} from 'ionic-image-loader';
import {ListingTypeDetail} from '../entities/listingTypeDetail';

@Component({
  selector: 'categoriesList',
  templateUrl: 'categoriesList.html',
  styleUrls: ['categoriesList.scss']

})
export class CategoriesList implements OnInit{

  GlobalFields = GlobalFields;

  tabShown = 1;

  listOfTypes: ListingTypeDetail[] = [];


  categories_by_type: { type_id: number, type_name: string, categories: ListingCategory[]}[] = [];
  regions_by_type: { type_id: number, type_name: string, regions: ListingCategory[]}[] = [];

  constructor(public service: Service, private _sanitizer: DomSanitizer, public translate: TranslateService,
              private locationService: LocationService, private navController: NavController) {
  }

  ngOnInit(){
    this.getCategoriesForEachType();
    this.getRegionsForEachType();
  }

  ionViewDidEnter() {
    if(GlobalFields.site_details.categoryListTabContent == 1)
      this.tabShown = 1;
    else if(GlobalFields.site_details.categoryListTabContent == 2)
      this.tabShown = 2;
    else
      this.tabShown = 1;
    console.log('ionViewDidEnter');
    this.service.setWhiteBlackBackgroundStatusBar();
  }


  getListingsByCategory(selectedCat: ListingCategory, typeId: any) {
    GlobalFields.clearFilters();

    const category = GlobalFields.listingCategories.find(cat => cat.slug == selectedCat.slug);

    if (category) {
      GlobalFields.filtersSearch.categories = [category.name];
      GlobalFields.filtersSearch.selectedType = typeId;
      // select Listing Type
      this.GlobalFields.selectListingTypeDetail();

      GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
      this.navController.navigateForward('tabs/search');
    }
  }

  getCategoriesForEachType() {
    GlobalFields.listingTypesDetails.forEach(type => {
      //check if regions in in the search filter
      if(type.categories && type.categories.length>0) {
        const cats = type.categories.filter(cat => cat.count)
        this.categories_by_type.push({type_id: type.ID, type_name: type.post_title, categories: cats});
      }
    })
  }

  getRegionsForEachType() {
    GlobalFields.listingTypesDetails.forEach(type => {
      //check if regions in in the search filter
      if (type.case27_listing_type_search_page && type.case27_listing_type_search_page.advanced
        && type.case27_listing_type_search_page.advanced.facets && type.case27_listing_type_search_page.advanced.facets &&
        type.case27_listing_type_search_page.advanced.facets.some(el => el.show_field == 'region')) {
        this.service.getRegionsByType(type.ID).subscribe((data: { success?: boolean, data?: ListingCategory[] }) => {
          if (data.success)
            data.data = data.data.filter(reg=> reg.count)
            this.regions_by_type.push({type_id: type.ID, type_name: type.post_title, regions: data.data});
        });
      }
    });
  }

  getListingsByRegion(selectedReg: ListingCategory, typeId: any) {
    GlobalFields.clearFilters();
    const region = GlobalFields.regions.find(cat => cat.slug == selectedReg.slug);
    if (region) {
      console.log(region)
      GlobalFields.filtersSearch.region = region.name;
      GlobalFields.filtersSearch.selectedType = typeId;
      // select Listing Type
      this.GlobalFields.selectListingTypeDetail();

      GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
      this.navController.navigateForward('tabs/search');
    }
  }


  getBackground(category: any) {
    let image = '';
    //get the category from the categories call
    GlobalFields.listingCategories.forEach(cat => {
      if (cat.id == category.id)
        image = cat.image_url;
    });
    return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient(to top, rgba(23, 23, 23, 0.38), rgba(23, 23, 23, 0.38)), url(${image})`);
  }

  getBackgroundCached(category: any) {
    let image = '';
    //get the category from the categories call
    GlobalFields.listingCategories.forEach(cat => {
      if (cat.id == category.id)
        image = cat.image_url;
    });
    if (!image)
      image = GlobalFields.site_details.placeholderImgUrl;
    return image;
  }

  getBackgroundCachedRegions(reg: ListingCategory) {
    if (reg.image_url)
      return reg.image_url;
    return GlobalFields.site_details.placeholderImgUrl;
  }

  getImgCachedClass(class_to_add: string): ImageAttribute[] {
    let class_name = 'imgCachedAsBackground ' + class_to_add;

    const imageAttributes: ImageAttribute[] = [];
    imageAttributes.push({
      element: 'class',
      value: class_name
    });


    return imageAttributes;
  }

}
