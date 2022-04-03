import React from "react"

interface CopySourceHandlers {
  handleClick: () => void
  handleCloseSnackbar: (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => void
  snackbarOpen: boolean
}

const copySource = (source: string): CopySourceHandlers => {
  const [snackbarOpen, setCopySourceSnackbarOpen] = React.useState(false)

  const handleClick = () => {
    setCopySourceSnackbarOpen(true)
    navigator.clipboard.writeText(source)
  }

  const handleCloseSnackbar = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === "clickaway") return
    setCopySourceSnackbarOpen(false)
  }

  return { handleClick, handleCloseSnackbar, snackbarOpen }
}

export default copySource
