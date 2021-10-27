import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import {TranslateModule} from '@ngx-translate/core';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {NgxPaginationModule} from 'ngx-pagination';
import {DataViewModule} from 'primeng/dataview';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {AccordionModule} from 'primeng/accordion';
import {SkeletonModule} from 'primeng/skeleton';


@NgModule({
  declarations: [
    ResourcesComponent
  ],
    imports: [
        CommonModule,
        ResourcesRoutingModule,
        TranslateModule,
        ProgressSpinnerModule,
        NgxPaginationModule,
        DataViewModule,
        InputTextModule,
        DropdownModule,
        CalendarModule,
        FormsModule,
        AccordionModule,
        SkeletonModule
    ]
})
export class ResourcesModule { }
