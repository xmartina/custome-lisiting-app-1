import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {NgModule} from "@angular/core";
import {MenuPage} from "./menuPage";
import {TranslateModule} from "@ngx-translate/core";
import {SettingsPage} from './settingsPage/settingsPage';
import {SharedModule} from '../shared.module';
import {LoginComponentModule} from './loginComponent/loginComponent.module';
import {MyListingsPage} from './myListingsPage/myListingsPage';
import {BookmarksPage} from './bookmarksPage/bookmarksPage';
import {NotificationsPage} from './notificationsPage/notificationsPage';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenuPage
            },{
                path: 'settings',
                component: SettingsPage
            },{
                path: 'myListingsPage',
                component: MyListingsPage
            },{
                path: 'bookmarksPage',
                component: BookmarksPage
            },{
                path: 'notificationsPage',
                component: NotificationsPage
            }
        ]),
        TranslateModule,
        LoginComponentModule
    ],
    declarations: [MenuPage, SettingsPage, MyListingsPage, BookmarksPage, NotificationsPage]
})
export class MenuPageModule {}
