import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonInfiniteScroll, ModalController, NavController, Platform} from '@ionic/angular';
import {Listing} from '../../app/entities/listing';
import {Filter} from '../../app/entities/filter';
import {GlobalFields} from '../../app/GlobalFields';
import {ListingPage} from '../listingPage/listingPage';
import {FilterModal} from './filterModal/filterModal';
import {Service} from '../services/Service';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {MapModal} from './mapModal/mapModal';
import {TranslateService} from '@ngx-translate/core';
import {LocationService} from '../services/LocationService';
import {Constants} from '../Constants';

@Component({
  selector: 'page-search',
  templateUrl: 'searchPage.html',
  styleUrls: ['searchPage.scss']

})
export class SearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  GlobalFields = GlobalFields;

  filters: Filter;
  loadingMoreData = false;

  oldScollPostion = 0;
  headerClass = '';

  isAndroid: boolean;

  customPopoverOptions: any = {
    header: 'Seleziona l\'ordine',
  };

  constructor(public service: Service, public locationService: LocationService, public modalCtrl: ModalController, public statusBar: StatusBar, public platform: Platform,
              public translate: TranslateService, public alertController: AlertController) {
    if (!GlobalFields.basicSearch && (!GlobalFields.filtersSearch.location && (!GlobalFields.filtersSearch.categories) || GlobalFields.filtersSearch.categories.length == 0)) {
      this.selectListingType(true);
    }
  }

  ngOnInit() {
    if (this.platform.is('ios'))
      this.isAndroid = false;
    else
      this.isAndroid = true;
  }

  ionViewDidEnter() {
    this.service.setWhiteBlackBackgroundStatusBar();
    GlobalFields.basicSearch = false;
  }


  async openModalListing() {

    const modal = await this.modalCtrl.create({
      component: ListingPage,
    });
    return await modal.present();
  }


  async openFilter(listing?: Listing) {

    this.GlobalFields.selectedListing = listing;

    const filterModal = await this.modalCtrl.create({
      component: FilterModal,
    });
    return await filterModal.present();

  }

  async openMap(listing?: Listing) {

    this.GlobalFields.selectedListing = listing;

    const mapModal = await this.modalCtrl.create({
      component: MapModal,
    });
    return await mapModal.present();

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

  loadData() {
    this.loadingMoreData = true;
    GlobalFields.filtersSearch.currentPage++;
    if (GlobalFields.filtersSearch.location) { //address
      GlobalFields.getLatLongFromAddress(this.locationService, GlobalFields.filtersSearch.location);
      this.callServiceToGetFilteredListings();
    } else { //no address
      this.callServiceToGetFilteredListings();
    }
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }


  selectListingType(reloadOrder) {
    this.GlobalFields.filteredListings = undefined;
    const setLocation = GlobalFields.filtersSearch.location;

    this.GlobalFields.clearFilters();
    if (setLocation)
      GlobalFields.filtersSearch.location = setLocation;

    this.GlobalFields.selectListingTypeDetail();
    console.log(this.GlobalFields.selectedTypeDetail);
    if (reloadOrder && this.GlobalFields.selectedTypeDetail.case27_listing_type_search_page.order &&
      this.GlobalFields.selectedTypeDetail.case27_listing_type_search_page.order.options && this.GlobalFields.selectedTypeDetail.case27_listing_type_search_page.order.options.length > 0)
      this.GlobalFields.filtersSearch.order = this.GlobalFields.selectedTypeDetail.case27_listing_type_search_page.order.options[0].key;
    this.GlobalFields.getFilteredListingFirstTime(this.service, this.locationService, true);

  }


  callServiceToGetFilteredListings() {
    this.service.getFilteredListings(true)
      .subscribe((d: any) => {
        let data = d.data ? d.data : d;
        GlobalFields.filtersSearch.countListings = d.count;

        if (GlobalFields.filtersSearch.currentPage == 1) {
          GlobalFields.filteredListings = [];
          GlobalFields.filtersSearch.noMorePage = false;
        }
        GlobalFields.filteredListings = GlobalFields.filteredListings.concat(GlobalFields.fixWrongImgCoverField(data));
        console.log(data);
        this.loadingMoreData = false;

        if (GlobalFields.filteredListings.length < 10 || data.length < 10)
                GlobalFields.filtersSearch.noMorePage = true;

      });
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

  getListType(type: string) {
    if (type == 'alternate')
      return 3; //box with logo
    if (type == 'default')
      return 1; //box
    else
      return 2; //list
  }


  clearFilters() {
    GlobalFields.clearFilters();
    this.selectListingType(true);
  }

}
