import React from "react"

import { CssBaseline } from "@mui/material"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles(() => ({
  main: {
    margin: 0,
    overflow: "hidden",
  },
}))

interface Props {
  children: React.ReactNode
}

function Layout({ children }: Props): JSX.Element {
  const classes = useStyles()

  const googleFonts: JSX.Element = (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      ></link>
    </>
  )

  return (
    <div className={classes.main}>
      <CssBaseline />
      {googleFonts}
      {children}
    </div>
  )
}

export default Layout
