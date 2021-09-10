import {NgModule, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustriesRoutingModule } from './industries-routing.module';
import { IndustriesComponent } from './industries.component';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [
    IndustriesComponent
  ],
    imports: [
        CommonModule,
        IndustriesRoutingModule,
        NgxPaginationModule
    ]
})
export class IndustriesModule{}
