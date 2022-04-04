import React from "react"

import { AppBar, Theme, Toolbar, Typography } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      zIndex: 1100,
      backgroundColor: theme.palette.primary.main,
    },
    title: {
      flexGrow: 1,
    },
  })
)

function CatalogSidebarHeader() {
  const classes = useStyles()

  return (
    <>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Typography className={classes.title} color="inherit" variant="h6">
            Filters
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default CatalogSidebarHeader
