import { CategoriaDTO } from "./categoria.dto";
import { UnidadDeMedidaDTO } from "./unidad_de_medida.dto";

export interface AlimentoDTO {
    id: number;
    nombre: string;
    categoria: CategoriaDTO;
    peso: number;
    unidad_medida: UnidadDeMedidaDTO;
    stock: number;
    precio_venta: number;
    created_at: string;
    updated_at: string;
}

export interface alimentoResponse {
    success: boolean;
    message?: string;
    alimentos?: AlimentoDTO[];  
}