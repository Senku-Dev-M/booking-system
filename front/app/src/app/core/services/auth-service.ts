import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'auth_user';
  private readonly EXPIRY_KEY = 'auth_expiry';
  private readonly TOKEN_DURATION = 60 * 60 * 1000

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  public isAuthenticated = signal<boolean>(false);
  public currentUser = signal<User | null>(null);

  private readonly API_URL = 'http://localhost:3000/api/v1';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.checkStoredAuth();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private checkStoredAuth(): void {
    if (!this.isBrowser()) {
      return;
    }
    
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    const expiryStr = localStorage.getItem(this.EXPIRY_KEY);

    if (token && userStr && expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      const now = Date.now();

      if (now < expiry) {
        const user = JSON.parse(userStr);
        this.setAuthState(user, token, expiry);
      } else {
        this.clearAuthStorage();
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await this.http.post<{token: string}>(
        `${this.API_URL}/auth/login`,
        {
          username: credentials.email,
          password: credentials.password
        }
      ).toPromise();
      
      if (response?.token) {
        const user: User = {
          id: 'user-id',
          email: credentials.email,
          name: credentials.email.split('@')[0]
        };
        
        const expiry = Date.now() + this.TOKEN_DURATION;
        this.storeAuthData(response.token, user, expiry);
        this.setAuthState(user, response.token, expiry);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }



  logout(): void {
    this.clearAuthStorage();
    this.clearAuthState();
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(this.TOKEN_KEY);
  }

  private storeAuthData(token: string, user: User, expiry: number): void {
    if (!this.isBrowser()) {
      return;
    }
    
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.EXPIRY_KEY, expiry.toString());
  }

  private setAuthState(user: User, token: string, expiry: number): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    this.currentUserSubject.next(user);

    const timeUntilExpiry = expiry - Date.now();
    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        this.logout();
      }, timeUntilExpiry);
    }
  }

  private clearAuthState(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.currentUserSubject.next(null);
  }

  private clearAuthStorage(): void {
    if (!this.isBrowser()) {
      return;
    }
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
  }

  async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.isBrowser()) {
      return false;
    }
    
    const expiryStr = localStorage.getItem(this.EXPIRY_KEY);
    if (!expiryStr) return false;

    const expiry = parseInt(expiryStr, 10);
    const now = Date.now();
    const timeUntilExpiry = expiry - now;

    if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
      const newExpiry = now + this.TOKEN_DURATION;
      localStorage.setItem(this.EXPIRY_KEY, newExpiry.toString());
      return true;
    }

    return timeUntilExpiry > 0;
  }
}