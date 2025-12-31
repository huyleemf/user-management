import { all, fork } from "redux-saga/effects";
import userSaga from "@/features/users/saga";

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    // Thêm các feature sagas khác ở đây
    // fork(teamSaga),
    // fork(authSaga),
  ]);
}
