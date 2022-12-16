import { NgModule } from '@angular/core';
import { Routes, RouterModule, TitleStrategy } from '@angular/router';
import { NativeTitleStrategy } from 'src/app/native-title-strategy.service';

import { DetailPage } from './detail.page';

const routes: Routes = [
  {
    path: ':id',
    component: DetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPageRoutingModule {}
