export type AuthUser = {
  userId: string;
  username: string;
  email: string;
  role: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
};

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};
