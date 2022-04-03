import React from "react"
import { Tags } from "types/enum/Tags"
import { FilterItem } from "types/filter-item"

import { ArrowRightOutlined, LabelImportant } from "@material-ui/icons"

export const tagsFilterItems: FilterItem[] = [
  {
    text: Tags.MAJOR,
    icon: <LabelImportant color="primary" />,
  },
  {
    text: Tags.MINOR,
    icon: <ArrowRightOutlined color="primary" />,
  },
]
