import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoriaDTO, categoriaResponse } from '../interfaces/categoria.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly apiBase = environment.apiUrl.endsWith('/api')
    ? environment.apiUrl
    : `${environment.apiUrl}/api`;
  private readonly baseUrl = `${this.apiBase}/categorias`;

  constructor(private http: HttpClient) {}

  create(payload: Partial<CategoriaDTO>): Observable<categoriaResponse> {
    return this.http.post<CategoriaDTO>(this.baseUrl, payload).pipe(
      map((data) => ({ success: true, categorias: data ? [data] : [] }))
    );
  }

  getAll(): Observable<categoriaResponse> {
    return this.http.get<CategoriaDTO[] | categoriaResponse>(this.baseUrl).pipe(
      map((data) => {
        if (Array.isArray(data)) return { success: true, categorias: data };
        return data;
      })
    );
  }

  getById(id: number | string): Observable<categoriaResponse> {
    return this.http.get<CategoriaDTO>(`${this.baseUrl}/${id}`).pipe(
      map((data) => ({ success: true, categorias: data ? [data] : [] }))
    );
  }

  update(id: number | string, payload: Partial<CategoriaDTO>): Observable<categoriaResponse> {
    return this.http.put<CategoriaDTO>(`${this.baseUrl}/${id}`, payload).pipe(
      map((data) => ({ success: true, categorias: data ? [data] : [] }))
    );
  }

  delete(id: number | string): Observable<categoriaResponse> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      map(() => ({ success: true }))
    );
  }
}
