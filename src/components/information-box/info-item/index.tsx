import React, { ReactElement } from "react"
import { getCapitalizedLabel } from "utils/getCapitalizedLabel"
import { SMELL_PAGE_FONTS } from "utils/theme"

import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      alignItems: "flex-start",
    },
    icon: {
      backgroundColor: "#bfbfbf",
      color: "#3b3b3b",
    },
    listItemText: {
      whiteSpace: "pre-line",
      "& > span": {
        fontWeight: "600",
        fontFamily: SMELL_PAGE_FONTS,
      },
      "& p": {
        fontWeight: "600",
        fontFamily: SMELL_PAGE_FONTS,
      },
      "& a": {
        fontWeight: "600",
        color: "#000083",
        fontFamily: SMELL_PAGE_FONTS,
        transition: "all 115ms ease-in-out",
        "&:hover": {
          textShadow: "0 0 5px #00008357",
        },
      },
    },
  })
)

interface Props {
  section: string
  keyName: string
  icon: ReactElement
  text: string | JSX.Element[] | JSX.Element
}

const SmellInformationBoxListItem = ({ section, keyName, icon, text }: Props) => {
  const classes = useStyles()

  return (
    <ListItem key={keyName} className={classes.root}>
      <ListItemAvatar>
        <Avatar className={classes.icon}>{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText key={keyName} className={classes.listItemText} primary={getCapitalizedLabel(section)} secondary={text} />
    </ListItem>
  )
}

export default SmellInformationBoxListItem
