import {Component} from '@angular/core';

import {GlobalFields} from '../GlobalFields';
import {MenuController, ModalController} from '@ionic/angular';
import {ModalAddNode} from '../tabs/modalAdd/modalAdd';
import {Router, RouterEvent} from '@angular/router';
import {AppVersion} from '@ionic-native/app-version/ngx';


@Component({
  selector: 'app-sideMenu',
  templateUrl: 'sideMenu.html',
  styleUrls: ['sideMenu.scss']

})
export class SideMenu {

  GlobalFields = GlobalFields;

  selectedPath = '';

  appName = '';


  constructor(private modalCtrl: ModalController, private router: Router, public appVersion: AppVersion, private menu: MenuController) {
    this.selectedPath = this.router.url;
    this.router.events.subscribe((event: RouterEvent) => {
      if(event && event.url){
        this.selectedPath = event.url;
      }
    });

    appVersion.getAppName().then(value => {
      console.log("Getting the app name")
      console.log(value)
      this.appName = value;
    }).catch(err => {
      this.appName = "";
    });
  }

  getStyleSelectedTab(path:string) {
    if (path == 'home') { //To avoid highlighting it if posts page is opened
      if (this.selectedPath.includes('home/posts'))
        return {};
      else {
        if (this.selectedPath.includes(path))
          return {'color': this.GlobalFields.site_details.primaryColor, 'border-bottom': 'solid 2px'};
      }
    }
    if (path == 'menuPage') { //To avoid highlighting it if posts page is opened
      if (this.selectedPath.includes('settings'))
        return {};
      else {
        if (this.selectedPath.includes(path))
          return {'color': this.GlobalFields.site_details.primaryColor, 'border-bottom': 'solid 2px'};
      }
    }
    else if (this.selectedPath.includes(path))
        return {'color': this.GlobalFields.site_details.primaryColor, 'border-bottom': 'solid 2px'};
  }


  async openAddModal() {
    const profileModal = await this.modalCtrl.create({
      component: ModalAddNode,
      componentProps: {userId: 8675309}
    });
    return await profileModal.present();
  }

  closeSidebar(){
    this.menu.close('appMenu');
  }

}
