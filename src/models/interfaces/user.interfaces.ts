export interface User {
  fullName: string;
  email: string;
  userName: string;
  password: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserAuthenticatedResponse {
  fullName: string;
  email: string;
  userName: string;
  token: string;
}
