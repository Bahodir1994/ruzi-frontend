// src/app/service/auth/auth.service.ts
import {effect, inject, Injectable, signal} from '@angular/core';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, ReadyArgs, typeEventArgs} from 'keycloak-angular';
import {UserGroups} from '../../component/userprofile/userprofile';

@Injectable({providedIn: 'root'})
export class AuthService {
  // 🔹 Keycloak event signal
  private readonly kcSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  // 🔹 Reactive authentication holati
  isAuthenticated = signal(false);
  userProfile = signal<any | null>(null);
  token = signal<string | null>(null);
  roles = signal<string[]>([]);

  constructor() {
    // reactive effect – har safar Keycloak event o‘zgaradi
    effect(() => {
      const ev = this.kcSignal();

      switch (ev.type) {
        case KeycloakEventType.Ready: {
          const ready = typeEventArgs<ReadyArgs>(ev.args);
          this.isAuthenticated.set(ready);
          break;
        }

        case KeycloakEventType.AuthSuccess:
        case KeycloakEventType.AuthRefreshSuccess: {
          const args = ev.args as any;
          this.token.set(args?.token ?? null);
          this.isAuthenticated.set(true);
          break;
        }

        case KeycloakEventType.AuthLogout: {
          this.isAuthenticated.set(false);
          this.token.set(null);
          this.userProfile.set(null);
          break;
        }

        case KeycloakEventType.TokenExpired: {
          console.warn('Token expired — foydalanuvchini qayta login qilishingiz mumkin.');
          break;
        }

        case KeycloakEventType.AuthError: {
          console.error('Auth error:', ev.args);
          break;
        }
      }
    });

  }

  /** 🔑 Foydalanuvchi login ma’lumotlarini olish */
  async getLoggedUser(): Promise<any | undefined> {
    try {
      const keycloak = (window as any).__keycloak__;
      if (keycloak?.idTokenParsed) {
        return keycloak.idTokenParsed;
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  /** 👤 Foydalanuvchi profili */
  async loadUserProfile(): Promise<any> {
    const keycloak = (window as any).__keycloak__;
    if (keycloak?.loadUserProfile) {
      const profile = await keycloak.loadUserProfile();
      this.userProfile.set(profile);
      return profile;
    }
    return {};
  }

  /** 🧩 Rollarni olish */
  async loadUserRoles(clientId = 'ruzi'): Promise<{ name: string; code: string }[]> {
    const keycloak = (window as any).__keycloak__;
    const roles: string[] = keycloak?.realmAccess?.roles ?? [];
    const clientRoles: string[] = keycloak?.resourceAccess?.[clientId]?.roles ?? [];
    const merged = [...new Set([...roles, ...clientRoles])];
    this.roles.set(merged);
    return merged.map(r => ({name: r, code: r}));
  }

  /** 🧠 Guruhlar va rollar */
  async loadUserGroupsAndRoles(): Promise<UserGroups[]> {
    const kc = (window as any).__keycloak__;
    const groups = kc?.tokenParsed?.['groups'];
    if (!groups) return [];
    try {
      const parsed = JSON.parse(groups);
      return parsed.map((g: any) => ({
        name: g.name,
        code: g.code ?? '',
        roles: g.roles?.map(this.translateRole) ?? []
      }));
    } catch {
      return [];
    }
  }

  private translateRole(role: string): string {
    if (role.includes('READ_FULL')) return "To'liq o‘qish";
    if (role.includes('READ')) return "O‘qish";
    if (role.includes('DELETE')) return "O‘chirish";
    if (role.includes('CREATE')) return "Yaratish";
    if (role.includes('UPDATE_FULL')) return "To‘liq yangilash";
    if (role.includes('UPDATE')) return "Yangilash";
    return role;
  }

  /** 🔐 Login/Logout */
  login() {
    (window as any).__keycloak__?.login();
  }

  logout() {
    (window as any).__keycloak__?.logout();
  }

  /** 🔁 Tokenni yangilab turish (agar kerak bo‘lsa) */
  async startTokenRefresh(intervalMs = 60000) {
    const kc = (window as any).__keycloak__;
    if (!kc?.updateToken) return;
    setInterval(async () => {
      try {
        await kc.updateToken(30);
      } catch {
        kc.logout();
      }
    }, intervalMs);
  }
}
