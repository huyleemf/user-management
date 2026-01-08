import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchManagers,
  fetchMembers,
  fetchUsers,
  fetchUserTeam,
} from "@/data/users";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { userActions } from "./slice";

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

function* fetchMembersSaga(): SagaIterator {
  try {
    const users = yield call(fetchMembers);
    yield put(userActions.fetchMembersSucceeded(users));
  } catch (err: Error | any) {
    yield put(
      userActions.fetchMembersFailed(
        err?.message || "Failed to fetch users by role"
      )
    );
  }
}
function* fetchManagersSaga(): SagaIterator {
  try {
    const users = yield call(fetchManagers);
    yield put(userActions.fetchManagersSucceeded(users));
  } catch (err: Error | any) {
    yield put(
      userActions.fetchManagersFailed(
        err?.message || "Failed to fetch users by role"
      )
    );
  }
}

function* fetchUserTeamSaga(
  action: PayloadAction<string | undefined>
): SagaIterator {
  try {
    const userId = action.payload;
    const users = yield call(fetchUserTeam, userId ?? "");
    yield put(userActions.fetchUserTeamsSucceeded(users));
  } catch (err: Error | any) {
    yield put(
      userActions.fetchUserTeamsFailed(
        err?.message || "Failed to fetch users by role"
      )
    );
  }
}

export function* watchFetchUsers() {
  yield takeLatest(userActions.fetchUsersRequested.type, fetchUsersSaga);
  yield takeLatest(userActions.fetchMembersRequested.type, fetchMembersSaga);
  yield takeLatest(userActions.fetchManagersRequested.type, fetchManagersSaga);
  yield takeLatest(userActions.fetchUserTeamsRequested.type, fetchUserTeamSaga);
}
