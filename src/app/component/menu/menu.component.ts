import {ChangeDetectorRef, Component, inject, Input, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {Ripple} from 'primeng/ripple';
import {StyleClass} from 'primeng/styleclass';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MenuAs} from '../../service/sidebar/sidebarDto';
import {SidebarService} from '../../service/sidebar/sidebar.service';
import {AuthService} from '../../configuration/authentication/auth.service';
import { MenuItem } from 'primeng/api';
import {Menu} from 'primeng/menu';
import {TieredMenu} from 'primeng/tieredmenu';
import {Badge} from 'primeng/badge';


@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [
    Ripple,
    NgClass,
    RouterLink,
    RouterLinkActive,
    StyleClass
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  @Input({required: true}) visible!: boolean;
  isSidebarOpen = false;

  menuItem: MenuItem[] | undefined;
  items: MenuAs[] = [];
  userRoles: Set<string> = new Set();

  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.userRoles = new Set(this.authService.loadUserRoles().map(role => role.name));

    this.sidebarService.menuItems$.subscribe(items => {
      this.items = this.filterMenu(items);
      this.menuItem = items;
      console.log('this.menuItem')
      console.log(this.menuItem)
      this.cdr.detectChanges();
    });
  }

  private filterMenu(menu: MenuAs[]): MenuAs[] {
    return menu
      .map(item => {
        if (item.type === 'link') {
          return this.hasPermission(item) ? item : null;
        } else if (item.type === 'sub' && item.items) {
          const filteredSubItems = item.items.filter(subItem => this.hasPermission(subItem));
          return filteredSubItems.length > 0 ? {...item, items: filteredSubItems} : null;
        }
        return null;
      })
      .filter((item): item is MenuAs => item !== null);
  }

  private hasPermission(menuItem: MenuAs): boolean {
    if (!menuItem.permissions || menuItem.permissions.length === 0) {
      return true;
    }
    return menuItem.permissions.some(permission => this.userRoles.has(permission.name));
  }

  isActiveRoute(path: string): boolean {
    const currentUrl = this.router.url;
    return currentUrl.startsWith('/' + path);
  }

  isActiveRoute1(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  isParentActive(menu_data: any): boolean {
    if (this.isActiveRoute(menu_data.route)) {
      return true;
    }
    return menu_data.items?.some((subItem: {
      route: string;
    }) => this.isActiveRoute(menu_data.route + '/' + subItem.route));
  }

  protected readonly Number = Number;

}
