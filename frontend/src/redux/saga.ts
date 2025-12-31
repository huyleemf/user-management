import { watchAuth } from "@/features/auth/saga/auth";
import { watchFetchUsers } from "@/features/users/saga/fetch-users";
import { all, fork } from "redux-saga/effects";
import userSaga from "@/features/users/saga";

export default function* saga() {
  yield all([fork(watchFetchUsers), fork(watchAuth)]);
}
