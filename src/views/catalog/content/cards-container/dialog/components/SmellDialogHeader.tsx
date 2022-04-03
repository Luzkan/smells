import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"
import theme from "utils/theme"

import { IconButton, makeStyles } from "@material-ui/core"
import DialogTitle from "@material-ui/core/DialogTitle"
import CloseIcon from "@material-ui/icons/Close"

interface Props {
  codeSmell: CodeSmell
  handleClickClose: () => void
}

const useStyles = makeStyles({
  title: {
    fontStyle: "bold",
    paddingBottom: theme.spacing(1),
  },
  categoriesNames: {
    fontStyle: "italic",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
})

const SmellCardDialog = ({ codeSmell, handleClickClose }: Props) => {
  const classes = useStyles()

  const dialogTitle: JSX.Element = (
    <DialogTitle id="dialog-title" className={classes.title}>
      {codeSmell.meta.title}
      <IconButton aria-label="close" className={classes.closeButton} onClick={handleClickClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  )

  return <>{dialogTitle}</>
}

export default SmellCardDialog
