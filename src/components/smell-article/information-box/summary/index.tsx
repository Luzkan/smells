import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    infoBox: {
      float: "right",
      padding: theme.spacing(2),
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(1),
      backgroundColor: "#ffffff",
      border: "1px solid #82858a",
    },
    customFont: {
      fontFamily: '"TT Norms Pro", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    title: {
      textAlign: "center",
      fontSize: "1.3rem",
      marginBottom: theme.spacing(1),
    },
    subTitles: {
      textAlign: "center",
      fontSize: "1.0rem",
      marginBottom: theme.spacing(2),
    },
    icon: {
      backgroundColor: "#82858a",
      color: "#ff7575",
    },
    testing: {
      width: "100%",
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  })
)

interface Props {
  codeSmell: CodeSmell
}

const SmellArticleInformationBoxSummary = ({ codeSmell }: Props) => {
  const classes = useStyles()

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5" className={`${classes.title} ${classes.customFont}`}>
          {codeSmell.meta.title}
        </Typography>
      </Grid>
      <hr />
      <Grid item xs={12} className={classes.subTitles}>
        <Typography variant="body1" className={classes.customFont}>
          {" "}
          Last Revision &mdash; {codeSmell.meta.last_update_date}{" "}
        </Typography>
        <Typography variant="body1" className={classes.customFont}>
          {" "}
          {codeSmell.content.timeToRead} Min Read{" "}
        </Typography>
      </Grid>
    </>
  )
}

export default SmellArticleInformationBoxSummary
