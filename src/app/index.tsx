import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { Provider } from "react-redux"
import configureStore from "store/createStore"
import { isMobile } from "utils/isMobile"
import theme from "utils/theme"

import { StyledEngineProvider, Theme, ThemeProvider } from "@mui/material/styles"

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

interface Props {
  element: JSX.Element
}

const App = ({ element }: Props) => {
  const width = useWindowDimensions().width
  const store = configureStore({ window: { isMobile: isMobile(width), width: width || undefined } })

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>{element}</Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
