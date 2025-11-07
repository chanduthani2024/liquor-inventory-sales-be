export interface RegisterDto {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
  };
  token?: string;
}