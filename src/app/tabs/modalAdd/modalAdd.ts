import {Component, Input} from '@angular/core';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {GlobalFields} from '../../../app/GlobalFields';

import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {FieldsAddForm, ListingTypeDetail} from '../../entities/listingTypeDetail';
import {CheckboxType} from '../../entities/checkboxType';
import {ImageAttribute} from 'ionic-image-loader';
import {TranslateService} from '@ngx-translate/core';
import {Listing} from '../../entities/listing';
import {Service} from '../../services/Service';
import {Base64} from '@ionic-native/base64/ngx';
import {Package, Product} from '../../entities/Product';
import {WooCommerceService} from '../../services/WooCommerceService';
import {Subscription} from 'rxjs';
import {WorkHoursDay} from '../../entities/FiltersSearch';

@Component({
  selector: 'modal',
  templateUrl: 'modalAdd.html',
  styleUrls: ['modalAdd.scss']
})
export class ModalAddNode {

  newListing: Listing;

  selectedType?: number;
  selectedTypeDetail: ListingTypeDetail = undefined;

  fieldsTypeSelected: FieldsAddForm[] = [];

  GlobalFields = GlobalFields;

  file: any;

  base64Image: string;
  photos: any[] = [];

  uploadingImg = false;

  imgs_to_upload: { field: string, file: Blob, previewUrl: string, file_name: string }[] = [];


  success_creation_msg_1;
  success_creation_msg_2;
  success_msg;
  success_update_msg_1;
  close_msg;

  private onResumeSubscription: Subscription;

  //for multi img upload
  howManyToUpload: number;
  howManyUploaded: number;

  //For packages logic
  loadingPackages?: boolean = true; //After selecting a listing type says if can be created a listing or not due to packages
  can_create_listing?: boolean = false; //After selecting a listing type says if can be created a listing or not due to packages
  packagesToBuy?: Product[] = []; //Are products, not the right packages
  packagesAlreadyBought?: Package[] = []; //On listing creation this is the packaged that can be used


  //Working hours
  selectedDay = 'Monday';

  //Social networks
  socialNetworks = ['Facebook', 'Twitter', 'Instagram', 'YouTube', 'Snapchat', 'Tumblr', 'Reddit', 'LinkedIn', 'Pinterest', 'DeviantArt',
    'VKontakte', 'SoundCloud', 'Website', 'Other'];


  compareWithSocialNet = function (o1, o2) {
    return o1 === o2;
  };


  constructor(public service: Service, public wooCommerceService: WooCommerceService, public viewCtrl: ModalController, private imagePicker: ImagePicker,
              public translate: TranslateService, public alertController: AlertController, private base64: Base64,
              public platform: Platform) {

    //     this.selectedType = this.GlobalFields.filtersSearch.selectedType;
    //     this.selectedTypeDetail = this.GlobalFields.selectedTypeDetail;
    //     this.selectListingType()

    GlobalFields.addForm = this.GlobalFields.duplicateObj(GlobalFields.filtersSearch);

    // is edit
    if (this.GlobalFields.listingToEdit && this.GlobalFields.listingToEdit.id) {
      this.newListing = this.GlobalFields.listingToEdit;
      if (GlobalFields.listingTypesDetails.find(res => res.post_name == this.GlobalFields.listingToEdit._case27_listing_type)) {
        this.selectedType = GlobalFields.listingTypesDetails.find(res => res.post_name == this.GlobalFields.listingToEdit._case27_listing_type).ID;
        this.selectListingType();
        this.preSelectCustomTaxonomies();
      }
      this.loadingPackages = false;
      this.can_create_listing = true;

      console.log(this.GlobalFields.listingToEdit);
      console.log(this.newListing);

    } else // is new listing
      this.newListing = new Listing();

    this.prepareWorkHrs();
    this.GlobalFields.listingToEdit = undefined;

    this.translate.get('SUCCESS_CREATION_MSG_1').subscribe((msg: string) => {
      this.success_creation_msg_1 = msg;
    });
    this.translate.get('SUCCESS_CREATION_MSG_2').subscribe((msg: string) => {
      this.success_creation_msg_2 = msg;
    });
    this.translate.get('SUCCESS_MSG').subscribe((msg: string) => {
      this.success_msg = msg;
    });
    this.translate.get('SUCCESS_UPDATE_MSG_1').subscribe((msg: string) => {
      this.success_update_msg_1 = msg;
    });
    this.translate.get('ALERT_CLOSE').subscribe((msg: string) => {
      this.close_msg = msg;
    });

    this.platform.ready().then(() => {
      this.onResumeSubscription = platform.resume.subscribe(() => {
        // do something meaningful when the app is put in the foreground
        console.log('platform.resume event');
        this.checkPackages();
      });
    });

  }

