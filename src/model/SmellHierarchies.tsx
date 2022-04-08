import React from "react"
import { SmellHierarchy } from "types/enum/SmellHierarchy"
import { FilterItem } from "types/filter-item"

import { AccountBalance, Code, Layers, Palette, SettingsEthernet, TextDecrease } from "@mui/icons-material"

export const smellHierarchiesItems: FilterItem[] = [
  {
    text: SmellHierarchy.ANTIPATTERN,
    icon: <Layers color="primary" />,
  },
  {
    text: SmellHierarchy.ARCHITECTURE_SMELL,
    icon: <AccountBalance color="primary" />,
  },
  {
    text: SmellHierarchy.CODE_SMELL,
    icon: <Code color="primary" />,
  },
  {
    text: SmellHierarchy.DESIGN_SMELL,
    icon: <Palette color="primary" />,
  },
  {
    text: SmellHierarchy.IMPLEMENTATION_SMELL,
    icon: <SettingsEthernet color="primary" />,
  },
  {
    text: SmellHierarchy.LINGUISTIC_SMELL,
    icon: <TextDecrease color="primary" />,
  },
]
