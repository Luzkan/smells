import React from "react"
import { Obstruction } from "types/enum/Obstruction"
import { FilterItem } from "types/filter-item"

import {
  AccountTree,
  AirlineSeatReclineExtra,
  BookmarkBorder,
  CancelScheduleSend,
  Filter9Plus,
  FunctionsOutlined,
  RestoreFromTrash,
  SubjectOutlined,
  SupervisorAccount,
  Texture,
} from "@mui/icons-material"

export const obstructionFilterItems: FilterItem[] = [
  {
    text: Obstruction.BLOATERS,
    icon: <AirlineSeatReclineExtra color="primary" />,
  },
  {
    text: Obstruction.CHANGE_PREVENTERS,
    icon: <CancelScheduleSend color="primary" />,
  },
  {
    text: Obstruction.COUPLERS,
    icon: <SupervisorAccount color="primary" />,
  },
  {
    text: Obstruction.DATA_DEALERS,
    icon: <Filter9Plus color="primary" />,
  },
  {
    text: Obstruction.DISPENSABLES,
    icon: <RestoreFromTrash color="primary" />,
  },
  {
    text: Obstruction.FUNCTIONAL_ABUSERS,
    icon: <FunctionsOutlined color="primary" />,
  },
  {
    text: Obstruction.OBFUSCATORS,
    icon: <Texture color="primary" />,
  },
  {
    text: Obstruction.OBJECT_ORIENTED_ABUSERS,
    icon: <AccountTree color="primary" />,
  },
  {
    text: Obstruction.OTHER,
    icon: <BookmarkBorder color="primary" />,
  },
]
