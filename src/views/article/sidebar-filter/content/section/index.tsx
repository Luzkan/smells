import config from "config"
import React from "react"
import { NavbarItem } from "types/interfaces/queries/QuerySmellPageArticleContext"

import { ArrowRightOutlined, ArrowRightRounded } from "@mui/icons-material"
import { Link, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Theme } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.primary.main,
      backgroundColor: "#ffffff",
      textTransform: "capitalize",
      fontWeight: "bold",
    },
    icon: {
      minWidth: "5px",
    },
  })
)

interface Props {
  filterGroupName: string
  items: NavbarItem[]
}

function ArticleSidebarFilterDrawerSection({ filterGroupName, items }: Props): JSX.Element {
  const classes = useStyles()

  return (
    <List dense subheader={<ListSubheader className={classes.root}>{filterGroupName}</ListSubheader>}>
      {items.map((item, index) => (
        <ListItem
          key={item.slug}
          // @ts-expect-error  w/o the react.forwardref, it produces a warning, but w/ it, it doesnt override properly
          component={React.forwardRef(function Navlink(prop, ref): JSX.Element {
            return <Link {...prop} innerRef={ref} href={`${config.site.url.prefix}${item.slug}`} underline="hover" />
          })}
        >
          <ListItemIcon className={classes.icon}>{index % 2 === 0 ? <ArrowRightRounded /> : <ArrowRightOutlined />}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      ))}
    </List>
  )
}

export default ArticleSidebarFilterDrawerSection