  //After opening the browser for the pckages purchasing a check is needed again
  ionViewDidEnter() {
    this.checkPackages();

    //Check if token is still correct or expired and refresh it
    if (GlobalFields.isLoggedIn) {
      this.service.getCurrentUserInfo().subscribe((data: any) => {
      }, err => {
        this.service.refreshCookie();
      });
    }
  }


  iniFormAd() {

    //prepare addForm object
    GlobalFields.addForm.customTaxonomiesDropdownKeysOptions = [];
    GlobalFields.addForm.categories = [];
    GlobalFields.addForm.tags = [];
    GlobalFields.addForm.regions = [];
    GlobalFields.addForm.customFieldsDropdownKeysOptions = [];
    GlobalFields.addForm.customFieldsText = [];
    GlobalFields.addForm.customFieldsNumber = [];
    GlobalFields.addForm.work_hours.Monday = new WorkHoursDay();
    GlobalFields.addForm.work_hours.Tuesday = new WorkHoursDay();
    GlobalFields.addForm.work_hours.Wednesday = new WorkHoursDay();
    GlobalFields.addForm.work_hours.Thursday = new WorkHoursDay();
    GlobalFields.addForm.work_hours.Friday = new WorkHoursDay();
    GlobalFields.addForm.work_hours.Saturday = new WorkHoursDay();
    GlobalFields.addForm.work_hours.Sunday = new WorkHoursDay();
    GlobalFields.addForm.work_hours.timezone = GlobalFields.site_details ? GlobalFields.site_details.timezone : undefined;

    //prepare CustomTaxonomies
    for (let key in this.GlobalFields.listingCustomTaxonomies) {
      if (key != 'region') {
        let opts = this.GlobalFields.listingCustomTaxonomies[key];
        if (this.fieldsTypeSelected.find(el => el.slug == key)) {
          let selected = [];
          if (this.newListing && this.newListing.id && this.newListing[key])
            selected = this.newListing[key];
          GlobalFields.addForm.customTaxonomiesDropdownKeysOptions.push({key: key, options: opts, selected: selected});
        }
      }
    }

    //array of custom fields for dropdowns
    GlobalFields.listingCustomFieldKeys.forEach(key => {
      let field = this.selectedTypeDetail.case27_listing_type_fields[key];
      if (field && (field.type == 'term-select' || field.type == 'select' || field.type == 'multiselect')) {
        let selected = [];
        if (this.newListing && this.newListing.id && this.newListing[key])
          selected = this.newListing[key];
        GlobalFields.addForm.customFieldsDropdownKeysOptions.push({key: field.slug, options: field.options, selected: selected});
      }
    });
  }

  selectListingType() {

    this.selectedTypeDetail = GlobalFields.listingTypesDetails.find(res => res.ID == this.selectedType);
    this.newListing._case27_listing_type = this.selectedTypeDetail.post_name;
    console.log(this.selectedTypeDetail);
    this.getfieldsTypeSelected();
    this.iniFormAd();
    this.prepareOptionsCategories();
    this.prepareOptionsTags();
    this.prepareOptionsRegions();

    this.checkPackages();
  }

