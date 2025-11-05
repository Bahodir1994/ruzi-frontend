import {ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideTranslateService} from '@ngx-translate/core';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {LanguageService} from './service/translate/language.service';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';

import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken
} from 'keycloak-angular';
import {httpCodeInterceptor} from './configuration/interceptors/httpcode.interceptor';
import {languageInterceptor} from './configuration/interceptors/language.interceptor';

const globalCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /.*/,
  bearerPrefix: 'Bearer'
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideZonelessChangeDetection(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      }),
      defaultLanguage: 'oz'
    }),
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',
        realm: 'ruzi-realm',
        clientId: 'ruzi'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: 'silent-check-sso.html',
        checkLoginIframe: true
      },
      features: [
        withAutoRefreshToken({
          onInactivityTimeout: 'logout',
          sessionTimeout: 3600000
        })
      ],
      providers: [AutoRefreshTokenService, UserActivityService]
    }),
    {provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG, useValue: [globalCondition]},
    provideHttpClient(withInterceptors([
      includeBearerTokenInterceptor,
      httpCodeInterceptor,
      languageInterceptor
    ])),
    providePrimeNG({
      theme: {preset: Aura, options: {darkModeSelector: '.p-dark'}},
    }),
    importProvidersFrom(ToastModule),
    MessageService,
    LanguageService,
    DialogService,
  ]
};
