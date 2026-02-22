import { takeEvery, put, delay } from "redux-saga/effects";

function* counterWorker(): any {
  yield delay(500);
  yield put({
    type: "[shiva dev] set counter value",
    payload: { value: Math.floor(Math.random() * 100) },
  });
}

export default function* counterSaga(): Generator<any, any, any> {
  yield takeEvery("[shiva dev] fetch counter async clicked", counterWorker);

  // can also be writter as for more control (wait for multiple events)
  /*
  while (true) {
    yield take("[shiva dev] fetch users clicked"); // will be paused by the generator
    yield call(fetchUsersWorker); // replaced with fork for takeEvery
  }

  takeEvery: while + take + fork
  */
}
