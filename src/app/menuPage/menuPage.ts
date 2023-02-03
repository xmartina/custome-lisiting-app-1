import {Component} from '@angular/core';
import {Service} from '../services/Service';
import {TranslateService} from '@ngx-translate/core';
import {GlobalFields} from '../GlobalFields';
import {NavController} from '@ionic/angular';
import {Constants} from '../Constants';


@Component({
    selector: 'menuPage',
    templateUrl: 'menuPage.html',
    styleUrls: ['menuPage.scss']
})
export class MenuPage {

    GlobalFields = GlobalFields;
    Constants = Constants;
    errorMgs: string = '';
    selectedMenu = 1;

    oldScollPostion = 0;
    headerClass = '';


    constructor(private service: Service, public translate: TranslateService, public navController: NavController){

    }

    ionViewDidEnter() {
        console.log('ionViewDidEnter');
        this.service.getRecentViewedListing();
        this.service.setWhiteBlackBackgroundStatusBar();
    }


    loginComplete(finished) {
        if (finished) { //Login ok
            this.errorMgs = '';
        }
    }

    logout() {
        this.service.logout();
    }


    isSelected(id: any) {
        if (this.selectedMenu == id)
            return ' selectedtypesListHorizontal primary';
        else
            return '';
    }


    isSelectedGetPrimaryColor(id: any) {
        if (this.selectedMenu == id)
            return this.GlobalFields.getPrimaryColorJson();
        else
            return undefined;
    }




    onScrollHideHeader(event: CustomEvent) {
        // console.log(event);
        if (event.detail.scrollTop > 50 && !this.isElementInViewPort()) {
            if (this.oldScollPostion < event.detail.scrollTop)
                this.headerClass = 'headerHidden';
            if (this.oldScollPostion > event.detail.scrollTop)
                this.headerClass = 'headerShown';
        }
        this.oldScollPostion = event.detail.scrollTop;
    }

    //This function just check if element is fully in vertical viewport or not
    isElementInViewPort() {
        let el = document.getElementById('check-point');
        if (el) {
            const rect = el.getBoundingClientRect();
            return rect.bottom <= window.innerHeight;
        }
        return true;
    }





}
