import {WorkHoursDay} from './FiltersSearch';
import {GlobalFields} from '../GlobalFields';

export class AddFormSelectItem {
  count?: number;
  description?: string;
  filter?: string;
  name?: string;
  parent?: number;
  slug?: string;
  taxonomy?: string;
  term_group?: number;
  term_id?: number;
  term_taxonomy_id?: number;
}


export class Listing {
  author_id?: any;
  author?: { avatar?: string; id: number, name?: string };
  comment_status?: string;
  date?: string;
  date_gmt?: string;
  featured?: any;
  featured_media?: number;
  geolocation_formatted_address?: string;
  guid?: string;
  id?: number;
  job_location__lock_pin?: any;
  job_logo?: string;
  link?: string;
  name?: string;
  job_tagline?: string;
  job_description?: string;
  job_location?: string;
  job_phone?: string;
  job_email?: string;
  job_gallery?: string[] = [];
  job_video_url?: string;
  job_website?: string;
  job_cover?: string;
  meta?: any;
  modified?: string;
  modified_gmt?: string;
  ping_status?: string;
  pure_taxonomies?: any;
  slug?: string;
  post_status?: string;
  /*
      ‘publish‘ – a published post or page.
      ‘pending‘ – post is pending review.
      ‘draft‘ – a post in draft status.
      ‘auto-draft‘ – a newly created post, with no content.
      ‘future‘ – a post to publish in the future.
      ‘private‘ – not visible to users who are not logged in.
      ‘inherit‘ – a revision. see get_children().
      ‘trash‘ – post is in trashbin (available since version 2.9).
      ‘any‘ – retrieves any status except those from post statuses with ‘exclude_from_search’ set to true (i.e. trash and auto-draft).
  */
  _case27_listing_type?: any; //slug
  template?: any;
  title?: { rendered?: any };
  type?: string;
  _links?: any;
  img_cover?: any;
  //img_cover?: any; //wrong one, not use it, but not delete it

  //used by the add form
  job_tags?: AddFormSelectItem[];
  //used by the add form
  job_category?: AddFormSelectItem[];
  region?: AddFormSelectItem[];


  comments?: {
    author?: string;
    author_email?: string;
    avatar?: string;
    content?: string;
    date?: string;
    id?: string;
    author_id?: number;
    rating?: string;
    gallery?: string[];
    ratings?: any[]; // Example: {rating: "7", hospitality: "9", service: "7", pricing: "10"}
  }[];

  job_listing_category?: number[];
  main_image_gallery?: any;

  listing_data?: any; //dettagli custom del listing

  footer?: {
    sections?: {
      icon_font?: string,
      first_category?: string,
      others?: string[]
    }[]
  };


  default_cover_image?: string;
  default_logo?: string;

  work_hours: {
    Monday?: WorkHoursDay;
    Tuesday?: WorkHoursDay;
    Wednesday?: WorkHoursDay;
    Thursday?: WorkHoursDay;
    Friday?: WorkHoursDay;
    Saturday?: WorkHoursDay;
    Sunday?: WorkHoursDay;
    timezone?: string;
  } = {
    Monday: new WorkHoursDay(),
    Tuesday: new WorkHoursDay(),
    Wednesday: new WorkHoursDay(),
    Thursday: new WorkHoursDay(),
    Friday: new WorkHoursDay(),
    Saturday: new WorkHoursDay(),
    Sunday: new WorkHoursDay(),
    timezone: GlobalFields.site_details ? GlobalFields.site_details.timezone : undefined
  };

  claimed?: string; //"1" if claimed
  _claimed?: string; //"1" if claimed
  isBookmarked?: boolean;

  _case27_review_count?: string; //'1'
  _case27_average_rating?: string; //'0.5'

  rating?: string; //0.5
  review_count?: string; //1

  package_id?: number;

  //Used to select a listing package
  listing_package?: number;
  //Package used to create the listing, only used for already created listings
  product_id?: string;

  related_listing: any[];
  links:{ network?: string, url?: string, icon?: string, color?: string; }[] = [];


}
