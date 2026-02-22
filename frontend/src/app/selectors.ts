import type { RootState } from "./store";

export const getCounterValue = (state: RootState) => state.counter.value;
export const getUsersList = (state: RootState) => state.counter.users;
