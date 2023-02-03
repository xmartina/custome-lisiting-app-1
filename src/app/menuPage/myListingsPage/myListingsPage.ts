import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {GlobalFields} from "../../GlobalFields";
import {Constants} from "../../Constants";
import {Service} from '../../services/Service';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {Dialogs} from '@ionic-native/dialogs/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import {Profile} from '../../entities/profile';
import {Listing} from '../../entities/listing';
import {Router} from '@angular/router';
import {ModalAddNode} from '../../tabs/modalAdd/modalAdd';

@Component({
    selector: 'myListingsPage',
    templateUrl: 'myListingsPage.html',
    styleUrls: ['myListingsPage.scss']
})
export class MyListingsPage {

    GlobalFields = GlobalFields;
    Constants = Constants;

    currentUserInfo: Profile;

    myListings: Listing[];

    listingToEdit: Listing;

    selectedTab = 1;

    currentPage = 1;
    loadingSection = false;
    loadingMoreData = false;
    noMoreMyListings = false;


    are_you_sure: string;
    you_are_deleting: string;
    cancel: string;
    yes: string;

    success_msg: string;
    success_delete_msg: string;
    close_msg: string;


    constructor(private service: Service,  public translate: TranslateService,  public navController: NavController,
                private dialogs: Dialogs, private platform: Platform, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder,
                private alertController: AlertController, private router: Router, private modalCtrl: ModalController) {

        this.translate.get('ARE_YOU_SURE').subscribe((msg: string) => {
            this.are_you_sure = msg;
        });
        this.translate.get('ARE_YOU_SURE_DELETING').subscribe((msg: string) => {
            this.you_are_deleting = msg;
        });
        this.translate.get('ALERT_YES').subscribe((msg: string) => {
            this.yes = msg;
        });
        this.translate.get('CANCEL').subscribe((msg: string) => {
            this.cancel = msg;
        });
        this.translate.get('SUCCESS_MSG').subscribe((msg: string) => {
            this.success_msg = msg;
        });
        this.translate.get('SUCCESS_DELETE_MSG').subscribe((msg: string) => {
            this.success_delete_msg = msg;
        });
        this.translate.get('ALERT_CLOSE').subscribe((msg: string) => {
            this.close_msg = msg;
        });

    }

    ionViewDidEnter() {
        this.service.setWhiteBlackBackgroundStatusBar();

        if (GlobalFields.isLoggedIn) {
            this.getMyListings();
            this.getCurrentUserInfo();
        }else{
            this.router.navigateByUrl('tabs/menuPage');
        }

    }


    getMyListings() {

        if (GlobalFields.isLoggedIn) {
            this.loadingMoreData = true;
            this.service.getMyListings(this.currentPage).subscribe((data: any) => {
                if (!this.myListings || this.currentPage==1)
                    this.myListings = [];
                this.myListings = this.myListings.concat(data);
                if (data && data.length<20)
                    this.noMoreMyListings = true;
                this.loadingMoreData = false;
            }, err => {
                this.service.refreshCookie();
            });
        }
    }


    loadMoreMyListings() {
        this.loadingMoreData = true;
        this.currentPage++;
        this.getMyListings();

    }



    getCurrentUserInfo() {
        if (GlobalFields.isLoggedIn) {
            this.loadingSection = true;
            this.service.getCurrentUserInfo().subscribe((data: any) => {
                this.currentUserInfo = data;
                this.loadingSection = false;
            }, err => {
                this.service.refreshCookie();
            });
        }
    }


    editListing(listing: Listing){

        this.GlobalFields.loadingSoft = true;

        this.service.getMyListingDetailsById(listing.id).subscribe( (data: Listing) =>{
            if (data){
                this.GlobalFields.listingToEdit = data;
                this.openAddModal();
                this.GlobalFields.loadingSoft = false;
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



    async deleteListing(listing: Listing){

        const name = (listing && listing.title && listing.title.rendered)? listing.title.rendered : "";
        const id = (listing && listing.id)? listing.id : undefined;


        const alert = await this.alertController.create({
            header: this.are_you_sure,
            message: this.you_are_deleting + ' <strong>' + name + '</strong>',
            buttons: [
                {
                    text: this.cancel,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: this.yes,
                    handler: () => {
                        this.GlobalFields.loadingSoft = true;
                        this.service.deleteListing(listing.id).subscribe( (data: Listing) =>{

                            this.GlobalFields.openSuccessAlert(this.alertController, this.success_msg, this.success_delete_msg, "", this.close_msg);
                            this.GlobalFields.loadingSoft = false;
                            this.currentPage = 1;
                            this.service.clearAllCache();
                            this.getMyListings();
                        }, error => {
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
                }
            ]
        });

        await alert.present();
    }


    async openAddModal() {

        console.log(this.listingToEdit);
        const modal = await this.modalCtrl.create({
            component: ModalAddNode,
            componentProps: {a: undefined}
        });
        return await modal.present();
    }

}
