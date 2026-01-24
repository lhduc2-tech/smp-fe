export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  roles: string[];
  permissions: string[];
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
}
