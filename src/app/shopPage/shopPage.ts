import {Component} from '@angular/core';
import {Service} from '../services/Service';
import {GlobalFields} from '../GlobalFields';
import {WooCommerceService} from '../services/WooCommerceService';
import {Product} from '../entities/Product';
import {TranslateService} from '@ngx-translate/core';
import {ListingCategory} from '../entities/listingCategory';
import {Listing} from '../entities/listing';


@Component({
  selector: 'page-shop',
  templateUrl: 'shopPage.html',
  styleUrls: ['shopPage.scss']
})
export class ShopPage {

  GlobalFields = GlobalFields;

  products: Product[] = [];
  categories: {
    count?: number; //how many products has
    description?: string;
    id?: number;
    name?: string;
    slug?: string;
    selected?: boolean;
  }[] = [];

  loading = true;
  lastNumber = 20;
  page = 1;

  showFilters = false;

  constructor(private service: Service, private wooCommerceService: WooCommerceService, public translate: TranslateService) {
    this.loadFirstTimeProducts();
    this.loadCategories();
  }


  ionViewDidEnter() {
    this.service.setWhiteBlackBackgroundStatusBar();
  }


  loadCategories(){
    this.wooCommerceService.getAllProductCategories(0).subscribe((res: any[]) => {
      if (res && res.length > 0)
        this.categories = this.categories.concat(res);
    });
  }


  loadFirstTimeProducts(){
    this.page = 0;
    this.products = []
    this.loadMoreProducts();
  }

  loadMoreProducts() {
    this.loading = true;
    //User can add listings, so show packages
    /*if (GlobalFields.isLoggedIn && GlobalFields.userRole.can_add_listings) {
      this.wooCommerceService.getPromotionPackages(this.page).subscribe((res: Product[]) => {
        if (res && res.length > 0) {
          this.products = this.products.concat(res);
          this.lastNumber = res.length;
          this.page = this.page + 1;
        } else
          this.lastNumber = 0;
        this.loading = false;
      });
    }*/
    //User CANNOT add listings, show all products
  //  else {



    const categoriesSelected = [];
    if(this.categories && this.categories.length>0)
      this.categories.forEach(cat =>{
        if (cat.selected)
          categoriesSelected.push(cat.id)
      })

    this.wooCommerceService.getAllProducts(this.page,categoriesSelected).subscribe((res: Product[]) => {
      if (res && res.length > 0) {
        this.products = this.products.concat(res);
        this.lastNumber = res.length;
        this.page = this.page + 1;
      } else
        this.lastNumber = 0;
      this.loading = false;
    });

      // }
  }


}
