import React from "react"

import { AppBar, createStyles, makeStyles, Theme, Toolbar, Typography } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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