  preSelectCustomTaxonomies(){
    //Prepare the custom taxonomies alrady selected
    this.fieldsTypeSelected.forEach(field =>{
      if(field.type == 'term-select' && field.slug !='job_tags' && field.slug !='job_category' && field.slug !='region') {
        console.log(field.slug);
        console.log(this.newListing[field.slug])
        this.newListing[field.slug].forEach( term_id => {
          GlobalFields.getCustomTaxonomiesByKeyAddForm(field.slug).selected.push(term_id + '');
        })
      }
    })

  }

  isSelected(id: any) {
    if (this.selectedType == id)
      return ' selectedtypesListHorizontal';
    else
      return '';
  }

  isSelectedGetPrimaryColor(id: any) {
    if (this.selectedType == id)
      return this.GlobalFields.getPrimaryColorJson();
    else
      return undefined;
  }


  getKeys(obj: any) {
    const res = Object.keys(obj);
    if (res)
      return res;
    else
      return [];
  }


  getfieldsTypeSelected() {
    const keys = this.getKeys(this.selectedTypeDetail.case27_listing_type_fields);
    this.fieldsTypeSelected = [];
    keys.forEach(key => {
      this.fieldsTypeSelected.push(this.selectedTypeDetail.case27_listing_type_fields[key]);
    });
    this.fieldsTypeSelected.sort((a, b) => {
      return (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0);
    });

    console.log(this.fieldsTypeSelected);
  }

  getClassContainer() {
    if (this.GlobalFields.isWhiteBackground())
      return 'sectionContainer';
    else return 'sectionContainerNotWhiteBackground';

  }


  closeModal() {
    this.viewCtrl.dismiss();
  }


