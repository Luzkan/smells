import config from "config"
import useWindowDimensions from "hooks/UseWindowDimensions"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"
import { isMobile } from "utils/isMobile"

import { makeStyles } from "@material-ui/core"

import SmellCardsContainer from "./cards-container"
import CatalogFooter from "./footer"
import SmellCatalogContentHeader from "./header"

const useStyles = makeStyles(() => ({
  mainDesktop: {
    width: `calc(100% - ${config.drawerWidth})`,
    marginLeft: config.drawerWidth,
  },
}))

interface Props {
  codeSmellsFiltered: CodeSmell[]
  handleSidebarToggle: () => void
}

function SmellCatalogContent({ codeSmellsFiltered, handleSidebarToggle }: Props): JSX.Element {
  const classes = useStyles()

  const currentWidth = useWindowDimensions().width

  return (
    <main className={isMobile(currentWidth) ? "" : classes.mainDesktop}>
      <SmellCatalogContentHeader handleSidebarToggle={handleSidebarToggle} />
      <SmellCardsContainer codeSmells={codeSmellsFiltered} />
      <CatalogFooter />
    </main>
  )
}

export default SmellCatalogContent
