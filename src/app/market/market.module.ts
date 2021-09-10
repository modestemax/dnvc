import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketRoutingModule } from './market-routing.module';
import { MarketComponent } from './market.component';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [
    MarketComponent
  ],
    imports: [
        CommonModule,
        MarketRoutingModule,
        NgxPaginationModule
    ]
})
export class MarketModule { }
