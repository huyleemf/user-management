import { all, fork } from "redux-saga/effects";
import { watchFetchUsers } from "./fetch-users";

export default function* userSaga() {
  yield all([fork(watchFetchUsers)]);
}
