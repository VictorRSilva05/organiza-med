import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);
  const token = authService.getToken();

  const apiBaseUrl = 'https://localhost:7043/api';

  if (token && req.url.startsWith(apiBaseUrl)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((err: any) => {
        return handleError(err, authService, notificationService, router);
      })
    );
  }

  return next(req).pipe(
    catchError((err: any) => {
      return handleError(err, authService, notificationService, router);
    })
  );
};

function handleError(
  err: any,
  authService: AuthService,
  notificationService: NotificationService,
  router: Router
): Observable<never> {

  if (err instanceof HttpErrorResponse) {

    if (err.status === 401) {
      notificationService.showError('Sua sessão expirou. Por favor, faça login novamente.');
      authService.logout();
      router.navigate(['/login']);
    }

    else {
      const errorMsg = err.error?.message || err.statusText;
      notificationService.showError(`Erro: ${errorMsg}`);
    }
  }

  return throwError(() => err);
}
