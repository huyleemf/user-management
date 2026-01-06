import type { PayloadAction } from "@reduxjs/toolkit";
import { initialState, type AuthState } from "./types";

export const authReducer = {
  loginRequested(
    state: AuthState,
    action: PayloadAction<{
      email: string;
      password: string;
    }>
  ) {
    state.loading = true;
    state.error = null;
  },
  loginSucceeded(state: AuthState, action: PayloadAction<AuthState>) {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload.user;
    state.accessToken = action.payload.accessToken;
  },
  loginFailed(state: AuthState, action: PayloadAction<string>) {
    state.loading = false;
    state.error = action.payload;
  },
  logout(state: AuthState) {
    return initialState;
  },
};
