import {Injectable} from '@angular/core';
import {Constants} from '../Constants';
import {HttpClient} from '@angular/common/http';
import {GlobalFields} from '../GlobalFields';


@Injectable({
  providedIn: 'root'
})

export class WooCommerceService {

  GlobalFields: GlobalFields;
  Constants: Constants;

  prefix = '/wp-json/wc/v3/'


  //API DOC: https://woocommerce.github.io/woocommerce-rest-api-docs
  constructor(private http: HttpClient) {}


  getAllProductCategories(page?: number) {

    let url = Constants.url + this.prefix + 'products/categories?consumer_key=' + Constants.ConsumerKeyWoo + '&consumer_secret=' + Constants.ConsumerSecretWoo;
    page = page? page : 1;
    url = url + '&per_page=100&page=' + page;
    let cacheKey = url;

    return this.http.get(url);
  }

  getAllProducts(page?: number, categoriesSelected?:number[]) {
    let url = Constants.url + this.prefix + 'products?consumer_key=' + Constants.ConsumerKeyWoo + '&consumer_secret=' + Constants.ConsumerSecretWoo;
    page = page? page : 1;
    url = url + '&per_page=20&page=' + page;
    url = url + '&status=publish';
    if(categoriesSelected && categoriesSelected.length>0)
      categoriesSelected.forEach(cat =>{
        url = url + '&category=' + cat;
      })
    let cacheKey = url;

    return this.http.get(url);
  }

  getPromotionPackages(page?: number) {
    let url = Constants.url + this.prefix + 'products?consumer_key=' + Constants.ConsumerKeyWoo + '&consumer_secret=' + Constants.ConsumerSecretWoo + '&type=job_package&status=publish';
    page = page? page : 1;
    url = url + '&per_page=20&page=' + page;
    let cacheKey = url;

    return this.http.get(url);
  }

  getProductsByIds(ids?: number[]) {
    let url = Constants.url + this.prefix + 'products?consumer_key=' + Constants.ConsumerKeyWoo + '&consumer_secret=' + Constants.ConsumerSecretWoo;
    url = url + '&per_page=20';
    if(ids && ids.length>0){
      ids.forEach((el) =>{
        url = url + '&include[]=' + el;
      })
    }
    let cacheKey = url;
    return this.http.get(url);
  }
}
