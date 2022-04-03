import config from "config"
import React from "react"

import { createStyles, Fab, Grid, Link, makeStyles, Typography } from "@material-ui/core"
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore"
import NavigateNextIcon from "@material-ui/icons/NavigateNext"
import { BottomNavigation } from "types/interfaces/queries/QuerySmellPageArticleContext"

const useStyles = makeStyles(() =>
  createStyles({
    right: {
      float: "right",
    },
    left: {
      float: "left",
    },
    customFont: {
      fontFamily: '"TT Norms Pro", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    navigationText: {
      paddingTop: "0.5rem",
      fontSize: "1.0rem",
      "@media screen and (min-width: 1024px)": {
        fontSize: "1.2rem",
      },
      fontWeight: 300,
    },
    navigationDiv: {
      marginBottom: "1.4rem",
      "@media screen and (min-width: 1024px)": {
        marginBottom: "0.8rem",
      },
    },
  })
)

interface Props {
  bottomNavigation: BottomNavigation
}

const SmellArticleFooter = ({ bottomNavigation }: Props) => {
  const classes = useStyles()

  return (
    <Grid item xs={12} className={classes.navigationDiv}>
      <Grid container alignItems="center" spacing={3}>
        <Grid item xs={2} md={1}>
          <Fab className={`${classes.left} ${classes.customFont}`} size="small" href={`${config.site.url.prefix}${bottomNavigation.previous.slug}`} aria-label="next">
            <NavigateBeforeIcon />
          </Fab>
        </Grid>
        <Grid item xs={10} md={5}>
          <Typography variant="body1" className={`${classes.customFont} ${classes.navigationText}`}>
            <Link key={bottomNavigation.previous.slug} href={`${config.site.url.prefix}${bottomNavigation.previous.slug}`}>
              {bottomNavigation.previous.title}
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={10} md={5}>
          <Typography className={`${classes.right} ${classes.customFont} ${classes.navigationText}`} variant="body1">
            <Link key={bottomNavigation.next.slug} href={`${config.site.url.prefix}${bottomNavigation.next.slug}`}>
              {bottomNavigation.next.title}
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={2} md={1}>
          <Fab className={`${classes.right} ${classes.customFont}`} size="small" href={`${config.site.url.prefix}${bottomNavigation.next.slug}`} aria-label="next">
            <NavigateNextIcon />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SmellArticleFooter
