import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAdModalPageRoutingModule } from './view-ad-modal-routing.module';

import { ViewAdModalPage } from './view-ad-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAdModalPageRoutingModule
  ],
  declarations: [ViewAdModalPage]
})
export class ViewAdModalPageModule {}