  getPictures() {
    if (!this.imagePicker) {
      console.log('asd');
    }
    this.imagePicker.getPictures(undefined).then((results) => {
      for (let i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
    }, (err) => {
      console.log(err);
    });
  }

  prepareWorkHrs() {
    console.log(this.newListing.work_hours);
    if (!this.newListing.work_hours || (this.newListing.work_hours as any[]).length == 0) {
      this.newListing.work_hours = {
        Monday: new WorkHoursDay(),
        Tuesday: new WorkHoursDay(),
        Wednesday: new WorkHoursDay(),
        Thursday: new WorkHoursDay(),
        Friday: new WorkHoursDay(),
        Saturday: new WorkHoursDay(),
        Sunday: new WorkHoursDay(),
      };
      console.log(this.newListing.work_hours);
    }
  }

  prepareOptionsCategories() {
    GlobalFields.addForm.categories = [];

    this.selectedTypeDetail.categories.forEach(cat => {
      if (this.newListing && this.newListing.id)
        if (this.newListing.job_category && this.newListing.job_category.find(el => el == cat.id)) {
          GlobalFields.addForm.categories.push(cat.name);
        }
    });
  }

  prepareOptionsTags() {
    GlobalFields.addForm.tags = [];
    this.selectedTypeDetail.tags.forEach(cat => {
      let c = new CheckboxType();
      if (this.newListing && this.newListing.id)
        if (this.newListing.job_tags && this.newListing.job_tags.find(el => el == cat.id))
          c.isChecked = true;
        else
          c.isChecked = false;
      c.val = cat;
      GlobalFields.addForm.tags.push(c);
    });

  }

  prepareOptionsRegions() {
    GlobalFields.addForm.regions = [];
    this.GlobalFields.regions.forEach(cat => {
      let c = new CheckboxType();
      if (this.newListing && this.newListing.id)
        if (this.newListing.region && this.newListing.region.find(el => el == cat.id))
          c.isChecked = true;
        else
          c.isChecked = false;
      c.val = cat;
      GlobalFields.addForm.regions.push(c);
    });
  }

  toStringCategories(): string {
    if (!GlobalFields.addForm.categories || GlobalFields.addForm.categories.length == 0)
      return '';
    else if (GlobalFields.addForm.categories.length > 3)
      return GlobalFields.addForm.categories.length + ' selected';
    else
      return GlobalFields.addForm.categories.toString();
  }

  toStringTaxonomies(key: string): string {
    let tax = GlobalFields.getCustomTaxonomiesByKey(key);
    if (tax) {
      /* if (!tax.selected || tax.selected.length == 0)
           return "";
       else if (tax.selected.length > 3)
           return tax.selected.length + " selected";
       else {*/
      return tax.selected;
      // }
    }

  }

  getImgCachedClass(class_to_add: string): ImageAttribute[] {
    let class_name = 'imgCachedAsBackground ' + class_to_add;

    const imageAttributes: ImageAttribute[] = [];
    imageAttributes.push({
      element: 'class',
      value: class_name
    });


    return imageAttributes;
  }


  getBackgroundCached(type: ListingTypeDetail) {
    let image = '';
    image = type.img_cover;
    if (!image)
      image = GlobalFields.site_details.placeholderImgUrl;
    return image;
  }


  openImagePicker(multiple: boolean, field: string) {

    let outputType: number = 0; //0 Return image file URI, 1 base64img on android crash BUT WORKS FOR Information google-ios

    if (this.platform.is('ios'))
      outputType = 1;
    if (this.platform.is('android'))
      outputType = 0;

    try {
       const howMany = multiple ? 15 : 1;
      //const howMany = 1;

      let options = {
        maximumImagesCount: howMany,
        outputType: outputType
      };
      this.imagePicker.getPictures(options).then((results) => {
        this.howManyToUpload = results.length;
        this.howManyUploaded = 0;
        if (Array.isArray(results))
          for (let i = 0; i < results.length; i++) {

            this.GlobalFields.loadingSoft = true;

            if (outputType === 0) {  //file URI - Android
              console.log(results[i]);
              this.base64.encodeFile(results[i]).then((base64File: string) => {
                console.log(base64File);
                this.uploadImg(this.dataURItoBlob(base64File), results[i], multiple, field);
              }, (err) => {
                console.log(err);
                this.GlobalFields.loadingSoft = true;
              });
            }
            if (outputType === 1)  //base64 - Information google-ios
              this.uploadImg(this.dataURItoBlob('data:image/jpeg;base64,' + results[i]), results[i], multiple, field);
          }
      }, (err) => {
        console.log(err);
        this.GlobalFields.loadingSoft = false;
      });
    } catch (error) {
      console.error(error);
    }


  }


  uploadImg(blob, fileName, multiple, field) {
    return this.service.uploadImgListing(blob,
      fileName, !multiple ? field : field + '[]').subscribe((res: any) => {

      this.howManyUploaded = this.howManyUploaded + 1;

      if (res && res.files && res.files.length > 0 && res.files[0].attachment_url) {
        if (!multiple)
          this.newListing[field] = res.files[0].attachment_url;
        else {
          if (!this.newListing[field])
            this.newListing[field] = [];
          this.newListing[field].push(res.files[0].attachment_url);
        }
      }
      if (this.howManyToUpload == this.howManyUploaded)
        this.GlobalFields.loadingSoft = false;
    }, error => {
      console.log(error);
      let msg = '';
      if (error && error.error)
        msg = error.error.message;
      else if (error)
        msg = error.message;
      this.GlobalFields.openAlert(this.alertController, 'Error', 'Error on web server', msg);
      this.GlobalFields.loadingSoft = false;
    });
  }

  findImgsByField(field: string): { field: string, file: Blob, previewUrl: string, file_name: string }[] {
    const res = this.imgs_to_upload.filter(el => el.field == field);
    if (!res)
      return [];
    return res;
  }

  deleteImgByField(field: string) {
    const res = this.imgs_to_upload.filter(el => el.field != field);
    if (!res)
      return this.imgs_to_upload;
    return res;
  }


  dataURItoBlob(dataURI: string): Blob {
    // convert base64 to raw binary data held in a string
    console.log(dataURI);
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let _ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }

    let dataView = new DataView(arrayBuffer);
    let blob = new Blob([dataView], {type: mimeString});
    return blob;

  }

