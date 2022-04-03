import config from "config"
import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { isMobile } from "utils/isMobile"

import { AppBar, createStyles, IconButton, makeStyles, Toolbar, Typography } from "@material-ui/core"
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail"
import HelpIcon from "@material-ui/icons/Help"
import HomeIcon from "@material-ui/icons/Home"
import MenuBookIcon from "@material-ui/icons/MenuBook"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  })
)

export interface Props {
  ButtonOpenSidebar: JSX.Element
}

function Header({ ButtonOpenSidebar }: Props): JSX.Element {
  const classes = useStyles()

  const currentWidth = useWindowDimensions().width

  return (
    <AppBar position="static">
      <Toolbar>
        {ButtonOpenSidebar}
        <IconButton href={config.site.url.prefix} color="inherit" aria-label="home">
          <HomeIcon />
        </IconButton>
        <Typography className={classes.title} color="inherit" variant="h6">
          {isMobile(currentWidth) ? config.site.title.letterer : config.site.title.full}
        </Typography>
        <IconButton href="https://github.com/Luzkan/smells/" color="inherit" aria-label="about">
          <HelpIcon />
        </IconButton>
        <IconButton href="https://www.linkedin.com/in/luzkan/" color="inherit" aria-label="contact">
          <AlternateEmailIcon />
        </IconButton>
        <IconButton href="https://github.com/Luzkan/smells/tree/main/docs/paper.pdf" color="inherit" aria-label="paper">
          <MenuBookIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
