import React from "react"
import { SMELL_PAGE_FONTS } from "utils/theme"

import { Grid } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles(() =>
  createStyles({
    mainGrid: {},
    codeSmellMarkDownContent: {
      fontFamily: SMELL_PAGE_FONTS,
      fontStretch: "normal",

      "& h1, h2, h3, h4, h5, p": {
        maxWidth: "fit-content",
      },
      "& h1, h2, h3, h4, h5, p, ul, li, a, ": {
        fontFamily: SMELL_PAGE_FONTS,
      },
      "& p, ul, li, a, code": {
        fontWeight: 400,
        lineHeight: 1.67,
        fontSize: "1.0rem",
        "@media screen and (min-width: 1024px)": {
          fontSize: "1.3rem",
        },
      },
      "& h1": {
        fontWeight: 800,
        fontSize: "2.0rem",
        "@media screen and (min-width: 1024px)": {
          fontSize: "3.0rem",
        },
      },
      "& h2": {
        fontWeight: 700,
        fontSize: "1.7rem",
        "@media screen and (min-width: 1024px)": {
          fontSize: "2.5rem",
        },
      },
      "& h3": {
        fontWeight: 500,
        fontSize: "1.5rem",
        "@media screen and (min-width: 1024px)": {
          fontSize: "2.0rem",
        },
      },
      "& h4": {
        fontWeight: 600,
        fontSize: "1.1rem",
        "@media screen and (min-width: 1024px)": {
          fontSize: "1.5rem",
        },
      },
      "& h5": {
        fontWeight: 600,
        fontSize: "1.1rem",
        "@media screen and (min-width: 1024px)": {
          fontSize: "1.4rem",
        },
      },
      "& a": {
        transition: "all 115ms ease-in-out",
        "&:hover": {
          textShadow: "0 0 5px #00008357",
        },
      },
      "& code": {
        lineHeight: 1.7,
      },
      "& .gatsby-highlight": {
        // border: '1px solid #e1e4e8',
      },
      "& .example-block": {
        // border: '1px solid #e1e4e8',
        padding: "1rem",
        marginBottom: "1.5rem",
      },
      "& .example-block > .gatsby-highlight:nth-of-type(1)": {
        marginBottom: "1.5rem",
      },
    },
  })
)

interface Props {
  html: string
}

const SmellArticleMain = ({ html }: Props) => {
  const classes = useStyles()
  return (
    <Grid item xs={12} className={classes.mainGrid}>
      <div dangerouslySetInnerHTML={{ __html: html }} className={classes.codeSmellMarkDownContent} />
    </Grid>
  )
}

export default SmellArticleMain
