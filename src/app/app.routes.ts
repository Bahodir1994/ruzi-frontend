import { Routes } from '@angular/router';
import {Admin} from './layout/admin/admin';
import {AuthGuard} from './configuration/authentication/auth.guard';
import {Analytics} from './modules/analytics/analytics';
import {Cashbox} from './modules/cashbox/cashbox';
import {Warehouse} from './modules/warehouse/warehouse';
import {Directory} from './modules/directory/directory';

export const routes: Routes = [
  {
    path: 'cashbox',
    component: Cashbox,
    data: {
      roles: [],
      title: 'Kassa',
      breadcrumb: 'Kassa'
    }
  },
  {
    path: '',
    component: Admin,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Asosiy'
    },
    children: [
      {path: '', redirectTo: 'analytics', pathMatch: 'full'},
      {
        path: 'analytics',
        component: Analytics,
        data: {
          roles: [],
          title: 'Hisobot',
          breadcrumb: 'Hisobot'
        }
      },
      {
        path: 'catalog',
        component: Directory,
        data: {
          roles: [],
          title: 'Katalog',
          breadcrumb: 'Katalog'
        }
      },
      {
        path: 'warehouse',
        component: Warehouse,
        data: {
          roles: [],
          title: 'Ombor',
          breadcrumb: 'Ombor'
        }
      }
    ]
  }
];
