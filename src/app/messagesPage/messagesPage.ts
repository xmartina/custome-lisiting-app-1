import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, Platform, PopoverController} from '@ionic/angular';
import {Listing} from '../../app/entities/listing';
import {GlobalFields} from '../../app/GlobalFields';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {Service} from '../services/Service';


import 'hammerjs';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {LocationService} from '../services/LocationService';
import {Chat} from '../entities/Chat';
import {Profile} from '../entities/profile';
import {User} from '../entities/user';

@Component({
  selector: 'messagesPage',
  templateUrl: 'messagesPage.html',
  styleUrls: ['messagesPage.scss']

})
export class MessagesPage implements OnInit {
  // @ViewChild('search') searchInput : any;

  chats: Chat;

  loadingChats = true;

  GlobalFields = GlobalFields;

  msgsSelected: Chat;

  search = false;
  searchString;
  waitSearch = false;
  resultSearchListings: User[] = [];


  msgToOwner: { avatar?: string; id: number, name?: string };

  refresher;

  constructor(public service: Service, private _sanitizer: DomSanitizer, public translate: TranslateService,
              private locationService: LocationService, private navController: NavController) {


  }

  ngOnInit() {
    this.initMsg();
  }


  ionViewDidEnter() {
    this.GlobalFields.showTabs = true;

    if (this.GlobalFields.msgToOwner) {
      this.msgToOwner = this.GlobalFields.msgToOwner;
      if (GlobalFields.isLoggedIn)
        this.getMessages(this.msgToOwner);
    }
    this.GlobalFields.msgToOwner = undefined;
    this.GlobalFields.loading = false;

    //this.GlobalFields.msgsSelected = undefined;
    console.log('ionViewDidEnter');

    if (this.GlobalFields.isLoggedIn) {
      this.refresher = setInterval(() => {
        this.getNewChatsInterval();
      }, 3000);
    }

    this.service.setWhiteBlackBackgroundStatusBar();

  }

  ionViewWillLeave() {
    clearInterval(this.refresher);
  }


  initMsg() {

    if (this.GlobalFields.isLoggedIn) {
      this.getChats();
      //this.service.getRecentViewedListing();
      if (this.msgToOwner)
        this.getMessages(this.msgToOwner);
    }
  }

  getChats() {
    this.loadingChats = true;
    this.service.getChats().subscribe((data: any) => {
      this.chats = data;
      this.loadingChats = false;
    }, function (e) {
      this.service.refreshCookie();
    });
  }

  refreshChats(event) {
    this.loadingChats = true;
    this.service.getChats().subscribe((data: any) => {
      this.chats = data;
      this.loadingChats = false;
      event.target.complete();
    });
  }

  getNewChatsInterval() {
    console.log('getNewChatsInterval');
    if (this.GlobalFields.isLoggedIn) {
      this.service.getChats().subscribe((data: any) => {
        this.chats = data;
      });
    }
  }

  getMessages(user?: User) {
    this.msgToOwner = undefined;
    if (user && user.id) {
      //this.GlobalFields.loadingSoft = true;
      this.GlobalFields.senderMsgSelected = user;
      this.GlobalFields.showTabs = false;
      this.navController.navigateForward('tabs/messages/chatPage');
    }
  }

  isWhiteBackgroundBoxShadow(): string {
    if (GlobalFields.isWhiteBackground())
      return '';
    else
      return ' boxShadowList';
  }

  getKeysOfObj(obj) {
    const res = Object.keys(obj);
    if (!res)
      return [];
    return res;
  }


  getBackground(image: string) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  getGoodStringDate(timestamp: number) {
    return new Date(timestamp).toLocaleString();
  }


  searchByName(ev: any) {
    this.searchString = ev.target.value;
  }

  doTheSearch(event?) {

    console.log('Enter called');
    console.log(event);

    let doIt = false;
    if (event && event.key === 'Enter')  // Do stuff}
      doIt = true;
    else if (!event)
      doIt = true;

    if (doIt) {
      this.resultSearchListings = [];

      setTimeout(() => {
        this.waitSearch = false;
        this.loadingChats = true;
        if (!this.waitSearch && this.searchString && this.searchString != '') {
          this.service.getMsgUsersByString(this.searchString)
            .subscribe((data: any) => {
              this.resultSearchListings = data;
              this.loadingChats = false;
            });
          this.waitSearch = true;
        }
      }, 500);
    }
  }

  /*setFocusSearchInput(){
      setTimeout(() => {
          this.searchInput.setFocus();
      }, 500);
  }*/
}
