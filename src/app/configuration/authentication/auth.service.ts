import {effect, inject, Injectable, signal} from '@angular/core';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs
} from 'keycloak-angular';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly kcSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private readonly keycloak = inject(Keycloak);

  isAuthenticated = signal(false);
  userProfile = signal<any | null>(null);
  token = signal<string | null>(null);
  roles = signal<string[]>([]);

  constructor() {
    effect(() => {
      const ev = this.kcSignal();

      switch (ev.type) {

        case KeycloakEventType.Ready: {
          const ready = typeEventArgs<ReadyArgs>(ev.args);
          this.isAuthenticated.set(ready);

          if (ready) {
            this.loadUserProfile();
          }
          break;
        }

        case KeycloakEventType.AuthSuccess:
        case KeycloakEventType.AuthRefreshSuccess: {
          this.token.set(this.keycloak.token ?? null);
          this.isAuthenticated.set(true);
          break;
        }

        case KeycloakEventType.AuthLogout: {
          this.isAuthenticated.set(false);
          this.token.set(null);
          this.userProfile.set(null);
          break;
        }
      }
    });
  }

  async loadUserProfile(): Promise<void> {
    const profile = await this.keycloak.loadUserProfile();

    this.userProfile.set(profile);
  }

  async loadUserRoles(clientId = 'ruzi'): Promise<{ name: string; code: string }[]> {
    const realmRoles = this.keycloak.realmAccess?.roles ?? [];
    const clientRoles = this.keycloak.resourceAccess?.[clientId]?.roles ?? [];

    const merged = [...new Set([...realmRoles, ...clientRoles])];
    this.roles.set(merged);

    return merged.map(r => ({ name: r, code: r }));
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }
}
