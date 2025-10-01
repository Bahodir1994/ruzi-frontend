import {Routes} from '@angular/router';
import {Admin} from './layout/admin/admin';
import {AuthGuard} from './configuration/authentication/auth.guard';
import {Analytics} from './modules/analytics/analytics';
import {Cashbox} from './modules/cashbox/cashbox';
import {Locations} from './modules/settings/account/business-info/locations/locations';
import {Category} from './modules/items/category/category';
import {Item} from './modules/items/item/item';
import {Unit} from './modules/items/unit/unit';

export const routes: Routes = [
  {
    path: '',
    component: Admin,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Asosiy'
    },
    children: [
      {path: '', redirectTo: 'items', pathMatch: 'full'},
      {
        path: 'items',
        data: {
          roles: [],
          title: 'Predmetlar va servislar',
          breadcrumb: 'Predmetlar va Servislar'
        },
        children: [
          {path: '', redirectTo: 'item', pathMatch: 'full'},
          {
            path: 'item',
            component: Item,
            data: {
              roles: [],
              title: 'Tovarlar to`plami',
              breadcrumb: 'Tovarlar to`plami'
            }
          },
          {
            path: 'category',
            component: Category,
            data: {
              roles: [],
              title: 'Kategoriyalar',
              breadcrumb: 'Kategoriyalar'
            }
          },
          {
            path: 'unit',
            component: Unit,
            data: {
              roles: [],
              title: 'O`lchov birligi',
              breadcrumb: 'O`lchov birligi'
            }
          }
        ],
      },
      {
        path: 'settings',
        data: {
          roles: [],
          title: 'Sozlamalar',
          breadcrumb: 'Sozlamalar'
        },
        children: [
          {path: '', redirectTo: 'personal-info', pathMatch: 'full'},
          {
            path: 'personal-info',
            data: {
              roles: [],
              title: 'Personal ma`lumotlar',
              breadcrumb: 'Personal ma`lumotlar'
            },
            children: []
          },
          {
            path: 'business-info',
            data: {
              roles: [],
              title: 'Biznes ma`lumotlari',
              breadcrumb: 'Biznes ma`lumotlar'
            },
            children: [
              {
                path: 'locations',
                component: Locations,
                canActivate: [AuthGuard],
                data: {
                  roles: [],
                  title: 'Joylashuv',
                  breadcrumb: 'Joylashuv'
                }
              }
            ]
          },
        ]
      },
      {
        path: 'analytics',
        component: Analytics,
        canActivate: [AuthGuard],
        data: {
          roles: [],
          title: 'Analitika',
          breadcrumb: 'Analitika'
        }
      }
    ]
  },
  {
    path: 'cashbox',
    component: Cashbox,
    canActivate: [AuthGuard],
    data: {
      roles: [],
      title: 'Kassa',
      breadcrumb: 'Kassa'
    }
  }
];
