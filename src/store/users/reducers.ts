import { fetchTypes } from "store/fetchTypes"
import { Mobile, Width } from "types/store"

export const reducersWindow = {
  mobile: (state = { isMobile: false }, action: { type: string; data: Mobile }): Mobile => {
    switch (action.type) {
      case fetchTypes("window").FETCH_SUCCESS:
        return action.data
      default:
        return state
    }
  },
  width: (state = { width: undefined }, action: { type: string; data: Width }): Width => {
    switch (action.type) {
      case fetchTypes("width").FETCH_SUCCESS:
        return action.data
      default:
        return state
    }
  },
}
