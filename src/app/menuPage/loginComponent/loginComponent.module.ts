import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import {NgModule} from "@angular/core";
import {LoginComponent} from "./loginComponent";
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from '../../shared.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        TranslateModule
    ],
    declarations: [LoginComponent],
    entryComponents: [LoginComponent],
    exports: [LoginComponent]
})
export class LoginComponentModule {}
