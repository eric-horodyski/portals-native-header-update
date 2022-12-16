import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  RouterModule,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { NativeTitleStrategy } from './native-title-strategy.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    title: 'Registered Users',
    loadChildren: () =>
      import('./user/list/list.module').then((m) => m.ListPageModule),
  },
  {
    path: 'detail',
    loadChildren: () =>
      import('./user/detail/detail.module').then((m) => m.DetailPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: NativeTitleStrategy }],
})
export class AppRoutingModule {}
