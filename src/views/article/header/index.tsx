import Header from "components/header"
import config from "config"
import React from "react"

import { IconButton, makeStyles, Theme, Typography } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"

const useStyles = makeStyles((theme: Theme) => ({
  mainDesktop: {
    width: `calc(100% - ${config.drawerWidth})`,
    marginLeft: config.drawerWidth,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
}))

interface Sidebar {
  handleOpen: () => void
  isOpen: boolean
}

interface Props {
  sidebar: Sidebar
}

function SmellArticleContentHeader({ sidebar }: Props): JSX.Element {
  const classes = useStyles()

  const ButtonOpenSidebar: JSX.Element = (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={sidebar.handleOpen}
        className={`${classes.menuButton}, ${sidebar.isOpen ? classes.hide : null}`}
      >
        <MenuIcon />
      </IconButton>
      <Typography className={classes.title} color="inherit" variant="h6">
        Navs
      </Typography>
    </>
  )

  return <Header ButtonOpenSidebar={ButtonOpenSidebar} />
}

export default SmellArticleContentHeader
