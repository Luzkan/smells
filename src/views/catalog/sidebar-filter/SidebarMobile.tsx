import React from "react"

import { Drawer } from "@mui/material"
import { ClassNameMap } from "@mui/styles"

export interface MobileSidebar {
  handleToggle: () => void
  isOpen: boolean
}

interface Props {
  style: ClassNameMap<"root">
  sidebarElements: JSX.Element[]
  mobileSidebar: MobileSidebar
}

function CatalogSidebarMobile({ mobileSidebar, style, sidebarElements }: Props): JSX.Element {
  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={mobileSidebar.isOpen}
      onClose={mobileSidebar.handleToggle}
      classes={{ paper: style.root }}
      ModalProps={{ keepMounted: true }}
    >
      {sidebarElements}
    </Drawer>
  )
}

export default CatalogSidebarMobile
