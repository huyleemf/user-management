import type { AuthUser } from "../../redux/auth/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: string;
  success: boolean;
  message: string;
  errors: string[];
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
