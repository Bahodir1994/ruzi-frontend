import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {providePrimeNG} from 'primeng/config';
import PresetWhiteBlue from './configuration/theme/preset-white';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {keycloakInterceptor} from './configuration/interceptors/keycloak.interceptor';
import {httpCodeInterceptor} from './configuration/interceptors/httpcode.interceptor';
import {authInterceptor} from './configuration/interceptors/auth.interceptor';
import {loadingInterceptor} from './configuration/interceptors/loading.interceptor';
import {ToastModule} from 'primeng/toast';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {LanguageService} from './service/translate/language.service';
import {KeycloakService} from 'keycloak-angular';
import {DialogService} from 'primeng/dynamicdialog';
import {initializer} from './configuration/authentication/keycloak-init';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import Aura from '@primeuix/themes/aura';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([
      keycloakInterceptor,
      httpCodeInterceptor,
      authInterceptor,
      loadingInterceptor,
    ])),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.p-dark' } },
    }),
    importProvidersFrom(
      ToastModule,
      BrowserAnimationsModule,
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
    KeycloakService,
    DialogService,
    {
      provide: APP_INITIALIZER,
      useFactory: (languageService: LanguageService) => () => languageService.initLanguage(),
      deps: [LanguageService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [KeycloakService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: () => loadingInterceptor,
      multi: true
    }
  ]
};
