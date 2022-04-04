import React from "react"
import { Occurrence } from "types/enum/Occurrence"
import { FilterItem } from "types/filter-item"

import {
  DataUsageOutlined,
  FileCopyOutlined,
  FormatAlignLeftOutlined,
  FormatListBulletedOutlined,
  HomeWorkOutlined,
  MessageOutlined,
  StraightenOutlined,
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
    icon: <HomeWorkOutlined color="primary" />,
  },
  {
    text: Occurrence.UNNECESSARY_COMPLEXITY,
    icon: <HomeWorkOutlined color="primary" />, // TODO: New Icon, Deprecated: PolymerOutlined
  },
]
