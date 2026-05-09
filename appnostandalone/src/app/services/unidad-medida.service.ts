import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UnidadDeMedidaDTO, unidadDeMedidaResponse } from '../interfaces/unidad_de_medida.dto';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {
  private readonly apiBase = environment.apiUrl.endsWith('/api')
    ? environment.apiUrl
    : `${environment.apiUrl}/api`;
  private readonly baseUrl = `${this.apiBase}/unidades-medida`;

  constructor(private http: HttpClient) {}

  create(payload: Partial<UnidadDeMedidaDTO>): Observable<unidadDeMedidaResponse> {
    return this.http.post<unidadDeMedidaResponse>(this.baseUrl, payload);
  }

  getAll(): Observable<unidadDeMedidaResponse> {
    return this.http.get<unidadDeMedidaResponse>(this.baseUrl);
  }

  getById(id: number | string): Observable<unidadDeMedidaResponse> {
    return this.http.get<unidadDeMedidaResponse>(`${this.baseUrl}/${id}`);
  }

  update(id: number | string, payload: Partial<UnidadDeMedidaDTO>): Observable<unidadDeMedidaResponse> {
    return this.http.put<unidadDeMedidaResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number | string): Observable<unidadDeMedidaResponse> {
    return this.http.delete<unidadDeMedidaResponse>(`${this.baseUrl}/${id}`);
  }
}
