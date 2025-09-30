import {Injectable} from '@angular/core';
import {AuthService} from '../../configuration/authentication/auth.service';
import {ItemLibrary} from '../../modules/items/item.library/item.library';
import {Categories} from '../../modules/items/categories/categories/categories';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private userRoles: string[] = [];

  private permissions = new Map<Function, Record<string, {
    roles: string[],
    conditions?: (status: string) => boolean
  }>>([
    [
      ItemLibrary, {
      'add_new_product': {
        roles: ['ROLE_PRODUCT_CREATE'],
        conditions: (status) => true
      }
    }
    ],
    [
      Categories, {
      'add_new_category': {
        roles: ['ROLE_PRODUCT_CREATE'],
        conditions: (status) => true
      }
    }
    ]
  ]);

  constructor(private authService: AuthService) {
    this.userRoles = this.authService.loadUserRoles().map(role => role.code);
  }

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

}
