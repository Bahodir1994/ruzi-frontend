import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot,} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  // @ts-ignore
  override authenticated: any;

  constructor(
    // @ts-ignore
    override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const validLoginPath = this.getDynamicRoute();

    if (!this.authenticated) {
      // if (state.url.includes(validLoginPath)) {
      await this.keycloak.login();
      return false;
      // }

      // this.router.navigate(['401']);
      // return false;
    }

    const loginPath = this.getDynamicRoute();
    if (state.url.includes(loginPath)) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    const requiredRoles = route.data['roles'];

    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // @ts-ignore
    if (requiredRoles.some((role) => this.roles.includes(role))) {
      return true;
    } else {
      this.router.navigate(['403']);
      return false;
    }
  }

  private getDynamicRoute(): string {
    const today = new Date();
    today.setDate(today.getDate() + 10);

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `/login${day}${month}${year}`;
  }
}
