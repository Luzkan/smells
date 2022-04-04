import React from "react"

import { FormControl, FormControlLabel, List, ListItem, ListSubheader, Radio, RadioGroup, Theme } from "@mui/material"
import createStyles from "@mui/styles/createStyles"
import makeStyles from "@mui/styles/makeStyles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.primary.main,
      backgroundColor: "#ffffff",
      textTransform: "capitalize",
      fontWeight: "bold",
      height: "1.5rem",
    },
    listItem: {
      height: "2.3rem",
    },
  })
)

interface Props {
  listBy: string
  setListBy: (value: React.SetStateAction<string>) => void
  labels: string[]
}

function ArticleSidebarFilterDrawerRadios({ listBy, setListBy, labels }: Props): JSX.Element {
  const classes = useStyles()

  const handleListByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListBy((event.target as HTMLInputElement).value)
  }

  return (
    <List dense subheader={<ListSubheader className={classes.root}>List By</ListSubheader>}>
      <FormControl component="fieldset" fullWidth={true} margin="dense">
        <RadioGroup aria-label="list-by" name="list-by" value={listBy} onChange={handleListByChange}>
          {labels.map((label, index) => (
            <ListItem dense button key={`list-by-${label}`} className={classes.listItem}>
              <FormControlLabel key={index} value={label} control={<Radio color="primary" />} label={label} labelPlacement="end" />
            </ListItem>
          ))}
        </RadioGroup>
      </FormControl>
    </List>
  )
}

export default ArticleSidebarFilterDrawerRadios
