import {CheckboxType} from './checkboxType';

export class WorkHoursDay {
  status?: string = 'enter-hours'; //enter-hours, open-all-day, closed-all-day, by-appointment-only
  entry_hours?: { from: string, to: string }[] = [];
}

export class FiltersSearch {
  selectedType?: number;
  categories?: any[] = [];
  price_range?: any = []; //can be an array or a string
  region?: string; //region name
  regions?: any[] = []; //used by ionic checkbox
  tags?: CheckboxType[] = [];

  customTaxonomiesDropdownKeysOptions?: { key: string, options: any[], selected: any[] }[] = [];
  customFieldsDropdownKeysOptions?: { key: string, options: any[], selected: any[] }[] = [];
  customFieldsMultiselectKeysOptions?: { key: string, values: CheckboxType[] }[] = [];
  customFieldsText?: { key: string, selected: string }[] = [];
  customFieldsNumber?: { key: string, selected: number }[] = [];

  order?: string;

  range?: number; //proximity range value
  name?: string; //job_title
  search_keywords?: string; //search_keywords
  location?: string;
  lat?: number;
  lng?: number;
  date?: any;


  //files used for add form

  logo: string;
  cover: string;
  gallery: string[] = [];


  currentPage = 1;
  countListings: number;
  noMorePage = false;


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
    Monday: undefined, Tuesday: undefined, Wednesday: undefined, Thursday: undefined, Friday: undefined, Saturday: undefined, Sunday: undefined,
  };
}
