export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserDto {
  id: number;
  username: string;
  email?: string;
  nombre?: string;
  telephone?: string;
  bio?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
  user: UserDto;
}
