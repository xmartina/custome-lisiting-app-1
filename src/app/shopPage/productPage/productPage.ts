import {Component} from '@angular/core';
import {Service} from '../../services/Service';
import {GlobalFields} from '../../GlobalFields';
import {WooCommerceService} from '../../services/WooCommerceService';
import {Product} from '../../entities/Product';
import {Router} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'page-product',
  templateUrl: 'productPage.html',
  styleUrls: ['productPage.scss']
})
export class ProductPage {

  GlobalFields = GlobalFields;

  products:Product[] = [];

  constructor(private service: Service,private router: Router,
              public inAppBrowser: InAppBrowser) {
  }


  ionViewDidEnter() {
   if(!GlobalFields.selectedProduct)
     this.router.navigateByUrl('/tabs/shop');
    this.service.setWhiteBlackBackgroundStatusBar();
  }

  goToOrder(){
   // this.router.navigate(['tabs/shop/order'])
    let url = GlobalFields.selectedProduct.permalink;
    if(GlobalFields.profile)
      url =  url + '?cla_cookie=' + GlobalFields.profile.cookie;
    const browser = this.inAppBrowser.create(url, '_blank');

  }


}
