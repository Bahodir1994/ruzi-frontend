import {Routes} from '@angular/router';
import {Admin} from './layout/admin/admin';
import {AuthGuard} from './configuration/authentication/auth.guard';
import {Analytics} from './modules/analytics/analytics';
import {Cashbox} from './modules/cashbox/cashbox';
import {ItemLibrary} from './modules/items/item.library/item.library';
import {ImageLibrary} from './modules/items/image.library/image.library';
import {Categories} from './modules/items/categories/categories/categories';
import {Units} from './modules/items/units/units';
import {Locations} from './modules/settings/account/business-info/locations/locations';

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
          {path: '', redirectTo: 'item-library', pathMatch: 'full'},
          {
            path: 'item-library',
            component: ItemLibrary,
            data: {
              roles: [],
              title: 'Tovarlar to`plami',
              breadcrumb: 'Tovarlar to`plami'
            }
          },
          {
            path: 'image-library',
            component: ImageLibrary,
            data: {
              roles: [],
              title: 'Rasmlar to`plami',
              breadcrumb: 'Rasmlar to`plami'
            }
          },
          {
            path: 'categories',
            component: Categories,
            data: {
              roles: [],
              title: 'Kategoriyalar',
              breadcrumb: 'Kategoriyalar'
            }
          },
          {
            path: 'units',
            component: Units,
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
          {path: '', redirectTo: 'account-and-setting', pathMatch: 'full'},
          {
            path: 'account-and-setting',
            data: {
              roles: [],
              title: 'Profil & Sozlamalar',
              breadcrumb: 'Profil & Sozlamalar'
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
