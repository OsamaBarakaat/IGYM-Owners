import { createStore, combineReducers } from "redux";
import { userReducer } from "./Reducers/User.reducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import { themeReducer } from "./Reducers/Theme.reducer";
import { unReadNotificationReducer } from "./Reducers/unReadNotification";

const reducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  unReadNotification: unReadNotificationReducer,
});
const theme = localStorage.getItem("theme");
const initState = {
  user: {},
  theme: theme || "light",
  unReadNotification: 0,
};

const store = createStore(reducer, initState, composeWithDevTools());

export default store;
