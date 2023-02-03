import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Service} from '../../services/Service';
import {TranslateService} from '@ngx-translate/core';
import {GlobalFields} from '../../GlobalFields';
import {NavController} from '@ionic/angular';
import {Listing} from '../../entities/listing';
import {Profile} from '../../entities/profile';
import {Constants} from '../../Constants';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {OneSignal} from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'loginComponent',
  templateUrl: 'loginComponent.html',
  styleUrls: ['loginComponent.scss']
})
export class LoginComponent {

  GlobalFields = GlobalFields;
  Constants = Constants;
  errorMgs: string = '';
  successMsg = false;

  @Output() loginComplete = new EventEmitter<boolean>();

  tabToShown = 0;
  bookmarkedListings: Listing[];


  constructor(private service: Service, public translate: TranslateService, public navController: NavController, public inAppBrowser: InAppBrowser,
              private googlePlus: GooglePlus, private fb: Facebook, private oneSignal: OneSignal) {
  }

  ionViewDidEnter() {
    if (!GlobalFields.site_details.socialLoginGoogleEnabled && !GlobalFields.site_details.socialLoginFacebookEnabled) {
      this.tabToShown = 1;
    }
  }


  login() {
    this.errorMgs = undefined;
    this.GlobalFields.loadingSoft = true;
    this.service.getNonce().subscribe((data: string) => {
      if (data) {
        this.GlobalFields.nonce = JSON.parse(data).nonce;
        this.service.login(this.GlobalFields.username, this.GlobalFields.password, this.GlobalFields.nonce).subscribe((data: any) => {
          this.storeProfileDoLogin(data);
          this.GlobalFields.loadingSoft = false;
        }, err => {
          this.GlobalFields.loadingSoft = false;
          console.log(err.error);
          this.GlobalFields.profile = {error: err.error.error};
          this.GlobalFields.isLoggedIn = false;
          this.errorMgs = this.GlobalFields.profile.error;
          console.log(this.GlobalFields.profile);
          console.log(this.errorMgs);
        });
      }
    }, err => {
      this.GlobalFields.loadingSoft = false;
    });
  }


  registration() {
    this.errorMgs = undefined;
    this.GlobalFields.loadingSoft = true;
    this.service.getNonceRegistration().subscribe((data: string) => {
      if (data) {
        this.GlobalFields.nonce = JSON.parse(data).nonce;
        this.service.registration(this.GlobalFields.username, this.GlobalFields.password, JSON.parse(data).nonce).subscribe((data: any) => {
          this.storeProfileDoLogin(data);
        }, err => {
          this.GlobalFields.loadingSoft = false;
          console.log(err.error);
          this.GlobalFields.profile = {error: err.error.error};
          this.GlobalFields.isLoggedIn = false;
          this.errorMgs = this.GlobalFields.profile.error;
          console.log(this.GlobalFields.profile);
          console.log(this.errorMgs);
        });
      }
    }, err => {
      this.GlobalFields.loadingSoft = false;
    });
  }


  pswRecovery() {
    this.errorMgs = undefined;
    this.GlobalFields.loadingSoft = true;
    this.service.getNoncePswRecovery().subscribe((data: string) => {
      if (data) {
        this.service.pswRecovery(this.GlobalFields.username, JSON.parse(data).nonce).subscribe((data: any) => {
          if (data.success) {
            this.successMsg = true;
            this.tabToShown = 1;
          } else {
            this.successMsg = false;
            this.errorMgs = 'Invalid username or email';
          }
          this.GlobalFields.loadingSoft = false;
        }, err => {
          this.GlobalFields.loadingSoft = false;
          console.log(err.error);
          this.GlobalFields.isLoggedIn = false;
          this.errorMgs = err.error;
        });
      }
    }, err => {
      this.GlobalFields.loadingSoft = false;
    });
  }


  openLink(url: string) {
    console.log(url);
    const browser = this.inAppBrowser.create(url, '_blank');
  }

  socialLogin(type: number) { // 1=Facebook, 2=Google
    this.errorMgs = undefined;

    if (type == 2) {
      this.googlePlus.login({
      })
        .then(res => {
          console.log('Ok login con google');
          console.log(res);
          if (res && res.accessToken) {
            this.GlobalFields.loadingSoft = true;
            this.service.socialLogin(type, res.accessToken).subscribe((data: any) => {
              if (data) {
                this.storeProfileDoLogin(data);
              }
            }, err => {
              this.errorMgs = err;
              this.GlobalFields.loadingSoft = false;
            });
          }
        })
        .catch(err => {
          console.log('Errore in login con google');
          console.error(err);
          if(err!=12501 && err!='12501') //12501 is the error of google popup closed, so avoid showing error for this
            this.errorMgs = err;
        });
    } else if (type == 1) {
      try {
        this.fb.login(['public_profile', 'email'])
          .then((res: FacebookLoginResponse) => {
            console.log('Logged into Facebook!');
            console.log(res);
            if (res && res.authResponse && res.authResponse.accessToken) {
              this.GlobalFields.loadingSoft = true;
              this.service.socialLogin(type, res.authResponse.accessToken).subscribe((data: any) => {
                if (data) {
                  this.storeProfileDoLogin(data);
                }
              }, err => {
                this.errorMgs = err;
                this.GlobalFields.loadingSoft = false;
              });
            }
          })
          .catch((e : {errorCode?: any, errorMessage?: string}) => {
            console.log('Error logging into Facebook');
            console.log(e)
            if(e) {
              if (e.errorCode != 4201 && e.errorCode != '4201')
                this.errorMgs = e.errorMessage;
            }else
              this.errorMgs = "error";
          });

        //this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
      } catch (Error) {
        console.log('Errore di facebook');
      }
    }

  }

  storeProfileDoLogin(user: Profile) {
    this.GlobalFields.profile = user;
    this.GlobalFields.getUserRole();
    if (this.GlobalFields.profile.status == 'error') { //Login error
      this.GlobalFields.isLoggedIn = false;
      console.log(user);
      this.errorMgs = this.GlobalFields.profile.error;
      console.log(this.errorMgs);
    } else if (this.GlobalFields.profile.error) { //Login error
      this.GlobalFields.isLoggedIn = false;
      console.log(user);
      this.errorMgs = this.GlobalFields.profile.error;
      console.log(this.errorMgs);
    } else { //Login ok
      this.errorMgs = '';
      this.service.storeProfile(this.GlobalFields.profile);

      //Send External ID to OneSignal
      if(GlobalFields.site_details.enableNotifications && this.GlobalFields.profile && this.GlobalFields.profile.user)
        this.oneSignal.setExternalUserId(this.GlobalFields.profile.user.id + "")

      this.GlobalFields.isLoggedIn = true;
      this.loginComplete.emit(true);

    }

    this.GlobalFields.loadingSoft = false;
  }

}




