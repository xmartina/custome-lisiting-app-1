import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Service} from '../../services/Service';
import {GlobalFields} from '../../GlobalFields';
import {Listing} from '../../entities/listing';
import {ListingPage} from '../../listingPage/listingPage';



@Component({
  selector: 'popover-search',
  templateUrl: 'popoverSearch.html'
})

export class PopoverSearch {

  GlobalFields = GlobalFields;

  constructor(public popoverController:  ModalController, public service: Service) {
  }


  /*openModalListing(listing: Listing) {

    this.service.selectedListing = listing;

    const listingModal = this.popoverController.create(ListingPage);
    listingModal.present();

  }
*/
    async openModalListing(listing: Listing) {
        this.GlobalFields.selectedListing = listing;

        const modal = await this.popoverController.create({
            component: ListingPage,
            componentProps: { value: 123 }
        });
        return await modal.present();
    }

  closePopover(){
    this.popoverController.dismiss();
  }
}
