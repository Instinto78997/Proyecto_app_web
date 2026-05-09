import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginDTO, RegisterDTO } from '../interfaces/auth.dto';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'current_user';
  private readonly isBrowser: boolean;
  private readonly authState$ = new BehaviorSubject<boolean>(false);
  private readonly apiBase = environment.apiUrl.endsWith('/api')
    ? environment.apiUrl
    : `${environment.apiUrl}/api`;

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.authState$.next(this.readStoredAuth());
  }

  register(payload: RegisterDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBase}/users/create`, payload);
  }

  login(payload: LoginDTO): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBase}/auth/login`, payload);
  }

  setSession(response: AuthResponse): void {
    if (!this.isBrowser) return;
    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
    }
    if (response.user) {
      const userId = response.user.id ?? response.user.id_user;
      if (userId !== undefined && userId !== null) {
        localStorage.setItem('user_id', userId.toString());
      }
      const userJson = JSON.stringify(response.user);
      localStorage.setItem('current_user', userJson);
      localStorage.setItem('currentUser', userJson);
      localStorage.setItem('user', userJson);
    }
    this.authState$.next(true);
  }

  clearSession(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.tokenKey);
    this.authState$.next(false);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return true;
    return this.authState$.getValue() || this.readStoredAuth();
  }

  getCurrentUser(): any {
    if (!this.isBrowser) return null;
    const raw =
      localStorage.getItem('current_user') ||
      localStorage.getItem('currentUser') ||
      localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  logout(): Observable<boolean> {
    this.clearSession();
    return of(true);
  }

  private readStoredAuth(): boolean {
    if (!this.isBrowser) return false;
    const hasToken = !!localStorage.getItem(this.tokenKey);
    return hasToken;
  }
}
