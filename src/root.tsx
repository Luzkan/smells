import App from "app"
import React from "react"

interface Props {
  element: JSX.Element
}

export const wrapRootElement = ({ element }: Props) => {
  return <App element={element} />
}
