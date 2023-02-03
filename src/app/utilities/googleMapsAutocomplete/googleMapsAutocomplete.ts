import {Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {GlobalFields} from '../../../app/GlobalFields';
import {CheckboxType} from '../../../app/entities/checkboxType';
import {Service} from '../../services/Service';
import {TranslateService} from '@ngx-translate/core';
import {LocationService} from '../../services/LocationService';
import {Constants} from '../../Constants';
import {MapsAPILoader} from '@agm/core';
import {
  OpenStreetMapAutocompleteResponse,
  OpenStreetMapAutocompleteResponseProperty
} from '../../entities/OpenStreetMapAutocompleteResponse';


@Component({
  selector: 'googleMapsAutocomplete',
  templateUrl: 'googleMapsAutocomplete.html',
  styleUrls: ['googleMapsAutocomplete.scss']
})
export class GoogleMapsAutocomplete implements OnInit, OnChanges {
  GlobalFields = GlobalFields;
  Constants = Constants;

  @Input() value: string;
  @Input() placeholder: string;
  @Output() addressName = new EventEmitter<string>();

  @ViewChild('googleSearch') searchElementRef: ElementRef;
  googleInput: HTMLInputElement;


  openStreetValue:string;
  resultsOpenStreetMap:OpenStreetMapAutocompleteResponse;

  constructor(public service: Service, public locationService: LocationService, public translate: TranslateService,
              private mapsAPILoader: MapsAPILoader,  private ngZone: NgZone) {

    this.service.setWhiteBlackBackgroundStatusBar();


  }

  ngOnInit() {
    if(GlobalFields.site_details.mapType == 1) //Google Maps
      this.findAddressGoogleMaps();

  }

  ngOnChanges() {
    console.log("OnChange to " + this.value)
    this.loadExistingText();
  }

  ngAfterViewInit(){
    console.log(this.searchElementRef)
    if(this.searchElementRef)
      this.googleInput = this.searchElementRef.nativeElement;
    this.loadExistingText();
  }


  loadExistingText(){
    if(this.value) {
      if(GlobalFields.site_details.mapType == 1) //Google Maps
        console.log(this.googleInput)
      if (this.googleInput)
        this.googleInput.value = this.value;
      else //Open Street Map
        this.openStreetValue = this.value
    }
  }


  cancelText(){
    if(GlobalFields.site_details.mapType == 1) //Google Maps
      if (this.googleInput)
        this.googleInput.value = '';
      else //Open Street Map
        this.openStreetValue = ''
    this.addressName.emit('')
  }

  //https://photon.komoot.io/
  findAddressOpenStreetMaps(q:string){
    this.locationService.getAutocompleteOpenMaps(q).subscribe((data: OpenStreetMapAutocompleteResponse) => {

      this.resultsOpenStreetMap=data;

      if(data && data.features && data.features.length>0 && data.features[0].properties)

        data.features[0].properties.name
      console.log(data);
    })
  }

  selectOpenStreetResult(value: OpenStreetMapAutocompleteResponseProperty){
    this.openStreetValue = ''
    if(value.name)
      this.openStreetValue = value.name;
    if(value.state)
      this.openStreetValue = this.openStreetValue + ', ' + value.state;
    if(value.country)
      this.openStreetValue = this.openStreetValue + ', ' + value.country;

    this.resultsOpenStreetMap = undefined;
    this.addressName.emit(this.openStreetValue);
  }

  findAddressGoogleMaps(){
    this.mapsAPILoader.load().then(() => {
      // @ts-ignore google var works, has not to be imported
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // some details
          let place = autocomplete.getPlace();
          console.log(place)
          if(place.formatted_address)
            this.addressName.emit(place.name + ' ' + place.formatted_address);
          else
            this.addressName.emit(place.name);
          /*this.address = place.formatted_address;
          this.web_site = place.website;
          this.name = place.name;
          this.zip_code = place.address_components[place.address_components.length - 1].long_name;
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          */
        });
      });
    });
  }

}