  /*
      takePhoto()
      {
          const options : CameraOptions =
              {
                  quality: 50,
                  destinationType: this.camera.DestinationType.DATA_URL,
                  encodingType: this.camera.EncodingType.JPEG,
                  mediaType: this.camera.MediaType.PICTURE
              }
          this.camera.getPicture(options) .then((imageData) =>
              {
                  this.base64Image = "data:image/jpeg;base64," + imageData;
                  this.photos.push(this.base64Image);
                  this.photos.reverse();
              },
              (err) =>
              {
                  console.log(err);
              });
      }
  */

  deleteNewImg(index: number, slug) {

    console.log(index);
    console.log(slug);
    console.log(this.newListing[slug]);

    if (this.newListing[slug] && this.newListing[slug].length > index) {
      this.newListing[slug].splice(index, 1);
    }

  }


  saveListing() {
    console.log(this.GlobalFields.addForm);
    this.GlobalFields.loadingSoft = true;
    this.service.saveListing(this.newListing, this.fieldsTypeSelected).subscribe(() => {
      this.GlobalFields.loadingSoft = false;
      this.service.clearAllCache();
      if (!this.newListing.id) //is new listing
        this.GlobalFields.openSuccessAlert(this.alertController, this.success_msg, this.success_creation_msg_1, this.success_creation_msg_2, this.close_msg);
      else //is Edit
        this.GlobalFields.openSuccessAlert(this.alertController, this.success_msg, this.success_update_msg_1, this.success_creation_msg_2, this.close_msg);
      this.closeModal();
    }, error => {
      let msg = '';
      if (error && error.error)
        msg = error.error.message;
      else if (error)
        msg = error.message;
      this.GlobalFields.openAlert(this.alertController, 'Error', 'Error on web server', error);
      this.GlobalFields.loadingSoft = false;
    });
  }

  checkIfFieldsMissing() {

    //  return false;
    return this.fieldsTypeSelected.some(field =>
      field && field.required && this.isVoidField(field) && this.canShowPackageCondition(field));
  }

  getMyAddress(slug) {
    this.newListing[slug] = GlobalFields.address;
  }

  isVoidField(field: FieldsAddForm) {
    if (!field) return true;

    if (field.slug == 'job_category' && GlobalFields.addForm.categories.length == 0)
      return true;
    if (field.slug == 'job_category')
      return false;

    if (field.slug == 'job_tags' && GlobalFields.addForm.tags.length == 0)
      return true;
    if (field.slug == 'job_tags')
      return false;

    if (field.slug == 'region' && GlobalFields.addForm.regions.length == 0)
      return true;
    if (field.slug == 'region')
      return false;

    if (field.slug == 'price_range' && !GlobalFields.addForm.price_range)
      return true;
    if (field.slug == 'price_range')
      return false;

    //not custom
    if (!field.is_custom && field.type != 'term-select' && field.type != 'select' && field.type != 'multiselect' && (!this.newListing[field.slug] || this.newListing[field.slug].length == 0)) {
      return true;
    }
    //Custom term-select field (it has is_custom to false)
    if (!field.is_custom && field.type == 'term-select' && !GlobalFields.getCustomTaxonomiesByKeyAddForm(field.slug).selected)
      return true;

    //Custom select OR multiselect field
    if (field.is_custom && (field.type == 'select' || field.type == 'multiselect') && !GlobalFields.getCustomFieldsByKeyAddForm(field.slug).selected)
      return true;

    //custom field
    //TODO: check missing types of mandatory custom fields
    if (field.is_custom && (
      field.type == 'number' || field.type == 'text' || field.type == 'texteditor' || field.type == 'wp-editor')
      && this.newListing[field.slug] == undefined)
      return true;


    return false;
  }

