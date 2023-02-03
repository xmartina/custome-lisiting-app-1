import {Component} from '@angular/core';
import {Service} from '../../services/Service';
import {GlobalFields} from '../../GlobalFields';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-order',
  templateUrl: 'orderPage.html',
  styleUrls: ['orderPage.scss']
})
export class OrderPage {

  GlobalFields = GlobalFields;

  secureUrl;


  constructor(private service: Service, private sanitizer:DomSanitizer) {
    this.secureUrl = this.getSecurePageURL();
  }


  ionViewDidEnter() {
    this.service.setWhiteBlackBackgroundStatusBar();
    this.GlobalFields.selectedProduct
  }


  getSecurePageURL() {
    let url = this.GlobalFields.selectedOrderUrl;
    this.GlobalFields.selectedOrderUrl = undefined;

    if (!url.includes("https")){
      url.replace("http", "https")
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url + '?cookie=' + GlobalFields.profile.cookie);
  }


}
