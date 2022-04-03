import { fetchTypes } from "store/fetchTypes"

export type Dispatch = (arg0: { type: string; data?: any; error?: any }) => void // eslint-disable-line

export const creatorsWindow = {
  setMobile: (isMobile: boolean) => {
    return async (dispatch: Dispatch) => {
      dispatch({ type: fetchTypes("window").FETCH_SUCCESS, data: { isMobile: isMobile } })
    }
  },
  setWidth: (value: number | undefined) => {
    return async (dispatch: Dispatch) => {
      dispatch({ type: fetchTypes("width").FETCH_SUCCESS, data: { width: value } })
    }
  },
}
