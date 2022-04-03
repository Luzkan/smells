import config from "config"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { Button, CardActions, createStyles, makeStyles } from "@material-ui/core"
import { InfoOutlined, OpenInNewOutlined } from "@material-ui/icons"
import FormatQuoteIcon from "@material-ui/icons/FormatQuote"

const useStyles = makeStyles(() =>
  createStyles({
    cardActions: {
      marginTop: "auto",
    },
    rightAlignItem: {
      marginLeft: "auto",
    },
    leftAlignItem: {
      marginRight: "auto",
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
