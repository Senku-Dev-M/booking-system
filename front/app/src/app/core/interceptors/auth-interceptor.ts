import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';
import { UnauthorizedModalService } from '../services/unauthorized-modal-service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private unauthorizedModalService: UnauthorizedModalService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = isPlatformBrowser(this.platformId)
      ? this.authService.getToken()
      : null;

    const isAuthEndpoint: boolean = req.url.includes('/auth/login') || req.url.includes('/auth/register');

    let request = req;
    
    if (token && token.trim() !== '' && !isAuthEndpoint) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    } else if (!token && !isAuthEndpoint) {
      this.unauthorizedModalService.show('Unauthorized, please log in');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.unauthorizedModalService.show('Unauthorized, please log in');
        }
        return throwError(() => error);
      })
    );
  }
}
