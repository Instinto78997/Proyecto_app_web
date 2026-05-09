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
