import SmellArticle from "components/smell-article"
import SocialLinks from "components/social-links"
import config from "config"
import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"
import { NavbarItem, QuerySmellPageArticleContext } from "types/interfaces/queries/QuerySmellPageArticleContext"

import { Grid, Theme } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

import SmellArticleFooter from "./footer"
import SmellArticleContentHeader from "./header"
import ArticleSidebarFilterDrawer from "./sidebar-filter"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    centerContent: {
      display: "flex",
      flexDirection: "column",
      marginTop: theme.spacing(6),
      minHeight: "100vh",
    },
    marginCenterContent: {
      display: "block",
      backgroundColor: "#fafafa",
      borderRadius: "5px",
      padding: theme.spacing(4),
      border: "1px solid #82858a",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: config.drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
)

interface Props {
  codeSmell: CodeSmell
  pageContext: QuerySmellPageArticleContext
  navbarItems: NavbarItem[]
}

const SmellArticlePage = ({ codeSmell, pageContext, navbarItems }: Props) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const width = useWindowDimensions().width

  const getWidthPercentage = (currentWidth: number): string => {
    if (currentWidth <= 1280) return "95%"
    if (currentWidth <= 1600) return "85%"
    if (currentWidth <= 1920) return "75%"
    if (currentWidth <= 2280) return "70%"
    return "65%"
  }

  const SmellArticleMain: JSX.Element = (
    <Grid container spacing={3} className={classes.centerContent} sx={{marginTop: "0px", marginLeft: "0px"}}>
      <Grid container spacing={3} className={classes.marginCenterContent} style={{ width: width ? getWidthPercentage(width) : "95%" }}>
        <SmellArticle codeSmell={codeSmell} />
        <SmellArticleFooter bottomNavigation={pageContext.bottomNavigation} />
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <SocialLinks smellProps={{ codeSmell, codeSmellArticleURLSlug: pageContext.slug }} />
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <>
      <ArticleSidebarFilterDrawer navbarItems={navbarItems} sidebar={{ handleOpen: () => setOpen(false), isOpen: open }} />
      <div className={`${open ? classes.content : classes.contentShift}`}>
        <SmellArticleContentHeader sidebar={{ handleOpen: () => setOpen(true), isOpen: open }} />
        {SmellArticleMain}
      </div>
    </>
  )
}

export default SmellArticlePage
