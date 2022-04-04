import React from "react"
import { Expanse } from "types/enum/Expanse"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { CropDin, CropFree, NotListedLocationOutlined } from "@mui/icons-material"
import { CardContent, Typography } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      display: "flex",
      flexDirection: "column",
      width: "-webkit-fill-available",
    },
    cardActions: {
      marginTop: "auto",
    },
    title: {
      fontSize: 14,
    },
    spaceBetween: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
)

interface Props {
  codeSmell: CodeSmell
}

const SmellCardContent = ({ codeSmell }: Props) => {
  const classes = useStyles()

  const getExpanseIcon = (expanse: Expanse): JSX.Element => {
    switch (expanse) {
      case Expanse.BETWEEN:
        return <CropFree color="primary" className={`${classes.title}`} />
      case Expanse.WITHIN:
        return <CropDin color="primary" className={`${classes.title}`} />
      default:
        return <NotListedLocationOutlined color="primary" className={`${classes.title}`} />
    }
  }

  return (
    <CardContent>
      <div className={classes.spaceBetween}>
        {/* Top Left */}
        <Typography className={`${classes.title}`} color="textSecondary" gutterBottom>
          {codeSmell.categories.obstruction} - {codeSmell.categories.occurrence.join(" / ")}
        </Typography>

        {/* Top Right */}
        {getExpanseIcon(codeSmell.categories.expanse)}
      </div>

      <Typography variant="h4" color="textPrimary" gutterBottom>
        {codeSmell.meta.title}
      </Typography>
      <Typography variant="body1">
        {/* Display codeSmell.content.excerpt but replace codesmell.title from excerpt */}
        {codeSmell.content.excerpt.replace(codeSmell.meta.title, "")}
      </Typography>
    </CardContent>
  )
}

export default SmellCardContent
