import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {HomePage} from './home';
import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ListingList} from '../listingList/listingList';
import {SharedModule} from '../shared.module';
import {Loading} from '../loading/loading';
import {UtilitiesModule} from '../utilities/utilities.module';
import {PostsPage} from './postsPage/postsPage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
      {
        path: 'posts',
        component: PostsPage
      }
    ]),
    TranslateModule,
    UtilitiesModule
  ],
  declarations: [HomePage,PostsPage]
})
export class HomePageModule {
}
