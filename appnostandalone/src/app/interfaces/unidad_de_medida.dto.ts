export interface UnidadDeMedidaDTO {
    id: number;
    codigo: string;
    nombre: string;
    created_at: string;
    updated_at: string;
}

export interface unidadDeMedidaResponse {
    success: boolean;
    message?: string;
    medidas?: UnidadDeMedidaDTO[];  
}