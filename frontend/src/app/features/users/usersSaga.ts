import { takeEvery, call, put } from "redux-saga/effects";

function* fetchUsersWorker(): Generator<any, any, any> {
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

async function fetchUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const usersList = await response.json();
  return usersList;
}

export default function* usersSaga(): Generator<any, any, any> {
  yield takeEvery("[shiva dev] fetch users clicked", fetchUsersWorker);
}
