import {Injectable, OnInit} from '@angular/core';
import {AuthService} from '../../configuration/authentication/auth.service';
import {Category} from '../../modules/items/category/category';
import {Item} from '../../modules/items/item/item';
import {Unit} from '../../modules/items/unit/unit';

@Injectable({
  providedIn: 'root'
})
export class PermissionService implements OnInit{
  private userRoles: string[] = [];

  private permissions = new Map<Function, Record<string, {
    roles: string[],
    conditions?: (status: string) => boolean
  }>>([
    [
      Item, {
      'add_new_product': {
        roles: ['ROLE_PRODUCT_CREATE'],
        conditions: (status) => true
      }
    }
    ],
    [
      Category, {
      'add_new_category': {
        roles: ['ROLE_PRODUCT_CREATE'],
        conditions: (status) => true
      }
    }
    ],
    [
      Unit, {
      'add_new_category': {
        roles: ['ROLE_PRODUCT_CREATE'],
        conditions: (status) => true
      }
    }
    ]
  ]);

  constructor(private authService: AuthService) {}

  canAccess(component: Function, key: string, status: string): boolean {
    const permission = this.permissions.get(component)?.[key];
    if (!permission) return false;

    const hasRole = this.userRoles.some(role => permission.roles.includes(role));
    if (status !== 'null') {
      const meetsCondition = permission.conditions ? permission.conditions(status) : true;
      return hasRole && meetsCondition;
    }

    return hasRole;
  }

  async ngOnInit() {
    const roles = await this.authService.loadUserRoles();
    this.userRoles = roles.map(r => r.code);
  }

}
