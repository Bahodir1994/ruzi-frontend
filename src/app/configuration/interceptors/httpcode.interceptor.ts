import {HttpErrorResponse, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, tap, throwError} from 'rxjs';
import {ValidationService} from '../../service/validations/validation.service';
import {FormStateService} from '../../service/states/form-state.service';
import {MessageService, ToastMessageOptions} from 'primeng/api';
import {MessageEnum} from '../../component/enums/MessageEnum';
import {apiConfigData} from '../resursurls/apiConfigData';
import {TranslateService} from '@ngx-translate/core';

const activeMessages = new Map<string, number>();

export const httpCodeInterceptor: HttpInterceptorFn = (req, next) => {
  const validationService = inject(ValidationService);
  const formStateService = inject(FormStateService);
  const messageService = inject(MessageService);
  const translateService = inject(TranslateService);

  const findApiConfigOld1 = (url: string, method: string) => {
    const normalizedUrl = url.split('?')[0].replace(/\/+$/, '');
    for (const module of apiConfigData) {
      for (const api of module.list) {
        const apiUrl = api.url.replace(/\/+$/, '');
        if (
          normalizedUrl.endsWith(apiUrl) &&
          api.method.toLowerCase() === method.toLowerCase()
        ) {
          return api;
        }
      }
    }
    return null;
  };

  const findApiConfig = (url: string, method: string) => {
    const normalizedUrl = url.split('?')[0].replace(/\/+$/, '');

    let path = normalizedUrl;
    try {
      // Agar absolute URL bo‘lsa (http://...)
      path = new URL(normalizedUrl).pathname;
    } catch {
      // Agar nisbiy bo‘lsa (/api/...) – o‘sha holatida qolaveradi
      path = normalizedUrl;
    }

    path = path.replace(/\/+$/, '');

    for (const module of apiConfigData) {
      for (const api of module.list) {
        const apiPath = api.url.replace(/\/+$/, '');
        const sameMethod =
          api.method.toLowerCase() === method.toLowerCase();

        const match =
          path === apiPath ||          // /api/items/delete
          path.startsWith(apiPath + '/'); // /api/items/delete/:id

        if (sameMethod && match) {
          return api;
        }
      }
    }

    return null;
  };


  const showUniqueToast = (msg: ToastMessageOptions) => {
    const key = `${msg.severity}|${msg.summary}|${msg.detail}`;
    const now = Date.now();
    if (activeMessages.has(key) && now - (activeMessages.get(key) || 0) < 2000) return;
    activeMessages.set(key, now);
    messageService.add(msg);
    setTimeout(() => activeMessages.delete(key), 5000);
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiConfig = findApiConfig(req.url, req.method);

      if (apiConfig?.showWarning) {
        let msg: ToastMessageOptions | null = null;

        switch (error.status) {
          case 400:
            const forms = formStateService.getForms();
            for (const form of forms) {
              validationService.handleApiErrors(error.error.data?.errors, form);
            }
            msg = {
              severity: 'error',
              summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
              detail: translateService.instant(MessageEnum.CONFIRM_REJECT_400),
            };
            break;

          case 403:
            msg = {
              severity: 'error',
              summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
              detail: translateService.instant(error.error.message),
            };
            break;

          case 422:
            msg = {
              severity: 'error',
              summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
              detail: translateService.instant(error.error.message),
            };
            break;

          case 404:
            msg = {
              severity: 'error',
              summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
              detail: translateService.instant(MessageEnum.CONFIRM_REJECT_404),
            };
            break;

          case 500:
            msg = {
              severity: 'error',
              summary: translateService.instant(MessageEnum.CONFIRM_REJECT),
              detail: translateService.instant(MessageEnum.CONFIRM_REJECT_500),
            };
            break;
        }

        if (msg) showUniqueToast(msg);
      }

      return throwError(() => error);
    }),
    tap((event) => {
      if (event instanceof HttpResponse) {
        const apiConfig = findApiConfig(req.url, req.method);

        if (apiConfig?.showSuccess) {
          if (event.status === 200) {
            showUniqueToast({
              icon: 'pi pi-check-circle text-green-600',
              severity: 'contrast',
              summary: translateService.instant(MessageEnum.CONFIRM_SUCCESS),
              detail: translateService.instant(MessageEnum.CONFIRM_SUCCESS_200),
            });
          }

          if (event.status === 204) {
            showUniqueToast({
              icon: 'pi pi-check-circle text-green-600',
              severity: 'contrast',
              summary: translateService.instant(MessageEnum.CONFIRM_SUCCESS),
              detail: translateService.instant(MessageEnum.CONFIRM_SUCCESS_204),
            });
          }

          if (event.status === 302) {
            const redirectUrl = event.headers.get('Location');
            if (redirectUrl) {
              window.location.href = redirectUrl;
            }
          }
        }
      }
    })
  );
};
