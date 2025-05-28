import { useSelector } from "react-redux";
import { useTypedDispatch } from "./hooks/useTypedDispatch";
import { getCounterValue, getUsersList } from "./app/selectors";
import "./App.css";

function App() {
  const count = useSelector(getCounterValue);
  const users = useSelector(getUsersList);
  const dispatch = useTypedDispatch();

  return (
    <>
      <div>
        <h1>Count: {count}</h1>
        <button
          onClick={() =>
            dispatch({ type: "[shiva dev] increment counter clicked" })
          }
        >
          Increment
        </button>
        <button
          onClick={() =>
            dispatch({ type: "[shiva dev] fetch counter async clicked" })
          }
        >
          Fetch Async
        </button>
        <button
          onClick={() => dispatch({ type: "[shiva dev] reset data clicked" })}
        >
          Reset
        </button>
        <button
          onClick={() => dispatch({ type: "[shiva dev] fetch users clicked" })}
        >
          users
        </button>
      </div>
      <div>
        <ul>
          {users.length > 0
            ? users.map((user) => <li key={user.id}>{user.name}</li>)
            : null}
        </ul>
      </div>
    </>
  );
}

export default App;
