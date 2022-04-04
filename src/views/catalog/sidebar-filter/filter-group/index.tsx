import React from "react"
import { FilterCodeSmells, SmellGroups } from "types/groups"
import { getCapitalizedLabel } from "utils/getCapitalizedLabel"

import { Checkbox, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Theme } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#fcfcfc",
      color: `${theme.palette.text.primary}`,
    },
    filterCategoryTitle: {
      color: `${theme.palette.primary.main}`,
      textTransform: "capitalize",
      fontWeight: "bold ",
    },
  })
)

interface Props {
  filterCodeSmells: FilterCodeSmells
  filterGroupName: SmellGroups
  filterItems: Array<{ text: string; icon: JSX.Element }>
}

const SidebarFilterGroup = ({ filterCodeSmells, filterGroupName, filterItems }: Props) => {
  const classes = useStyles()
  const [checked, setChecked] = React.useState(["All"])

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
    filterCodeSmells(filterGroupName, newChecked)
  }

  return (
    <>
      <List
        dense
        subheader={<ListSubheader className={classes.filterCategoryTitle}>{getCapitalizedLabel(filterGroupName)}</ListSubheader>}
        className={classes.root}
      >
        {filterItems.map((item) => {
          const labelId = `checkbox-list-label-${item.text}`
          return (
            <ListItem button key={item.text} onClick={handleToggle(item.text)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText id={labelId} primary={item.text} />
              <Checkbox
                edge="start"
                checked={checked.indexOf(item.text) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}

export default SidebarFilterGroup
