import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from localStorage
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      // In a real app, you would add an Authorization header with a JWT token
      // For now, we'll just clone the request
      request = request.clone({
        setHeaders: {
          // Authorization: `Bearer ${token}` // Uncomment when you implement JWT
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Auto logout if 401 response returned from api
          localStorage.removeItem('currentUser');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
