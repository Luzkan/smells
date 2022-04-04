import config from "config"
import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { isMobile } from "utils/isMobile"

import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"
import HelpIcon from "@mui/icons-material/Help"
import HomeIcon from "@mui/icons-material/Home"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

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
        <IconButton href={config.site.url.prefix} color="inherit" aria-label="home" size="large">
          <HomeIcon />
        </IconButton>
        <Typography className={classes.title} color="inherit" variant="h6">
          {isMobile(currentWidth) ? config.site.title.letterer : config.site.title.full}
        </Typography>
        <IconButton href="https://github.com/Luzkan/smells/" color="inherit" aria-label="about" size="large">
          <HelpIcon />
        </IconButton>
        <IconButton href="https://www.linkedin.com/in/luzkan/" color="inherit" aria-label="contact" size="large">
          <AlternateEmailIcon />
        </IconButton>
        <IconButton href="https://github.com/Luzkan/smells/tree/main/docs/paper.pdf" color="inherit" aria-label="paper" size="large">
          <MenuBookIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
