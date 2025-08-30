import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string | null = isPlatformBrowser(this.platformId)
      ? localStorage.getItem('token')
      : null;

    const isAuthEndpoint: boolean = req.url.includes('/auth/login') || req.url.includes('/auth/register');

    let request = req;
    
    if (token && token.trim() !== '' && !isAuthEndpoint) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    
    return next.handle(request);
  }
}