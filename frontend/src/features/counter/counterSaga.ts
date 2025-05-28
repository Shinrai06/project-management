import { takeEvery, call, put, delay } from "redux-saga/effects";

function* fetchCounterWorker() {
  yield delay(500);
  yield put({
    type: "[shiva dev] set counter value",
    payload: { value: Math.floor(Math.random() * 100) },
  });
}

function* fetchUsersWorker(): any {
  try {
    const users = yield call(fetchUsers);
    yield put({
      type: "[shiva dev] set users list",
      payload: { users: users },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    yield put({ type: "[shiva dev] fetch users failed", error });
  }
}

export async function fetchUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const usersList = await response.json();
  return usersList;
}

export default function* counterSaga(): any {
  yield takeEvery(
    "[shiva dev] fetch counter async clicked",
    fetchCounterWorker
  );

  const users = yield takeEvery(
    "[shiva dev] fetch users clicked",
    fetchUsersWorker
  );
  console.log("shiva ", users);
}
