import SmellArticle from "components/smell-article"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core"
import DialogContent from "@material-ui/core/DialogContent"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    right: {
      float: "right",
      width: "100px",
      height: "100px",
      background: "red",
    },
    infoBox: {
      float: "right",
      padding: theme.spacing(2),
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(1),
      backgroundColor: "#ffffff",
      border: "1px solid #82858a",
    },
    wrapper: {
      border: "5px solid #e2e8f0",
    },
    marginCenterContent: {
      display: "block",
      backgroundColor: "#fafafa",
      padding: theme.spacing(2),
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
  })
)

interface Props {
  codeSmell: CodeSmell
}

const SmellCardDialogContent = ({ codeSmell }: Props) => {
  const classes = useStyles()
  return (
    <DialogContent dividers={true}>
      <Grid container spacing={3} className={classes.marginCenterContent} direction="row">
        <SmellArticle codeSmell={codeSmell} />
      </Grid>
    </DialogContent>
  )
}

export default SmellCardDialogContent
