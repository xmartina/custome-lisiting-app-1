import {Component, ElementRef, ViewChild} from '@angular/core';
import {Chat} from '../../entities/Chat';
import {Service} from '../../services/Service';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {LocationService} from '../../services/LocationService';
import {IonContent, NavController} from '@ionic/angular';
import {GlobalFields} from '../../../app/GlobalFields';
import {Router} from '@angular/router';


@Component({
  selector: 'chatPage',
  templateUrl: 'chatPage.html',
  styleUrls: ['chatPage.scss']

})
export class ChatPage {
  @ViewChild('scrollElement') content: IonContent;


  GlobalFields = GlobalFields;

  msgsSelected: Chat;

  msgToSend = '';

  loading = true;
  loadingMsg = false;

  refresher;

  constructor(public service: Service, private _sanitizer: DomSanitizer, public translate: TranslateService,
              private locationService: LocationService, private navController: NavController, private router: Router) {

  }


  ionViewDidEnter() {

    if (this.GlobalFields.senderMsgSelected && this.GlobalFields.senderMsgSelected.id) {
      this.service.getMsgsOfAChat(this.GlobalFields.senderMsgSelected.id).subscribe((data: any) => {
        this.GlobalFields.msgsSelected = data;
        this.loading = false;
        this.resize();
        // this.content.scrollToBottom();

        if (GlobalFields.senderMsgSelected)
          console.log('Mark as seen');
        this.service.markAsSeenChat(GlobalFields.senderMsgSelected.id).subscribe((data: any) => {
        });

        this.refresher = setInterval(() => {
          this.refreshChat();
        }, 2000);
      }, e => {
        this.router.navigateByUrl('tabs/messages');
      });
    } else
      this.router.navigateByUrl('tabs/messages');
  }

  ionViewWillLeave() {
    // this.GlobalFields.msgsSelected = undefined;
    clearInterval(this.refresher);
  }

  getKeysOfObj(obj) {
    const res = Object.keys(obj);
    if (!res)
      return [];
    return res;
  }

  resize() {
    /*const input = document.getElementById('myInput');
    const container = document.getElementById('msgContainer');
    if (input && container) {
        let newHeight = input.scrollHeight > (window.innerHeight / 2) ? Math.round(window.innerHeight / 2) : input.scrollHeight;
        if (!this.msgToSend || this.msgToSend == "")
            newHeight = 35;
        //input.style.height = (newHeight) + 'px';
        container.style.marginBottom = (newHeight + 50) + 'px';
        container.scrollTop = container.scrollHeight;
    }
    this.content.scrollToBottom();
   */
  }

  getGoodStringDate(timestamp: number) {
    return new Date(timestamp).toLocaleString();
  }

  sendMsg() {


    const msg = this.msgToSend;
    this.msgToSend = undefined;

    this.loadingMsg = true;
    //this.content.scrollToBottom();
    this.content.scrollToTop();
    setTimeout(() => {
      this.resize();
      //this.content.scrollToBottom();
      this.content.scrollToTop();
    }, 100);

    if (msg) {
      this.service.sendMsg(msg, GlobalFields.senderMsgSelected.id).subscribe(() => {
        this.loadingMsg = false;
        this.refreshChat(true);
      }), err => {
        console.log(err);
        this.msgToSend = msg;
        this.loadingMsg = false;
      };
    }

  }


  refreshChat(scroll?: boolean) {
    console.log('RefreshChat');
    if (GlobalFields.senderMsgSelected)
      this.service.getMsgsOfAChat(GlobalFields.senderMsgSelected.id).subscribe((data: any) => {
        this.GlobalFields.msgsSelected = data;
        if (scroll) {
          setTimeout(() => {
            this.resize();
            // this.content.scrollToBottom();
          }, 500);

        }
      });
  }
}
