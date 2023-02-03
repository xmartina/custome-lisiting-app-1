export class Constants {


  /*

  ** REMEMBER: first thing to do after opened the project is to run: npm install

  Please read our documentation: http://customlistingapp.italiancoders.com/documentation/

  Join our fb group: https://www.facebook.com/groups/880553875456862/

  */

  public static url = 'https://mylistingdemo.danceup.dance'; //change it with your mylisting website
  public static GoogleMapsKEY = 'AIzaSy-your_Key'; //Eg 'AIzaSy-your_Key' change it, then run the next command: ionic cordova plugin add uk.co.workingedge.phonegap.plugin.launchnavigator --variable GOOGLE_API_KEY_FOR_ANDROID="AIzaSy-your_Key"


  //OneSignal Constants
  public static OneSignal_appID = ''; //Onesignal app id
  public static OneSignal_googleProjectNumber = ''; //Firebase project number (Only for Android)


  //WooCommerce Constants
  public static ConsumerKeyWoo = ''; //demo
  public static ConsumerSecretWoo = ''; //demo


  //WP CONSTANTS

  public static LISTING_STATUS_PUBLISHED = 'publish';
  public static LISTING_STATUS_PENDING = 'pending';
  public static LISTING_STATUS_DRAFT = 'draft';
  public static LISTING_STATUS_AUTO_DRAFT = 'auto-draft';
  public static LISTING_STATUS_FUTURE = 'future';
  public static LISTING_STATUS_INHERIT = 'inherit';
  public static LISTING_STATUS_TRASH = 'trash';
  public static LISTING_STATUS_ANY = 'any';

}
