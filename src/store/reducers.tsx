import { combineReducers } from "redux"

import { reducersWindow } from "./users/reducers"

export const createRootReducer = () => {
  return combineReducers({
    window: reducersWindow.mobile,
    width: reducersWindow.width,
  })
}
