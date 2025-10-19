// src/app/configuration/authentication/auth.guard.ts
import type {CanActivateFn} from '@angular/router';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {AuthGuardData, createAuthGuard} from 'keycloak-angular';

// 🔸 eski "dynamic login path" ni saqlaymiz
function getDynamicRoute(): string {
  const today = new Date();
  today.setDate(today.getDate() + 10);
  return `/login${today.getDate().toString().padStart(2, '0')}${(today.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${today.getFullYear()}`;
}

// 🔹 yangi guard logikasi
const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  auth: AuthGuardData
): Promise<boolean> => {
  const router = inject(Router);
  const {keycloak, authenticated, grantedRoles} = auth;
  const loginPath = getDynamicRoute();

  if (!authenticated) {
    await keycloak.login({redirectUri: window.location.origin + state.url});
    return false;
  }

  if (state.url.includes(loginPath)) {
    router.navigate(['/dashboard']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[] | undefined;
  if (!requiredRoles || requiredRoles.length === 0) return true;

  // tekshir: realm yoki client roles
  const allRoles = [
    ...(grantedRoles.realmRoles ?? []),
    ...Object.values(grantedRoles.resourceRoles ?? {}).flat(),
  ];

  return requiredRoles.some(role => allRoles.includes(role)) || router.navigate(['/403']);
};

export const canActivateAuthGuard: CanActivateFn = createAuthGuard(isAccessAllowed);
