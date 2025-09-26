import { Routes } from '@angular/router';
import {Admin} from './layout/admin/admin';
import {AuthGuard} from './configuration/authentication/auth.guard';
import {Analytics} from './modules/analytics/analytics';
import {Cashbox} from './modules/cashbox/cashbox';
import {Warehouse} from './modules/warehouse/warehouse';
import {Directory} from './modules/main-directory/directory/directory';
import {Product} from './modules/main-directory/product/product';
import {MainDirectory} from './modules/main-directory/main-directory';

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
        path: 'main-directory',
        component: MainDirectory,
        data: {
          roles: [],
          title: 'Katalog turlari',
          breadcrumb: 'Katalog turlari'
        },
        children: [
          {path: '', redirectTo: 'directory', pathMatch: 'full'},
          {
            path: 'directory',
            component: Directory,
            data: {
              roles: [],
              title: 'Katalog',
              breadcrumb: 'Katalog'
            }
          },
          {
            path: 'product',
            component: Product,
            data: {
              roles: [],
              title: 'Tovarlar',
              breadcrumb: 'Tovarlar'
            }
          },
        ]
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
