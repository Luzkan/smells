import Header from "components/header"
import config from "config"
import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { isMobile } from "utils/isMobile"

import { IconButton, makeStyles, Theme } from "@material-ui/core"
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
}))

interface Props {
  handleSidebarToggle: () => void
}

function SmellCatalogContentHeader({ handleSidebarToggle }: Props): JSX.Element {
  const classes = useStyles()

  const ButtonOpenSidebar: JSX.Element = (
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleSidebarToggle}
      edge="start"
      className={`${classes.menuButton}, ${isMobile(useWindowDimensions().width) ? null : classes.hide}`}
    >
      <MenuIcon />
    </IconButton>
  )

  return <Header ButtonOpenSidebar={ButtonOpenSidebar} />
}

export default SmellCatalogContentHeader