  addWorkHours() {
    if (!this.newListing.work_hours[this.selectedDay])
      this.newListing.work_hours[this.selectedDay] = new WorkHoursDay();
    if (!this.newListing.work_hours[this.selectedDay].entry_hours)
      this.newListing.work_hours[this.selectedDay].entry_hours = [];

    this.newListing.work_hours[this.selectedDay].entry_hours.push({from: undefined, to: undefined});
  }

  addSocialNetLink() {
    if (!this.newListing.links)
      this.newListing.links = [];
    this.newListing.links.push({network: undefined, url: undefined});

    console.log(this.newListing.links);
  }


  checkPackages() {

    if(!this.can_create_listing) {
      if (this.newListing && this.newListing.id)
        this.can_create_listing = true;
      else {
        if (GlobalFields.isLoggedIn && this.selectedType) {
          this.loadingPackages = true;
          this.service.getPackagesPermission(this.selectedType)
            .subscribe((data: { success: boolean, can_create_listing: boolean, products?: Product[], packages?: Package[], products_ids?: number[] }) => {
              if (data && data.success) {
                this.can_create_listing = data.can_create_listing;
                this.packagesToBuy = data.products;
                this.packagesAlreadyBought = data.packages;
                this.loadingPackages = false;
              }
            });
        }
      }
    }
  }

  getOnlyTimeFromDate(time?: string) { //the format is 2020-09-01T07:00:54.821-00:00
    const t1 = time.split('T');
    console.log(t1);
    if (t1 && t1.length > 1) {
      const t2 = t1[1].split(':');
      if (t2.length > 1) {
        const hr = t2[0];
        const mm = t2[1];
        console.log(hr + ':' + mm);
        return hr + ':' + mm;
      }
    }
  }

  log(obj) {
    console.log(obj);
    console.log(GlobalFields.addForm);
  }

  deleteEntryFromWorkHrs(i: number) {
    if (this.newListing.work_hours[this.selectedDay].entry_hours && this.newListing.work_hours[this.selectedDay].entry_hours.length > 0) {
      (this.newListing.work_hours[this.selectedDay].entry_hours as any[]).splice(i, 1);
    }
  }

  deleteEntryFromLinks(i: number) {
    if (this.newListing.links && this.newListing.links.length > 0) {
      this.newListing.links.splice(i, 1);
    }
  }

  canShowPackageCondition(field?: FieldsAddForm): boolean {
    let res = false;
    if (!field || !field.conditions || field.conditions.length == 0)
      res = true;
    else if (field) {
      if (field.conditions && field.conditions.length > 0 && field.conditions[0] && field.conditions[0].length > 0)
        field.conditions.forEach(conditions => conditions.forEach(cond => {
          if (cond.key == '__listing_package' && cond.compare == '==') {
            if (cond.value == '') {
              res = true;
            } else if (cond.value == '--none--') {
              res = true;
            }
            //Is edit
            else if (this.newListing.id) {
              if (this.newListing.product_id && cond.value == (this.newListing.product_id + ''))
                res = true;
              else if (!this.newListing.product_id || this.newListing.product_id == '')
                res = true;
            }
            //Is new listing
            else if (this.packagesAlreadyBought && this.packagesAlreadyBought.length > 0) {
              const pack = this.packagesAlreadyBought.filter((el) => el.id == this.newListing.listing_package);
              if (pack && pack.length > 0) {
                if (cond.value == (pack[0].product_id + ''))
                  res = true;
              }
            }
          }
        }));
    }
    return res;
  }


  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }
}



