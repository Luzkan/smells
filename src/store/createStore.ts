import { applyMiddleware, createStore } from "redux"
import thunk from "redux-thunk"

import { composeWithDevTools } from "@redux-devtools/extension"

import { createRootReducer } from "./reducers"

const configureStore = (preloadedState: { window?: { isMobile?: boolean; width?: number } }) => {
  return createStore(createRootReducer(), preloadedState, composeWithDevTools(applyMiddleware(thunk)))
}

export default configureStore
