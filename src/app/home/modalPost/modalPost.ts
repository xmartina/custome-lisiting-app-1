import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Post} from '../../../app/entities/post';
import {Constants} from '../../../app/Constants';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {GlobalFields} from '../../GlobalFields';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';




@Component({
    selector: 'modalPost',
    templateUrl: 'modalPost.html',
    styleUrls: ['modalPost.scss']
})
export class ModalPost {
    @ViewChild('dynamic') dynamic: ElementRef;

    @Input() post: Post;

    Constants = Constants;
    GlobalFields = GlobalFields;

    constructor(public viewCtrl: ModalController, inputData: NavParams, private socialSharing: SocialSharing,
                private inAppBrowser: InAppBrowser) {

        this.post = inputData.data.post as Post;
        console.log(this.post);

        setTimeout(() => {

            let el = this.dynamic.nativeElement as HTMLElement;

            let arrayOfLinks = el.querySelectorAll('a');
            for (let i = 0; i < arrayOfLinks.length; i++) {
                let anchor = arrayOfLinks[i];
                anchor.onclick = (ev) => {
                    console.log("Opening link")
                    const browser = this.inAppBrowser.create(anchor.href, '_blank');
                    ev.preventDefault();
                    return false;
                };
            };
        }, 1000);

        //this.service.setTransparentBackgroundStatusBar();

    }


    closeModal() {
        this.viewCtrl.dismiss();
    }


    share(){

        this.socialSharing.share("Check this link", "", "", this.post.link).then(function() {
            console.log('Successful share');
        }).catch(function(error) {
            console.log('Error sharing:', error)
        });
    }


}


