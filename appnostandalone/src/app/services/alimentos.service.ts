import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlimentoDTO, alimentoResponse } from '../interfaces/alimentos.dto';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {
  private readonly apiBase = environment.apiUrl.endsWith('/api')
    ? environment.apiUrl
    : `${environment.apiUrl}/api`;
  private readonly baseUrl = `${this.apiBase}/alimentos`;

  constructor(private http: HttpClient) {}

  create(payload: Partial<AlimentoDTO>): Observable<alimentoResponse> {
    return this.http.post<alimentoResponse>(this.baseUrl, payload);
  }

  getAll(): Observable<alimentoResponse> {
    return this.http.get<alimentoResponse>(this.baseUrl);
  }

  getById(id: number | string): Observable<alimentoResponse> {
    return this.http.get<alimentoResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: number | string, payload: Partial<AlimentoDTO>): Observable<alimentoResponse> {
    return this.http.put<alimentoResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number | string): Observable<alimentoResponse> {
    return this.http.delete<alimentoResponse>(`${this.baseUrl}/${id}`);
  }
}
