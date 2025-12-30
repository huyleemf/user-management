import { watchFetchUsers } from "@/features/users/saga/fetch-users";
import { all, fork } from "redux-saga/effects";

export default function* saga() {
  yield all([fork(watchFetchUsers)]);
}
