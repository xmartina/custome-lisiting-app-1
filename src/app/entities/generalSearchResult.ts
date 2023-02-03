export class EntityGeneralSearchResult{
  id?: number;
  listing_types?: {id?: number, slug?: string, title?: string}[];
  listing_type?: {id?: number, slug?: string, title?: string}; //Only for Listings
  logo?: string; //Only for Listings
  icon?: string; //For catogies, regions and tags to be setted after the call
  name?: string;
}

export class GeneralSearchResult {
  categories: EntityGeneralSearchResult[]=[];
  listings: EntityGeneralSearchResult[]=[];
  regions: EntityGeneralSearchResult[]=[];
  tags: EntityGeneralSearchResult[]=[];
}
