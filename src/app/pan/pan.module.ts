import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PanPageRoutingModule } from './pan-routing.module';

import { PanPage } from './pan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PanPageRoutingModule
  ],
  declarations: [PanPage]
})
export class PanPageModule {}
