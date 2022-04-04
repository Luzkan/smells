import Header from "components/header"
import config from "config"
import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { isMobile } from "utils/isMobile"

import MenuIcon from "@mui/icons-material/Menu"
import { IconButton, Theme } from "@mui/material"
import makeStyles from "@mui/styles/makeStyles"

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
      size="large"
    >
      <MenuIcon />
    </IconButton>
  )

  return <Header ButtonOpenSidebar={ButtonOpenSidebar} />
}

export default SmellCatalogContentHeader
