import config from "config"
import React from "react"
import { BottomNavigation } from "types/interfaces/queries/QuerySmellPageArticleContext"

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { Fab, Grid, Link, Typography } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

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
      marginBottom: "2.4rem",
      "@media screen and (min-width: 1024px)": {
        marginBottom: "1.8rem",
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
          <Fab
            className={`${classes.left} ${classes.customFont}`}
            size="small"
            href={`${config.site.url.prefix}${bottomNavigation.previous.slug}`}
            aria-label="next"
          >
            <NavigateBeforeIcon />
          </Fab>
        </Grid>
        <Grid item xs={10} md={5}>
          <Typography variant="body1" className={`${classes.customFont} ${classes.navigationText}`}>
            <Link key={bottomNavigation.previous.slug} href={`${config.site.url.prefix}${bottomNavigation.previous.slug}`} underline="hover">
              {bottomNavigation.previous.title}
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={10} md={5}>
          <Typography className={`${classes.right} ${classes.customFont} ${classes.navigationText}`} variant="body1">
            <Link key={bottomNavigation.next.slug} href={`${config.site.url.prefix}${bottomNavigation.next.slug}`} underline="hover">
              {bottomNavigation.next.title}
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={2} md={1}>
          <Fab
            className={`${classes.right} ${classes.customFont}`}
            size="small"
            href={`${config.site.url.prefix}${bottomNavigation.next.slug}`}
            aria-label="next"
          >
            <NavigateNextIcon />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SmellArticleFooter
