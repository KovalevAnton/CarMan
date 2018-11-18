import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "../reducers/rootReducer";
import socketEvents from "../middleware/socketEvents";

let middleware = [thunk, socketEvents];

if (true) {
  middleware = [...middleware, logger];
} else {
  middleware = [...middleware];
}

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, compose(applyMiddleware(...middleware)));
}
