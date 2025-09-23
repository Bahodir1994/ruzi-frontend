import {inject} from '@angular/core';
import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {KeycloakService} from 'keycloak-angular';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('⚠️ Токен истек или у пользователя нет доступа!');

        // ❗ Lazy load Router to avoid circular DI
        setTimeout(() => {
          const router = inject(Router);
          router.navigate(['/401']);
        });

        // Yoki (agar NgZone kerak bo‘lsa):
        // const zone = inject(NgZone);
        // zone.run(() => inject(Router).navigate(['/401']));
      }

      return throwError(() => error);
    })
  );
};
