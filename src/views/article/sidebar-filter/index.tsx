import config from "config"
import React from "react"
import { SmellGroups } from "types/groups"
import { NavbarItem } from "types/interfaces/queries/QuerySmellPageArticleContext"
import { getCapitalizedLabel } from "utils/getCapitalizedLabel"

import { Drawer, Theme } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

import ArticleSidebarFilterDrawerContent, { NavbarRowsByCategorization } from "./content"
import ArticleSidebarFilterDrawerHeader from "./header"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      borderRight: "0px solid #ffffff",
    },
    drawer: {
      width: config.drawerWidth,
      color: theme.palette.primary.contrastText,
      backgroundColor: "#ffffff",
      borderRight: "0px solid #ffffff",
      flexShrink: 0,
    },
    drawerPaper: {
      width: config.drawerWidth,
      borderRight: "0px solid #ffffff",
    },
  })
)

interface Sidebar {
  handleOpen: () => void
  isOpen: boolean
}

interface Props {
  navbarItems: NavbarItem[]
  sidebar: Sidebar
}

function ArticleSidebarFilterDrawer({ navbarItems, sidebar }: Props): JSX.Element {
  const classes = useStyles()

  const expanses: NavbarRowsByCategorization = navbarItems.reduce((acc: NavbarRowsByCategorization, item: NavbarItem) => {
    acc[item.categories.expanse] ? null : (acc[item.categories.expanse] = [])
    acc[item.categories.expanse].push(item)
    return acc
  }, {})

  const getNavbarListed = (category: SmellGroups) => {
    return {
      rows: navbarItems.reduce((acc: NavbarRowsByCategorization, item: NavbarItem) => {
        item.categories[category].forEach((category: string) => {
          acc[category] ? null : (acc[category] = [])
          acc[category].push(item)
        })
        return acc
      }, {}),
      label: getCapitalizedLabel(category),
    }
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={sidebar.isOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <ArticleSidebarFilterDrawerHeader handleDrawerClose={sidebar.handleOpen} />
      <ArticleSidebarFilterDrawerContent
        categoriesOfNavbarItems={[
          getNavbarListed("obstruction"),
          getNavbarListed("occurrence"),
          { rows: expanses, label: "Expanse" },
          getNavbarListed("smell_hierarchies"),
          getNavbarListed("tags"),
        ]}
      />
    </Drawer>
  )
}

export default ArticleSidebarFilterDrawer
