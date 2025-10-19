import {ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {LanguageService} from './service/translate/language.service';

import {
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  provideKeycloak
} from 'keycloak-angular';
import {httpCodeInterceptor} from './configuration/interceptors/httpcode.interceptor';

// 🔧 token faqat API’laringizga qo‘shilsin (localhost va dev serverlar)
const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:9050|http:\/\/192\.168\.58\.1:9050|https:\/\/api\.ruzi\.uz)(\/.*)?$/i,
  bearerPrefix: 'Bearer'
});

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const getRedirectUri = () => {
  // Agar SPA hali route yuklanmagan bo‘lsa — localStorage orqali oldingi route’ni qayta tiklash
  const lastRoute = localStorage.getItem('lastRoute');
  if (lastRoute) return window.location.origin + lastRoute;
  return window.location.href;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',
        realm: 'ruzi-realm',
        clientId: 'ruzi'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        redirectUri: window.location.href + '/'
      }
    }),
    {provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [apiCondition]},
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor, httpCodeInterceptor])),
    providePrimeNG({
      theme: {preset: Aura, options: {darkModeSelector: '.p-dark'}},
    }),
    importProvidersFrom(
      ToastModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'oz'
      })
    ),
    MessageService,
    LanguageService,
    DialogService,
  ]
};
