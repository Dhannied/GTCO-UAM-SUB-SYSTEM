import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  
  // Get the auth token from localStorage
  const currentUserStr = localStorage.getItem('currentUser');
  
  if (currentUserStr) {
    try {
      const currentUser = JSON.parse(currentUserStr);
      const token = currentUser.accessToken;
      
      if (token) {
        // Clone the request and add the authorization header
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.error('Error parsing currentUser from localStorage', e);
    }
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Auto logout if 401 response returned from api
        localStorage.removeItem('currentUser');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

