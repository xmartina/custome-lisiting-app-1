import {Component} from "@angular/core";
import {GlobalFields} from "../../../app/GlobalFields";
import {Service} from '../../services/Service';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {Listing} from "../../entities/listing";
import {ListingPage} from "../../listingPage/listingPage";
import {FilterModal} from "../filterModal/filterModal";
import {LocationService} from "../../services/LocationService";
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {Map, tileLayer, marker, Marker, icon, divIcon} from 'leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';

//import * as L from 'leaflet';


/*import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    GoogleMapOptions,
    Marker,
    Environment
} from '@ionic-native/google-maps/ngx';
*/

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    listing?: Listing;
    iconUrl?:  { url: string,labelOrigin:{x:number ,y:number},  scaledSize: {height: number, width: number}};
    iconNameHtml: string,
    iconImgUrlHtml: string,
    labelOptions?: {
        color: string,
        fontFamily: string,
        fontSize: string,
        fontWeight: string,
        text: string
    };
}

@Component({
    selector: 'map-filter',
    templateUrl: 'mapModal.html',
    styleUrls: ['mapModal.scss']
})
export class MapModal {



    // slides: https://docs.google.com/presentation/d/e/2PACX-1vScoho1ensbR4qCI9AIuQN55BZVvK73pAjI7sumDvW3CrxxHnrmpXWUjx2-8CpFibqU1EjLKCRhuthJ/pub?start=false&loop=false&delayms=3000&slide=id.g291e604610_0_6

    GlobalFields = GlobalFields;
   // map: GoogleMap;

    osMap: Map; //Open Street Map
    selectedListing : Listing = undefined;

    myLat: number = 51.673858;
    myLng: number = 7.815982;

    public origin: any;
    public destination: any;

    loadingMoreData = false;

    currentZoom = 11;

    showSelected = false;

    loading = true;

    allListings : Listing[] = [];

    positions: marker[] = [];


    constructor(public service: Service, public modalCtrl: ModalController, public locationService: LocationService, private statusBar: StatusBar,
                public alertController: AlertController, public plt: Platform) {

        //this.service.setTransparentBackgroundStatusBar();
    }

    ionViewDidEnter() {
        //show only listings in the result
        if(!this.GlobalFields.site_details.showMapAllListings) {
            this.getPositions();
            this.iniMaps();
        }
        else //show all the listings
            this.getAllListings();
    }


    iniMaps(){
        if (GlobalFields.site_details.mapType == 2) // Open Street Maps
            this.getPositionsOSMaps();
        else if (GlobalFields.site_details.mapType == 1) // Google Maps
            this.loading = false;
    }


    closeModal() {
        this.modalCtrl.dismiss();
    }


    getPositions(){
        this.loading = true;
        this.positions = [];
        this.myLat = 0;
        this.myLng = 0;
        console.log("get positions");

        let listings = [];
        if(!this.GlobalFields.site_details.showMapAllListings)
            listings = GlobalFields.filteredListings;
        else
        listings = this.allListings;


        listings.forEach(listing =>{
            if (!isNaN(parseFloat(listing.listing_data.geolocation_lat)) && !isNaN(parseFloat(listing.listing_data.geolocation_long))){
                this.loading = true;


                //Custom HTML icon

                const typeDetail = GlobalFields.listingTypesDetails.find(res => res.post_name == listing.listing_data._case27_listing_type);
                let iconName = typeDetail ? typeDetail.icon : "";

                this.positions.push({
                    lat: parseFloat(listing.listing_data.geolocation_lat),
                    lng: parseFloat(listing.listing_data.geolocation_long),
                    label: listing.title.rendered,
                    draggable: false,
                    listing: listing,
                    iconUrl: this.getMarkerIcon(listing),
                    iconNameHtml: iconName,
                    iconImgUrlHtml: this.getListingImg(listing),
                    labelOptions: {
                        color: 'white',
                        fontFamily: 'roboto',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        text: " "
                    }
                });
            }
        });




        //center of the map as mean lat and mean long of the results
        this.myLat = this.getMeanLat();
        this.myLng = this.getMeanLng();
        if (this.myLat == 0 && this.myLat == 0 && GlobalFields.lat && GlobalFields.lat){
            this.myLat = GlobalFields.lat;
            this.myLng = GlobalFields.lat;
        }


        if (!this.GlobalFields.filtersSearch.location)
            this.currentZoom = 6;

        console.log( this.myLat +" " +  this.myLng);

    }



