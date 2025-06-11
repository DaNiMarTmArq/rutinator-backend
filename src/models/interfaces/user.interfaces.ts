export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
  image: string | null;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserRegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface UserAuthenticatedResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  token: string;
}

export interface UserUpdate {
  name: string;
  email: string;
  username: string;
  password: string;
  image: Buffer | null;
}