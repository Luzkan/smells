import React from "react"
import { Expanse } from "types/enum/Expanse"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { Card } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

import SmellCardActions from "./components/SmellCardActions"
import SmellCardContent from "./components/SmellCardContent"

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      display: "flex",
      flexDirection: "column",
      width: "-webkit-fill-available",
    },
    leftBorder: {
      borderLeftWidth: 3,
      borderLeftStyle: "solid",
    },
  })
)

interface Props {
  codeSmell: CodeSmell
  handleClickOpen: (codeSmell: CodeSmell) => void
}

const SmellCard = ({ codeSmell, handleClickOpen }: Props) => {
  const classes = useStyles()

  const getBorderColorBasedOnExpanse = (expanse: Expanse): "red" | "green" | "black" => {
    switch (expanse) {
      case Expanse.WITHIN:
        return "red"
      case Expanse.BETWEEN:
        return "green"
      default:
        return "black"
    }
  }

  return (
    <Card className={`${classes.card} ${classes.leftBorder}`} style={{ borderLeftColor: getBorderColorBasedOnExpanse(codeSmell.categories.expanse) }}>
      {/* <TopBadge expanse={codeSmell.expanse}/> */}
      <SmellCardContent codeSmell={codeSmell} />
      <SmellCardActions codeSmell={codeSmell} handleClickOpen={handleClickOpen} />
    </Card>
  )
}

export default SmellCard
