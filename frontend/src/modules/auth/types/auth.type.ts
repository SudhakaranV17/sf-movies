// modules/auth/types/auth.type.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
  };
  token: string;
}
