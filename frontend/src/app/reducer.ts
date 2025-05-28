import type { AnyAction } from "redux-saga";
import type { User } from "../types/user";

export interface CounterState {
  value: number;
  users: User[];
}

const initialState: CounterState = {
  value: 0,
  users: [],
};

// AnyAction so the first load will set the inital state
export const counterReducer = (
  state: CounterState = initialState,
  action: AnyAction
): CounterState => {
  console.log(action.type);
  switch (action.type) {
    case "[shiva dev] increment counter clicked":
      return { ...state, value: state.value + 1 };

    case "[shiva dev] decrement counter clicked":
      return { ...state, value: state.value - 1 };

    case "[shiva dev] set counter value":
      return { ...state, value: action.payload.value };

    case "[shiva dev] reset data clicked":
      return initialState;

    case "[shiva dev] set users list":
      return { ...state, users: action.payload.users };

    default:
      return state;
  }
};
