import React from "react"
import { Occurrence } from "types/enum/Occurrence"
import { FilterItem } from "types/filter-item"

import {
  DataUsageOutlined,
  FileCopyOutlined,
  FormatAlignLeftOutlined,
  FormatListBulletedOutlined,
  Hail,
  MessageOutlined,
  StraightenOutlined,
  SwitchAccessShortcutAdd,
  TextFieldsOutlined,
} from "@mui/icons-material"

export const occurrenceFilterItems: FilterItem[] = [
  {
    text: Occurrence.CONDITIONAL_LOGIC,
    icon: <FormatAlignLeftOutlined color="primary" />,
  },
  {
    text: Occurrence.DATA,
    icon: <DataUsageOutlined color="primary" />,
  },
  {
    text: Occurrence.DUPLICATION,
    icon: <FileCopyOutlined color="primary" />,
  },
  {
    text: Occurrence.INTERFACES,
    icon: <FormatListBulletedOutlined color="primary" />,
  },
  {
    text: Occurrence.MEASURED_SMELL,
    icon: <StraightenOutlined color="primary" />,
  },
  {
    text: Occurrence.MESSAGE_CALLS,
    icon: <MessageOutlined color="primary" />,
  },
  {
    text: Occurrence.NAMES,
    icon: <TextFieldsOutlined color="primary" />,
  },
  {
    text: Occurrence.RESPONSIBILITY,
    icon: <Hail color="primary" />,
  },
  {
    text: Occurrence.UNNECESSARY_COMPLEXITY,
    icon: <SwitchAccessShortcutAdd color="primary" />,
  },
]
