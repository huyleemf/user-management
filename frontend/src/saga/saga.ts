import { watchAuth } from "@/pages/auth/saga/auth";
import { all, fork } from "redux-saga/effects";
import { watchFetchUsers } from "./user";

export default function* saga() {
  yield all([fork(watchFetchUsers), fork(watchAuth)]);
}