    getPositionsOSMaps(){
        this.loading = true;

        console.log(this.currentZoom)
        console.log(this.GlobalFields.filtersSearch.location)

        this.osMap = new Map('map').setView([this.myLng, this.myLat], this.currentZoom);

        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"  target="_blank">OpenStreetMap</a> contributors'
        }).addTo(this.osMap);


        const customMarkerIcon = icon({
            iconUrl: '../../assets/imgs/placeholder_location.png',
            iconSize: [64, 64],
            popupAnchor: [0, -20]
        });



        let makerToOpen;


        let markers : any = new L.MarkerClusterGroup();


        for (let i = 0; i<this.positions.length; i++){
            const pos = this.positions[i];

            const html = '<div class="imgMapPin" style="background-image: url(' + pos.iconImgUrlHtml +')"><i class="iconMapPin ' + pos.iconNameHtml + '" style="background-color:' + this.GlobalFields.site_details.primaryColor +' "></i></div>';


            //Custom icon
            let defaultIcon = divIcon({
                iconUrl: '../../../assets/imgs/maps/marker-icon.png',
                shadowUrl: '../../../assets/imgs/maps/marker-shadow.png',
                html: html

            });

            //Marker.prototype.options.icon = defaultIcon; //Set all the pins as equal

            const m = marker([pos.lat, pos.lng], {icon: defaultIcon});
            m.bindPopup(`<b>${pos.label}</b><br><span class="listingLocation">${pos.listing.listing_data._job_location}</span>`, { autoClose: false })
                .on('click', () => this.clickedMarker(pos))
                .on( 'popupclose', () => this.showSelected = false);

           // if(!this.GlobalFields.site_details.showMapAllListings)
           //     m.addTo(this.osMap);
           // else
                markers.addLayer(m);

            if (i==0)
                makerToOpen = m;


        }

       // if(this.GlobalFields.site_details.showMapAllListings)
            this.osMap.addLayer(markers);


        //this.osMap.setView([this.myLng, this.myLat], this.currentZoom);

        this.osMap.panTo([this.myLat, this.myLng]);

        //this.osMap.openPopup(makerToOpen.getPopup());

        setTimeout(()=>{
            this.loading = false;
          //  this.osMap.panTo((new L.LatLng(this.myLat, this.myLng)));
        },1000)




    }


    getMeanLat() :number{
        let lat = 0;
        this.positions.forEach(mark =>{
            lat = lat + mark.lat;
        });
        if (this.positions.length>0)
            return lat / this.positions.length;
        return lat;
    }
    getMeanLng() :number{
        let lng = 0;
        this.positions.forEach(mark =>{
            lng = lng + mark.lng;
        });
        if (this.positions.length>0)
            return lng / this.positions.length;
        return lng;
    }

    clickedMarker(marker: marker) {

        this.selectedListing = marker.listing;
        this.showSelected = true;

        console.log(marker.listing);
    }


    getMarkerIcon(listing: Listing){
        let imgUrl = "";

        if (this.GlobalFields.site_details.placeholderLocationImgUrl && this.GlobalFields.site_details.placeholderLocationImgUrl!="")
            imgUrl = this.GlobalFields.site_details.placeholderLocationImgUrl;
        else {
            if (listing.listing_data._job_logo)
                imgUrl = listing.listing_data._job_logo;
            else
                imgUrl = "../../assets/imgs/placeholder_location.png";
        }

        let res = {
            url: imgUrl,
            labelOrigin:{x:22.5,y:20},
            scaledSize: this.getImgSize(imgUrl)};

        return res;

    }

    getImgSize(url: string): any {
        let res : {height: number; width: number} = {height: 40, width: 40};
        let img = new Image();
        img.src = url;
        if (Number(img.height) >= 40 && Number(img.width) >= 40) {
            if (Number(img.height) > Number(img.width))
                res = {height: 40, width: 40 * (Number(img.width) / Number(img.height))};
            else if (Number(img.width) > Number(img.height))
                res = {width: 40, height:  40 * (Number(img.height) / Number(img.width))}
        } else {
            res = {width: Number(img.width), height: Number(img.height)};
        }
        if (res.height == 0 || res.width == 0)
            res = {height: 40, width: 40};
        return res;
    }

    getImgWidth(url: string): any {
        var img = new Image();
        img.src = url;
        if (Number(img.height) < 260) {
            return 'auto'
        } else {
            return '100%'
        }

    }


    getListingDetails(listing: Listing) {

        this.GlobalFields.loadingSoft = true;
        this.service.getListingDetailsById(listing.id).subscribe( (data: Listing) =>{
            if (data){
                this.GlobalFields.selectedListing = data;
                this.openModalListing();
            }}, error => {
                console.log(error);
                let msg = "";
                if (error && error.error)
                    msg = error.error.message;
                else if (error)
                    msg = error.message;
                this.GlobalFields.openAlert(this.alertController, "Error", "Error on web server", msg);
                this.GlobalFields.loadingSoft = false;
        });
    }

    async openModalListing() {

        const modal = await this.modalCtrl.create({
            component: ListingPage,
        });
        return await modal.present();
    }

    async openFilter(listing: Listing) {

        this.GlobalFields.selectedListing = listing;

        const filterModal = await this.modalCtrl.create({
            component: FilterModal,
        });
        return await filterModal.present();

    }


    goToMyLocation(){
        if (this.GlobalFields.lat && this.GlobalFields.long) {
            this.loading = true;
            this.myLat = this.GlobalFields.lat;
            this.myLng = this.GlobalFields.long;
            this.currentZoom = 12;
            this.loading = false;
            console.log("goToMyLocation")
        }
    }

    centerChanged(event:any){
        //console.log(event);
      /*  this.myLat = event.myLat;
        this.myLng = event.myLng;
        */
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




    callServiceToGetFilteredListings(){
        this.service.getFilteredListings()
            .subscribe((data: any) => {
                if (GlobalFields.filtersSearch.currentPage == 1) {
                    GlobalFields.filteredListings = [];
                    GlobalFields.filtersSearch.noMorePage = false;
                }
                GlobalFields.filteredListings = GlobalFields.filteredListings.concat(GlobalFields.fixWrongImgCoverField(data));
                console.log(data);
                this.getPositions();
                this.loadingMoreData = false;

                if ( GlobalFields.filteredListings.length < 10 || data.length == 0)
                    GlobalFields.filtersSearch.noMorePage = true;

            });
    }

    getAllListings(){
        this.service.getAllListings()
            .subscribe((res: any) => {
                if (res.success) {
                    this.allListings = GlobalFields.fixWrongImgCoverField(res.data);
                    this.getPositions();
                    this.iniMaps();
                }
            });
    }

    getListingImg(listing: Listing) {
        let image = '';

        if (listing.img_cover)
            image = listing.img_cover;
        if (!listing.img_cover && listing.listing_data && listing.listing_data._job_cover)
            image = listing.listing_data._job_cover;
        else if (!listing.img_cover && listing.listing_data && !listing.listing_data._job_cover)
            image = GlobalFields.site_details.placeholderImgUrl;
        return image;
    }


}
