import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AccountComponent } from './account/account.component';
import { GIService } from '../services/GI.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgApexchartsModule,
    DragDropModule
  ],
  declarations: [HomePage, AccountComponent],
  providers : [GIService]
})
export class HomePageModule {}
