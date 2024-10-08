import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAdModalPage } from './view-ad-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAdModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAdModalPageRoutingModule {}
