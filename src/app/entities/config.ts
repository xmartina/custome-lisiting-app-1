export class Config {

  appName?: string;
  customPageUrl?: string; // it's an id
  homeType?: number = 1; // 1: AirBnb style, 2: MylistingStyle, 3: TripAdvisor
  disableMap?: boolean;
  language?: string;
  logoUrl?: string; //Used as logo in the header and menu (Side menu)
  iconUrl?: string; //Used as logo in Airbnb home (tabs), MyListing home (before basic search) and TripAdvisor (as cover image)
  contactInfoChoice?: string; //1) Show always, 2) Show just for claimed listings or 3) Hide always
  primaryColor?: string;
  privatePolicyUrl?: string;
  aboutUsUrl?: string;
  contactUsUrl?: string;
  relativeForgotPasswordUrl?: string = '/my-account/lost-password/';
  relativeRegistrationUrl?: string = '/my-account/';
  searchPageColumn?: string; // "1": squared view, "2": list view, "3": box with logo
  actionButtonStyle?: string; //"1": flat, "2": full
  placeholderImgUrl?: string = '';
  placeholderLocationImgUrl?: string = '';
  homeTabIcon?: string = '';
  categoriesTabIcon?: string = '';
  faPlusCustomTab?: string = '';
  searchTabIcon?: string = '';
  msgTabIcon?: string = '';
  shopTabIcon?: string = '';
  postsTabIcon?: string = ''; //Only shown in case of sidebar
  profileTabIcon?: string = '';
  faIconCustomTab?: string = '';
  nameCustomTab?: string = ''; //Only shown in case of sidebar
  showWhatsappBtn?: boolean = true; //true: show whatsapp, //false: hide whatsapp
  showDirectMessageBtn?: boolean = true; //true: show direct Msg btn, //false: hide it
  reviewStyle?: number = 2; //if 1: Bubble style, if 2: card style
  showCategoriesList?: boolean;
  bodyBackgroundColor?: string = '#f4f4f4';
  listingPageType?: any = 1; //1: Airbnb style 2: MyListing style
  mapType?: number; //1: Google Maps, 2: Open Street Maps
  showMapAllListings?: boolean; //true: show all on map, false: show only the ones on explore page
  headerBtnListingPageStyle?: number; //1: No background, 2: White background
  filtersBtnStyle?: number; //1: Float buttons, 2: Trip advisor style
  timezone?: string;
  socialLoginGoogleEnabled?: boolean;
  socialLoginFacebookEnabled?: boolean;
  enableNotifications?: boolean;
  categoryListTabContent?: number;  //1: only Categories, 2: only regions, 3: Both Categories and Regions

  customGoogleFontFamily?: string; //From https://fonts.google.com/

  navigationType?: number; //1=Tabs, 2=SideMenu

  userRoles?: {
    default_form?: string; //Eg. "primary"
    login_captcha?: boolean;
    register_captcha?: boolean;
    roles?: {
      can_add_listings?: boolean;
      can_switch_role?: boolean;
      fields?: {
        label?: string;
        required?: boolean;
        show_in_account_details?: boolean;
        show_in_register_form?: boolean;
        slug?: string;  //Eg: "email"
        type?: string; //Eg: "email"
      }[];
      label?: string;
      slug?: string; //Eg: "primary", is the id to use
    } []
  };
}



