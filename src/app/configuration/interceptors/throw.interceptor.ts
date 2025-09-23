import {HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

export const throwInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      if (error instanceof Error) {
        console.error('CUSTOM THROW ERROR INTERCEPTED:', {
          message: error.message,
          stack: error.stack
        });

        // Можно отправлять в систему мониторинга
        // someMonitoringService.log(error);
      }

      return throwError(() => error); // Прокидываем ошибку дальше
    })
  );
};
