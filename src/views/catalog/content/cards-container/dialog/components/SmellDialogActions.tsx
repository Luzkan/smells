import config from "config"
import copySourceHandler from "hooks/CopySource"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { IconButton, Snackbar } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import DialogActions from "@material-ui/core/DialogActions"
import CloseIcon from "@material-ui/icons/Close"

interface Props {
  codeSmell: CodeSmell
}

const SmellCardDialogActions = ({ codeSmell }: Props) => {
  const copySource = copySourceHandler(`http://luzkan.github.io/smells${codeSmell.content.slug}`)

  return (
    <DialogActions>
      <Button href={`http://github.com/luzkan/smells/blob/main/content/smells${codeSmell.content.slug}.md`} color="primary">
        Edit on GitHub
      </Button>
      <Button onClick={copySource.handleClick} color="primary">
        Copy Source
      </Button>
      <Button href={`${config.site.url.prefix}${codeSmell.content.slug}`} key={codeSmell.meta.title} color="primary">
        Open in new Tab
      </Button>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={copySource.snackbarOpen}
        autoHideDuration={6000}
        onClose={copySource.handleCloseSnackbar}
        message="Copied page link to clipboard!"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={copySource.handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </DialogActions>
  )
}

export default SmellCardDialogActions
