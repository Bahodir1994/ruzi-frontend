import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {LanguageService} from '../../service/translate/language.service';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const langService = inject(LanguageService);
  const lang = langService.getCurrentLanguage() ? langService.getCurrentLanguage() : 'oz';

  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': lang
    }
  });

  return next(modifiedReq);
};
