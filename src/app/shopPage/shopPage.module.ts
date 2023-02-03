import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {NgModule} from "@angular/core";
import {ShopPage} from './shopPage';
import {OrderPage} from './orderPage/orderPage';
import {ProductPage} from './productPage/productPage';
import {AppModule} from '../app.module';
import {SharedModule} from '../shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ShopPage
            }, {
                path: 'product',
                component: ProductPage
            }, {
                path: 'order',
                component: OrderPage
            }
        ]),
      SharedModule
    ],
    declarations: [ShopPage,OrderPage,ProductPage]
})
export class ShopPageModule {}
