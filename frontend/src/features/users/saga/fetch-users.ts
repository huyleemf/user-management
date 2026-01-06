import { call, put, takeLatest } from "redux-saga/effects";
import { userActions } from "../redux/slice";
import { fetchUsers } from "../api";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";

function* fetchUsersSaga(
  action: PayloadAction<string | undefined>
): SagaIterator {
  try {
    const role = action.payload;
    const users = yield call(fetchUsers, role);
    yield put(userActions.fetchUsersSucceeded(users));
  } catch (err: Error | any) {
    yield put(
      userActions.fetchUsersFailed(err?.message || "Failed to fetch users")
    );
  }
}

export function* watchFetchUsers() {
  yield takeLatest(userActions.fetchUsersRequested.type, fetchUsersSaga);
}
