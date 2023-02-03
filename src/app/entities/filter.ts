
export class Filter {
  author?: number;
  comment_status?: string;
  date?: string;
  date_gmt?: string;
  featured_media?: number;
  geolocation_formatted_address?: string;
  guid?: string;
  id?: number;
  job_location__lock_pin?: any;
  link?: string;
  meta?: any;
  modified?: string;
  modified_gmt?: string;
  ping_status?: string;
  pure_taxonomies?: any;
  slug?:  string;
  status?: string;
  template?: any;
  title?: {rendered?: any};
  type?: string;
  _links?: any;
  imgCover?: any;

  job_listing_category?: number[];
  main_image_gallery?: any;

  listing_data?: any; //dettagli custom del listing

  // solo se è un listing type

  default_cover_image?: string;
  default_logo?: string;

}
