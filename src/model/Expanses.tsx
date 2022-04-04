import React from "react"
import { Expanse } from "types/enum/Expanse"
import { FilterItem } from "types/filter-item"

import { CropDin, CropFree } from "@mui/icons-material"

export const expanseFilterItems: FilterItem[] = [
  {
    text: Expanse.BETWEEN,
    icon: <CropFree color="primary" />,
  },
  {
    text: Expanse.WITHIN,
    icon: <CropDin color="primary" />,
  },
]
