import { combineReducers } from "redux";
import auth from "./auth";
import chat from "./chat";
import job from "./job";

const rootReducer = combineReducers({
  auth,
  chat,
  job
});

export default rootReducer;
