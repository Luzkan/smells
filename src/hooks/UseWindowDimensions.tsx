import _ from "lodash"
import { useEffect, useState } from "react"

type WindowDimensions = {
  width: number | undefined
  height: number | undefined
}

const useWindowDimensions = (): WindowDimensions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: undefined,
    height: undefined,
  })

  const handleResize = _.debounce(() =>
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  )

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return (): void => window.removeEventListener("resize", handleResize)
  }, [])

  return windowDimensions
}

export default useWindowDimensions
