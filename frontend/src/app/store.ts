import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./reducer";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

// update the reducers you want to use here
export const store = configureStore({
  reducer: {
    counter: rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
