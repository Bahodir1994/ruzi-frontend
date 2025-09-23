import {HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from "../authentication/auth.service";
import {inject} from "@angular/core";
import {from, switchMap} from "rxjs";

export const keycloakInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // const languageService = inject(LanguageService);

  return from(authService.getToken()!).pipe(
    switchMap((token) => {
      // const currentLang = languageService?.getCurrentLanguage ? languageService.getCurrentLanguage() : 'uz';
      const currentLang = localStorage.getItem('language') || 'oz';

      const headers: { [header: string]: string } = {
        'Accept-Language': currentLang
      };

      if (token) {
        const clonedReq = req.clone({
          setHeaders: token
            ? {Authorization: `Bearer ${token}`, ...headers}
            : headers
        });

        return next(clonedReq);
      }

      // if (token) {
      //   const clonedReq = req.clone({
      //     setHeaders: {
      //       Authorization: `Bearer ${token}`,
      //       'Accept-Language': currentLang
      //     }
      //   });
      //   return next(clonedReq);
      // }

      return next(req);
    })
  );
};
