import {Injectable} from '@angular/core';
import {Constants} from "../Constants";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";

import {Listing} from "../entities/listing";
import {GlobalFields} from "../GlobalFields";
import {CacheService} from "ionic-cache";


@Injectable({
    providedIn: 'root'
})

export class LocationService {

    selectedListing: Listing;

    GlobalFields: GlobalFields;

    constructor(private http: HttpClient, private cache: CacheService) {
    }


    getMyAddressFromGoogle(lat: any, long: any) {
        return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=" + Constants.GoogleMapsKEY);
    }

    getMyLatLongFromGoogle(address: any): Observable<any> {
        return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + Constants.GoogleMapsKEY);
    }

    getAddressFromOpenMaps(lat: any, long: any): Observable<any> {
        return this.http.get("https://nominatim.openstreetmap.org/reverse.php?format=json&lat=" + lat + "&lon=" + long);
    }

    getLatLongFromOpenMaps(address: string): Observable<any> {
        let addr = address.replace(' ', '+');
        console.log(address);
        console.log(addr);

        let headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept-Language');
        headers.append('Accept','application/json');
        headers.append('content-type','application/json');

        return this.http.get("https://nominatim.openstreetmap.org/search?q=" + addr + '&format=json&polygon=1&addressdetails=1',{ headers:headers} );

    }

    getAutocompleteOpenMaps(q: string){
      return this.http.get("https://photon.komoot.io/api/?q=" + q);

    }
}
