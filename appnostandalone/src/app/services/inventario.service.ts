import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alimento {
  id: number;
  nombre: string;
  categoria_id: number;
  peso: number;
  unidad_medida_id: number;
  stock: number;
  precio_venta: number;
  createdAt?: Date;
  updatedAt?: Date;
  categoria?: {
    id: number;
    nombre: string;
    descripcion?: string | null;
  };
  unidad_medida?: {
    id: number;
    codigo: string;
    nombre?: string | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(`${this.apiUrl}/alimentos`);
  }

  getById(id: number): Observable<Alimento> {
    return this.http.get<Alimento>(`${this.apiUrl}/alimentos/${id}`);
  }

  create(alimento: Omit<Alimento, 'id'>): Observable<Alimento> {
    return this.http.post<Alimento>(`${this.apiUrl}/alimentos`, alimento);
  }

  update(id: number, alimento: Partial<Alimento>): Observable<Alimento> {
    return this.http.put<Alimento>(`${this.apiUrl}/alimentos/${id}`, alimento);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alimentos/${id}`);
  }
}
