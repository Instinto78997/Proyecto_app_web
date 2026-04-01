import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  getCurrentUser(): unknown {
    const current = localStorage.getItem('currentUser') ?? localStorage.getItem('user');
    return current ? JSON.parse(current) : null;
  }

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem('token'));
  }

  obtenerPerfil(): Observable<unknown> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: { 'x-auth-token': token ?? '' }
    });
  }

  actualizarPerfil(data: unknown): Observable<unknown> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/profile`, data, {
      headers: { 'x-auth-token': token ?? '' }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  }
}
