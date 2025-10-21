import {ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {provideAnimations} from '@angular/platform-browser/animations';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {LanguageService} from './service/translate/language.service';

import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  provideKeycloak, UserActivityService, withAutoRefreshToken
} from 'keycloak-angular';
import {httpCodeInterceptor} from './configuration/interceptors/httpcode.interceptor';

const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:9050|http:\/\/192\.168\.58\.1:9050|https:\/\/api\.ruzi\.uz)(\/.*)?$/i,
  bearerPrefix: 'Bearer'
});

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
        silentCheckSsoRedirectUri: 'silent-check-sso.html',
        checkLoginIframe: true
      },
      features: [
        withAutoRefreshToken({
          onInactivityTimeout: 'logout',
          sessionTimeout: 60000
        })
      ],
      providers: [AutoRefreshTokenService, UserActivityService]
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
