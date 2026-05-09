export interface CategoriaDTO {
    id: number;
    nombre: string;
    descripcion: string | null;
    created_at: string;
    updated_at: string;
}

export interface categoriaResponse {
    success: boolean;
    message?: string;
    categorias?: CategoriaDTO[];  
}