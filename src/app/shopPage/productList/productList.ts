import {Component, Input} from '@angular/core';
import {Service} from '../../services/Service';
import {GlobalFields} from '../../GlobalFields';
import {Product} from '../../entities/Product';
import {Router} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'productList',
  templateUrl: 'productList.html',
  styleUrls: ['productList.scss']
})
export class ProductList {

  @Input() product?: Product;
  @Input() packages?: boolean;

  GlobalFields = GlobalFields;

  products:Product[] = [];

  constructor(private service: Service,private router: Router,
              public inAppBrowser: InAppBrowser) {
  }

  openPackage(){
    let url = this.product.permalink;
    if(GlobalFields.profile)
      url =  url + '?cla_cookie=' + GlobalFields.profile.cookie;
    const browser = this.inAppBrowser.create(url, '_blank');
  }



}
