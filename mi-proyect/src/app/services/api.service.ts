import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginRequest, LoginResponse, UserDto } from '../interfaces/loginDtos';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const userId = 1;

    return this.http.get<UserDto | { user?: UserDto; data?: UserDto }>(`${this.apiUrl}/users/by-id/${userId}`).pipe(
      map((response) => {
        const user = Array.isArray(response)
          ? response[0]
          : (response as { user?: UserDto; data?: UserDto }).user ?? (response as { user?: UserDto; data?: UserDto }).data ?? (response as UserDto);

        if (!user || typeof user !== 'object' || !('id' in user)) {
          throw {
            status: 404,
            error: { message: 'Usuario no encontrado en el endpoint by-id' }
          };
        }

        return {
          token: `local-token-${(user as UserDto).id}`,
          user: user as UserDto
        };
      }),
      catchError((error) => throwError(() => error))
    );
  }

  register(userData: unknown): Observable<{ message?: string }> {
    return this.http.post<{ message?: string }>(`${this.apiUrl}/users/create`, userData);
  }

  getProfile(): Observable<unknown> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` });
    return this.http.get(`${this.apiUrl}/auth/profile`, { headers });
  }
}
