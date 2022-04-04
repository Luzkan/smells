import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import Dialog from "@mui/material/Dialog"

import SmellCardDialogActions from "./components/SmellDialogActions"
import SmellCardDialogContent from "./components/SmellDialogContent"
import SmellCardDialogHeader from "./components/SmellDialogHeader"

interface Props {
  codeSmell: CodeSmell
  open: boolean
  handleClickClose: () => void
}

const SmellDialog = ({ codeSmell, open, handleClickClose }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={handleClickClose}
      scroll="paper"
      maxWidth="lg"
      fullWidth={true}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <SmellCardDialogHeader codeSmell={codeSmell} handleClickClose={handleClickClose} />
      <SmellCardDialogContent codeSmell={codeSmell} />
      <SmellCardDialogActions codeSmell={codeSmell} />
    </Dialog>
  )
}

export default SmellDialog
