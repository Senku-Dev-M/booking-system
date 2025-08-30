import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('redirectUrl', state.url);
    }
    
    alert('Debes iniciar sesión para acceder a esta página. Por favor, inicia sesión usando el botón en la parte superior.');
    this.router.navigate(['/hotels']);
    return false;
  }
}