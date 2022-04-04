import React from "react"
import theme from "utils/theme"

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { AppBar, IconButton, Theme, Toolbar } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "right",
      marginRight: theme.spacing(0),
      backgroundColor: theme.palette.primary.main,
      justifyContent: "flex-end",
      zIndex: 1100,
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
        <IconButton className={classes.iconButton} onClick={handleDrawerClose} size="large">
          {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default ArticleSidebarFilterDrawerHeader
