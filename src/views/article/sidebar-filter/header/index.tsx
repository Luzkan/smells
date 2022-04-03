import React from "react"
import theme from "utils/theme"

import { AppBar, createStyles, IconButton, makeStyles, Theme, Toolbar } from "@material-ui/core"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "right",
      marginRight: theme.spacing(0),
      backgroundColor: theme.palette.primary.main,
      justifyContent: "flex-end",
    },
    iconButton: {
      flexGrow: 1,
      color: "white",
      alignItems: "center",
      textAlign: "center",
      justifyContent: "right",
    },
  })
)

interface Props {
  handleDrawerClose: () => void
}

function ArticleSidebarFilterDrawerHeader({ handleDrawerClose }: Props): JSX.Element {
  const classes = useStyles()

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar style={{ paddingRight: theme.spacing(0) }}>
        <IconButton className={classes.iconButton} onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default ArticleSidebarFilterDrawerHeader
