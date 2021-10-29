import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateUserRoutingModule } from './update-user-routing.module';
import { UpdateUserComponent } from './update-user.component';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import {RippleModule} from 'primeng/ripple';
import {SkeletonModule} from 'primeng/skeleton';


@NgModule({
  declarations: [
    UpdateUserComponent
  ],
    imports: [
        CommonModule,
        UpdateUserRoutingModule,
        TranslateModule,
        ButtonModule,
        ReactiveFormsModule,
        DropdownModule,
        ProgressSpinnerModule,
        DialogModule,
        RippleModule,
        FormsModule,
        SkeletonModule
    ]
})
export class UpdateUserModule { }
