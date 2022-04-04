import React, { useState } from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { Container, Grid, Theme } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

import SmellCard from "./card"
import SmellDialog from "./dialog"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: `${theme.spacing(0, 0, 0, 0)}`,
      maxWidth: "inherit",
    },
    codeSmellCardsGrid: {
      marginTop: `${theme.spacing(0)}`,
      marginBottom: `${theme.spacing(0)}`,
      paddingLeft: `${theme.spacing(3)}`,
      paddingRight: `${theme.spacing(3)}`,
    },
    cardGrid: {
      display: "flex",
    },
  })
)

interface Props {
  codeSmells: CodeSmell[]
}

const SmellCardsContainer = ({ codeSmells }: Props) => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [codeSmellDialogProps, setCodeSmellDialogProps] = useState(codeSmells[0])

  const handleClickOpen = (codeSmell: CodeSmell) => {
    setOpen(true)
    setCodeSmellDialogProps(codeSmell)
  }

  return (
    <Grid container spacing={5} direction="row">
      <Grid item xs={12}>
        <Container component="main" className={classes.container}>
          <Grid container spacing={5} alignItems="stretch" className={classes.codeSmellCardsGrid}>
            {codeSmells.map((codeSmell: CodeSmell, cardIndex: number) => (
              <Grid item xs={12} sm={12} md={6} lg={6} xl={4} key={cardIndex} className={classes.cardGrid}>
                <SmellCard codeSmell={codeSmell} handleClickOpen={handleClickOpen} />
              </Grid>
            ))}
            <SmellDialog codeSmell={codeSmellDialogProps} open={open} handleClickClose={() => setOpen(false)} />
          </Grid>
        </Container>
      </Grid>
    </Grid>
  )
}

export default SmellCardsContainer
