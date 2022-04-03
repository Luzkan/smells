import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { Provider } from "react-redux"
import configureStore from "store/createStore"
import { isMobile } from "utils/isMobile"
import theme from "utils/theme"

import { ThemeProvider } from "@material-ui/core/styles"

interface Props {
  element: JSX.Element
}

const App = ({ element }: Props) => {
  const width = useWindowDimensions().width
  const store = configureStore({ window: { isMobile: isMobile(width), width: width || undefined } })

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>{element}</Provider>
    </ThemeProvider>
  )
}

export default App
