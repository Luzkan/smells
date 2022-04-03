import { createTheme } from "@material-ui/core/styles"

export const SMELL_PAGE_FONTS = '"TT Norms Pro", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif'

const scrollBarColorMain = "#2c2c2c"
const scrollBarColorActive = "#474747"

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#242424",
    },
    background: {
      default: "#e2e2e2",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "*": {
          scrollbarColor: scrollBarColorMain + " transparent",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            backgroundColor: "transparent",
            width: 6,
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: scrollBarColorMain,
            borderRadius: 0,
            minHeight: 24,
            minWidth: 24,
          },
          "&::-webkit-scrollbar-thumb:focus": {
            backgroundColor: scrollBarColorActive,
          },
          "&::-webkit-scrollbar-thumb:active": {
            backgroundColor: scrollBarColorActive,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: scrollBarColorActive,
          },
          "&::-webkit-scrollbar-corner": {
            backgroundColor: "transparent",
          },
        },
      },
    },
  },
})

export default theme
