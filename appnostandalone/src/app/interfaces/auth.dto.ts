export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  nombre?: string;
  telephone?: string;
  bio?: string;
}

export interface AuthUser {
  id?: number;
  id_user?: number;
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  telefono?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}
