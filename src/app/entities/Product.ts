export class ProdImg{
  alt?: string;
  date_created?: string;
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  id?: number;
  name?: string;
  src?: string;
}

export class Package{
  count?: number; //number of listings already used
  duration?: number;
  limit?: number;
  id?:number;
  name?:string;
  product_id?: number;
}

export class Product {
  id?: number;
  attributes?: any[] = [];
  average_rating?: string; //eg. "0.00"
  backordered?: boolean;
  backorders?: string; //eg. "no"
  backorders_allowed?: boolean;
  better_featured_image?: any;
  button_text?: string;
  catalog_visibility?: string; //eg. "visible"
  categories?: { id?: number, name?: string, slug?: string }[] = [];
  cross_sell_ids?: number[] = [];
  date_created?: string; //eg. "2018-04-07T15:10:35"
  date_created_gmt?: string;
  date_modified?: string;
  date_modified_gmt?: string;
  date_on_sale_from?: string;
  date_on_sale_from_gmt?: string;
  date_on_sale_to?: string;
  date_on_sale_to_gmt?: string;
  default_attributes?: any[] = [];
  description?: string; //eg. html
  dimensions?: { length?: string, width?: string, height?: string };
  download_expiry?: number; //eg. -1
  download_limit?: number;
  downloadable?: boolean;
  downloads?: any[]=[];
  external_url?: string;
  featured?: boolean;
  grouped_products?: any[]=[];
  images?: ProdImg[]=[];
  image?:string; //only if packages selection
  manage_stock?: boolean;
  menu_order?: number;
  meta_data?: any[]=[];
  name?: string;
  on_sale?: boolean;
  parent_id?: number;
  permalink?: string;
  price?: string; //eg '19.99'
  price_html?: string;
  purchasable?: boolean;
  purchase_note?: string;
  pure_taxonomies?: {
    product_cat: {
      count?: number,
      description?: string,
      filter?: string,
      name?: string,
      parent?: number,
      slug?: string,
      taxonomy?: string,
      term_group?: number,
      term_id?: number,
      term_taxonomy_id?: number
    }[]
  };
  rating_count?: number;
  regular_price?: string;
  related_ids?: number[];
  reviews_allowed?: boolean;
  sale_price?: string;
  shipping_class?: string;
  shipping_class_id?: number;
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  short_description?: string;
  sku?: string;
  slug?: string;
  sold_individually?: boolean;
  status?: string; //eg. 'private'
  stock_quantity?: any;
  stock_status?: string;
  tags?: any[];
  tax_class?: string;
  tax_status?: string; //eg. 'taxable'
  total_sales?: number;
  type?: string; //eg. 'simple'
  upsell_ids?: number[]=[];
  variations?: any[]=[];
  virtual?: boolean;
  weight?: string;
  _links?: any;
}
