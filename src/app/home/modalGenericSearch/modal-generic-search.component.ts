import {Component} from '@angular/core';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {Constants} from '../../../app/Constants';

import {GlobalFields} from '../../GlobalFields';
import {Service} from '../../services/Service';
import {LocationService} from '../../services/LocationService';
import {EntityGeneralSearchResult, GeneralSearchResult} from '../../entities/generalSearchResult';
import {ImageAttribute} from 'ionic-image-loader';
import {Listing} from '../../entities/listing';
import {ListingPage} from '../../listingPage/listingPage';
import {ListingCategory} from '../../entities/listingCategory';
import {CheckboxType} from '../../entities/checkboxType';


@Component({
  selector: 'modalGenericSearch',
  templateUrl: 'modal-generic-search.component.html',
  styleUrls: ['modal-generic-search.component.scss']
})
export class ModalGenericSearch {

  Constants = Constants;
  GlobalFields = GlobalFields;

  searchQuery: string;

  loading = false;

  results: GeneralSearchResult;

  constructor(public viewCtrl: ModalController, private service: Service, public navController: NavController,
              public locationService: LocationService, public alertController: AlertController) {

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


  generalSearch() {

    this.loading = true;
    this.service.getGeneralSearch(this.searchQuery).subscribe((res: any) => {
      if (res && res.success) {
        this.results = res.data;

        //Get the icons for Tags
        if(this.results && this.results.tags.length>0)
          this.results.tags.forEach(tag => {
            const t2 = this.GlobalFields.listingTags.find( t => t.term_id==tag.id);
            if (t2)
              tag.icon = t2.icon
            else
              tag.icon = 'fas fa-hashtag';
          })
        //Get the icons for Categories
        if(this.results && this.results.categories.length>0)
          this.results.categories.forEach(cat => {
            const c2 = this.GlobalFields.listingCategories.find( c => c.id==cat.id);
            if (c2)
              cat.icon = c2.icon
            else
              cat.icon = 'fas fa-bookmark';
          })
        //Get the icons for Regions
        if(this.results && this.results.regions.length>0)
          this.results.regions.forEach(reg => {
            const r2 = this.GlobalFields.regions.find( r => r.id==reg.id);
            if (r2)
              reg.icon = r2.icon
            else
              reg.icon = 'fas fa-globe';
          })


        this.loading = false;
      }
    }, err => {
      this.results = undefined;
    });
  }

  searchNearMe(id: any) {
    this.closeModal();
    console.log(this.GlobalFields.address);
    GlobalFields.clearFilters();

    GlobalFields.filtersSearch.selectedType = id;
    this.GlobalFields.selectListingTypeDetail();
    this.GlobalFields.filtersSearch.location = this.GlobalFields.address;
    // set default value to the proximity range
    this.GlobalFields.filtersSearch.range = GlobalFields.getDefaultProximity('basic');
    this.GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    this.navController.navigateForward('tabs/search');
  }

  searchByType(id: any) {
    this.closeModal();
    GlobalFields.clearFilters();
    GlobalFields.filtersSearch.selectedType = id;
    this.GlobalFields.selectListingTypeDetail();
    GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    this.navController.navigateForward('tabs/search');
  }

  getListingDetails(listing) {
    console.log('getListingDetails');
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
    console.log('openModalListing');

    const listingModal = await this.viewCtrl.create({
      component: ListingPage,
    });
    return await listingModal.present();

    //  this.navCtrl.push(ListingPage);

  }

  getListingsByCategory(catName: string, typeId: any) {
    GlobalFields.clearFilters();

    GlobalFields.filtersSearch.categories = [catName];
    GlobalFields.filtersSearch.selectedType = typeId;
    // select Listing Type
    this.GlobalFields.selectListingTypeDetail();

    this.closeModal();

    GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    this.navController.navigateForward('tabs/search');
  }

  getListingsByTag(selTag: EntityGeneralSearchResult, typeId: any) {
    GlobalFields.clearFilters();

    GlobalFields.filtersSearch.selectedType = typeId;
    // select Listing Type
    this.GlobalFields.selectListingTypeDetail();

    //prepareOptionsTags
    this.GlobalFields.selectedTypeDetail.tags.forEach(tag => {
      let c = new CheckboxType();
      c.isChecked = tag.id == selTag.id;
      c.val = tag;
      GlobalFields.filtersSearch.tags.push(c);
    });


    this.closeModal();

    GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    this.navController.navigateForward('tabs/search');
  }


  getListingsByRegion(regName: string, typeId: any) {
    GlobalFields.clearFilters();

    GlobalFields.filtersSearch.region = regName;
    GlobalFields.filtersSearch.selectedType = typeId;
    // select Listing Type
    this.GlobalFields.selectListingTypeDetail();

    this.closeModal();

    GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);
    this.navController.navigateForward('tabs/search');
  }


  closeModal() {
    this.viewCtrl.dismiss();
  }

}


