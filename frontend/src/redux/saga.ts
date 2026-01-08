import { all, fork } from "redux-saga/effects";
import { watchAuth } from "./auth/saga";
import { watchFetchUsers } from "./users/saga";

export default function* saga() {
  yield all([fork(watchFetchUsers), fork(watchAuth)]);
}
