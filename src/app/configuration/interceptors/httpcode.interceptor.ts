import {HttpErrorResponse, HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, tap, throwError} from 'rxjs';
import {ValidationService} from '../../service/validations/validation.service';
import {FormStateService} from '../../service/states/form-state.service';
import {MessageService} from 'primeng/api';
import {MessageEnum} from '../../component/enums/MessageEnum';
import {apiConfigData} from '../resursurls/apiConfigData';

export const httpCodeInterceptor: HttpInterceptorFn = (req, next) => {
  const validationService = inject(ValidationService);
  const formStateService = inject(FormStateService);
  const messageService = inject(MessageService);

  const findApiConfig = (url: string, method: string) => {
    for (const module of apiConfigData) {
      for (const api of module.list) {
        const normalizedReqUrl = req.url.split('?')[0]; // query paramsni olib tashlaymiz
        if (normalizedReqUrl.endsWith(api.url)) {
          return api;
        }
      }
    }
    return null;
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const apiConfig = findApiConfig(req.url, req.method);
      //const forms = formStateService.getForms();

      if (apiConfig?.showWarning && error.status === 400) {
        const forms = formStateService.getForms();

        for (const form of forms) {
          validationService.handleApiErrors(error.error.data.errors, form);
        }

        messageService.add({
          severity: 'error',
          summary: MessageEnum.CONFIRM_REJECT,
          detail: MessageEnum.CONFIRM_REJECT_400,
        });
      }

      if (apiConfig?.showWarning && error.status === 403) {
        messageService.add({
          severity: 'error',
          summary: MessageEnum.CONFIRM_REJECT,
          detail: error.error.message,
        });
      }

      if (apiConfig?.showWarning && error.status === 422) {
        messageService.add({
          severity: 'error',
          summary: MessageEnum.CONFIRM_REJECT,
          detail: error.error.message,
        });
      }

      if (apiConfig?.showWarning && error.status === 404) {
        messageService.add({
          severity: 'error',
          summary: MessageEnum.CONFIRM_REJECT,
          detail: MessageEnum.CONFIRM_REJECT_404,
        });
      }

      if (apiConfig?.showWarning && error.status === 500) {
        messageService.add({
          severity: 'error',
          summary: MessageEnum.CONFIRM_REJECT,
          detail: MessageEnum.CONFIRM_REJECT_500,
        });
      }

      return throwError(() => error);
    }),
    tap((event) => {
      if (event instanceof HttpResponse) {
        const apiConfig = findApiConfig(req.url, req.method);

        if (apiConfig?.showSuccess) {
          if (event.status === 200) {
            messageService.add({
              severity: 'success',
              summary: MessageEnum.CONFIRM_SUCCESS,
              detail: MessageEnum.CONFIRM_SUCCESS_200,
            });
          }

          if (event.status === 204) {
            messageService.add({
              severity: 'success',
              summary: MessageEnum.CONFIRM_SUCCESS,
              detail: MessageEnum.CONFIRM_SUCCESS_204,
            });
          }

          if (event.status === 302) {
            const redirectUrl = event.headers.get('Location');
            if (redirectUrl) {
              window.location.href = redirectUrl;  // Foydalanuvchini Magic Linkga yo'naltirish
            }
          }
        }
      }
    })
  );
};
