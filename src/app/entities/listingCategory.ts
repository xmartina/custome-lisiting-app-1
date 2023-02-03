export class ListingCategory {
    count?: number; //quanti listing ha
    description?: string;
    id?: number;
    link?: string;
    meta?: any[];
    name?: string;
    parent?: number; //id della categoria padre
    slug?: string;
    term_image?: any[];
    taxonomy?: string;
    term_id?: number;
    term_taxonomy_id?: number;
    image_url?: string;
    icon?: string;
    image?: string;
}


export class ListingTag {
  count?: number; //quanti listing ha
  description?: string;
  filter?: string;
  icon?: string;
  image?: string;
  name?: string;
  parent?: number;
  slug?: string;
  taxonomy?: string;
  term_group?: number;
  term_id?: number;
  term_taxonomy_id?: number;
}
