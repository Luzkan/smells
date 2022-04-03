import React from "react"
import { Expanse } from "types/enum/Expanse"

import { createStyles, Grid, makeStyles } from "@material-ui/core"

const useStyles = makeStyles(() =>
  createStyles({
    top_badge: {
      height: "2px",
    },
  })
)

interface Props {
  expanse: Expanse
}

const SmellCardTopBadge = ({ expanse }: Props) => {
  const classes = useStyles()

  const getBadgeColorBasedOn = (expanseType: Expanse) => {
    switch (expanseType) {
      case Expanse.WITHIN:
        return "red"
      case Expanse.BETWEEN:
        return "blue"
      default:
        return "inherit"
    }
  }

  return <Grid className={classes.top_badge} style={{ backgroundColor: getBadgeColorBasedOn(expanse) }}></Grid>
}

export default SmellCardTopBadge
