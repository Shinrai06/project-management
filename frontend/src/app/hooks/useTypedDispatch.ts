import { useDispatch } from "react-redux";
import type { counterEvents } from "../app/events";

export const useTypedDispatch = () => {
  const dispatch = useDispatch();

  // Wrap dispatch with typed event
  const typedDispatch = (action: counterEvents) => {
    return dispatch(action);
  };

  return typedDispatch;
};
