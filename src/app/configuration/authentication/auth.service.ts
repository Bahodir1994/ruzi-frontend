import {Injectable} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {UserGroups} from '../../component/userprofile/userprofile';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private keycloak: KeycloakService) {

  }

  public getLoggedUser() {
    try {
      const userDetails = this.keycloak.getKeycloakInstance().idTokenParsed;

      return userDetails;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  public isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  public loadUserProfile() {
    return this.keycloak.loadUserProfile();
  }

  public loadUserRoles() {
    const roles: string[] = this.keycloak.getUserRoles(false, "ruzi");
    return roles.map(role => ({
      name: role,
      code: role
    }));
  }

  public loadUserGroupsAndRoles(): UserGroups[] {
    const groupsString = this.keycloak.getKeycloakInstance().idTokenParsed?.["groups"];

    if (!groupsString) {
      return [];
    }

    try {
      const groups = JSON.parse(groupsString);
      return groups.map((group: any) => ({
        name: group.name,
        code: group.code || "",
        roles: group.roles ? group.roles.map(this.translateRole) : []
      }));
    } catch (error) {
      return [];
    }
  }

  private translateRole(role: string): string {
    if (role.includes("READ_FULL")) return "To'liq o'qish";
    if (role.includes("READ")) return "O'qish";
    if (role.includes("DELETE")) return "O'chirish";
    if (role.includes("CREATE")) return "Yaratish";
    if (role.includes("UPDATE")) return "Yangilash";
    if (role.includes("UPDATE_FULL")) return "To'liq yangilash";
    return role;
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }

  getToken(): Observable<string | undefined> {
    const token = this.keycloak?.getKeycloakInstance()?.token;
    return of(token);
  }

  public addTokenToHeader() {
    this.keycloak.addTokenToHeader();
  }

  async startTokenRefresh(interval: number = 60000) {
    setInterval(async () => {
      if (await this.keycloak.isLoggedIn()) {
        try {
          const refreshed = await this.keycloak.updateToken(30); // Обновляем, если <30 секунд до истечения
          if (refreshed) {
            // console.log('🔄 Token refreshed:', this.keycloak.getKeycloakInstance().token);
          }
        } catch (error) {
          // console.error('❌ Token refresh failed', error);
          this.keycloak.logout();
        }
      }
    }, interval);
  }

}
