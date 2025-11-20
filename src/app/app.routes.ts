import {Routes} from '@angular/router';
import {Admin} from './layout/admin/admin';
import {Cashbox} from './modules/cashbox/cashbox';
import {Category} from './modules/items/category/category';
import {Item} from './modules/items/item/item';
import {Unit} from './modules/items/unit/unit';
import {Warehouse} from './modules/settings/warehouse/warehouse';
import {PurchaseOrder} from './modules/settings/purchase-order/purchase-order';
import {Supplier} from './modules/settings/supplier/supplier';
import {canActivateAuthGuard} from './configuration/authentication/auth.guard';
import {Image} from './modules/items/image/image';

export const routes: Routes = [
  {
    path: 'cashbox',
    component: Cashbox,
    canActivate: [canActivateAuthGuard],
    data: {
      roles: [],
      title: 'Kassa',
      breadcrumb: 'Kassa'
    }
  },
  {
    path: '',
    component: Admin,
    canActivate: [canActivateAuthGuard],
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
            canActivate: [canActivateAuthGuard],
            data: {
              roles: ['ROLE_ITEM_READ'],
              title: 'Tovarlar to`plami',
              breadcrumb: 'Tovarlar to`plami'
            }
          },
          {
            path: 'category',
            component: Category,
            data: {
              roles: [],
              title: 'Guruhlar',
              breadcrumb: 'Guruhlar'
            }
          },
          {
            path: 'image',
            component: Image,
            data: {
              roles: [],
              title: 'Rasmlar katalogi',
              breadcrumb: 'Rasmlar katalogi'
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
          {
            path: 'purchase-order',
            component: PurchaseOrder,
            canActivate: [canActivateAuthGuard],
            data: {
              roles: [],
              title: 'Kirim',
              breadcrumb: 'Kirim'
            }
          },
          {
            path: 'warehouse',
            component: Warehouse,
            canActivate: [canActivateAuthGuard],
            data: {
              roles: [],
              title: 'Joylashuv',
              breadcrumb: 'Joylashuv'
            }
          },
          {
            path: 'supplier',
            component: Supplier,
            canActivate: [canActivateAuthGuard],
            data: {
              roles: [],
              title: 'Ta\'minotchi',
              breadcrumb: 'Ta\'minotchi'
            }
          }
        ]
      }
    ]
  }
];
