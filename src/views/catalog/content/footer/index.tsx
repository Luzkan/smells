import config from "config"
import React from "react"

import { Button, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      margin: theme.spacing(0, 2, 0, 0),
    },
    center: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
  })
)

function CatalogFooter() {
  const classes = useStyles()

  return (
    <footer>
      <Grid className={classes.center}>
        <Button className={classes.link} variant="contained" href="https://github.com/luzkan/smells">
          {" On GitHub "}
        </Button>
        <Button className={classes.link} variant="contained" href="https://github.com/Luzkan/smells/tree/main/docs/paper.pdf">
          {" Paper "}
        </Button>
        <Button className={classes.link} variant="contained" href="https://www.linkedin.com/in/luzkan/">
          {" Author "}
        </Button>
      </Grid>
      <Grid className={classes.center}>
        <Typography className={classes.link} variant="caption">
          {config.site.copyright}
        </Typography>
      </Grid>
    </footer>
  )
}

export default CatalogFooter
