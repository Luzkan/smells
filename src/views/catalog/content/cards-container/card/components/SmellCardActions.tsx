import config from "config"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { InfoOutlined, OpenInNewOutlined } from "@mui/icons-material"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import { Button, CardActions } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles(() =>
  createStyles({
    cardActions: {
      marginTop: "auto !important",
    },
    rightAlignItem: {
      marginLeft: "0px !important",
    },
    leftAlignItem: {
      marginRight: "auto !important",
    },
  })
)

interface Props {
  codeSmell: CodeSmell
  handleClickOpen: (codeSmell: CodeSmell) => void
}

const SmellCardActions = ({ codeSmell, handleClickOpen }: Props) => {
  const classes = useStyles()

  return (
    <CardActions className={classes.cardActions}>
      <Button
        variant="text"
        className={classes.leftAlignItem}
        href={`https://github.com/Luzkan/smells/tree/main/content/smells${codeSmell.content.slug}.md`}
      >
        <FormatQuoteIcon />
      </Button>
      <Button
        variant="text"
        className={classes.rightAlignItem}
        href={`${config.site.url.prefix}${codeSmell.content.slug}`}
        key={codeSmell.meta.title}
      >
        <OpenInNewOutlined />
      </Button>
      <Button
        variant="text"
        className={classes.rightAlignItem}
        onClick={() => {
          handleClickOpen(codeSmell)
        }}
      >
        <InfoOutlined />
      </Button>
    </CardActions>
  )
}

export default SmellCardActions
