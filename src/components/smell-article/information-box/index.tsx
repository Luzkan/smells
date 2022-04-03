import SmellInformationBox from "components/information-box"
import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core"

import SmellArticleInformationBoxSummary from "./summary"

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
  })
)

interface Props {
  codeSmell: CodeSmell
}

const SmellArticleInformationBox = ({ codeSmell }: Props) => {
  const classes = useStyles()

  const width = useWindowDimensions().width
  const getBoxWidth = (currentWidth: number): string => {
    if (currentWidth <= 1280) return "100%"
    if (currentWidth <= 1600) return "30%"
    if (currentWidth <= 2280) return "35%"
    return "35%"
  }

  return (
    <Grid className={classes.infoBox} style={{ width: width ? getBoxWidth(width) : "100%" }}>
      <SmellArticleInformationBoxSummary codeSmell={codeSmell} />
      <hr />
      <SmellInformationBox codeSmell={codeSmell} />
    </Grid>
  )
}

export default SmellArticleInformationBox
