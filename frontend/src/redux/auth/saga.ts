import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";
import { storage } from "@/shared/utils/storage";
import { login } from "@/data/auth";
import type { LoginResponse } from "@/data/auth/types";
import { authActions } from "./slice";

function* loginSaga(
  action: PayloadAction<{
    email: string;
    password: string;
  }>
): SagaIterator {
  try {
    const { email, password } = action.payload;
    const response: LoginResponse = yield call(login, { email, password });

    if (!response) {
      yield put(authActions.loginFailed("No response from server"));
      return;
    }

    if (!response.success) {
      yield put(authActions.loginFailed(response.message || "Login failed"));
      return;
    }

    if (response.accessToken) {
      storage.set("accessToken", response.accessToken);
    }
    if (response.user) {
      storage.set("user", response.user);
    }

    yield put(
      authActions.loginSucceeded({
        user: response.user,
        accessToken: response.accessToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      })
    );
  } catch (err: Error | any) {
    console.error("Login saga error:", err);
    yield put(authActions.loginFailed(err?.message || "Failed to login"));
  }
}

export function* watchAuth() {
  yield takeLatest(authActions.loginRequested.type, loginSaga);
}
