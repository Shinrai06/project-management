import { all } from "redux-saga/effects";
import counterSaga from "./features/counter/counterSaga";
import usersSaga from "./features/users/usersSaga";

export default function* rootSaga() {
  yield all([counterSaga(), usersSaga()]);
}
