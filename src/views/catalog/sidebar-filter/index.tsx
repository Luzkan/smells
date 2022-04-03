import config from "config"
import useWindowDimensions from "hooks/UseWindowDimensions"
import { expanseFilterItems } from "model/Expanses"
import { obstructionFilterItems } from "model/Obstructions"
import { occurrenceFilterItems } from "model/Occurrences"
import { smellHierarchiesItems } from "model/SmellHierarchies"
import { tagsFilterItems } from "model/Tags"
import React from "react"
import { FilterCodeSmells } from "types/groups"
import { isMobile } from "utils/isMobile"

import { createStyles, makeStyles, Theme } from "@material-ui/core"
import { ClassNameMap } from "@material-ui/styles"

import SidebarFilterGroup from "./filter-group"
import CatalogSidebarHeader from "./header"
import CatalogSidebarDesktop from "./SidebarDesktop"
import CatalogSidebarMobile, { MobileSidebar } from "./SidebarMobile"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: config.drawerWidth,
      color: theme.palette.primary.contrastText,
      backgroundColor: "#ffffff",
      borderRight: "0px solid #ffffff",
    },
  })
)

interface Props {
  filterSmells: FilterCodeSmells
  mobileSidebar: MobileSidebar
}

function CatalogSidebarFilter({ filterSmells, mobileSidebar }: Props): JSX.Element {
  const classes: ClassNameMap<"root"> = useStyles()

  const sidebarElements: JSX.Element[] = [
    <CatalogSidebarHeader key={"header"} />,
    <SidebarFilterGroup key={"expanse"} filterCodeSmells={filterSmells} filterGroupName="expanse" filterItems={expanseFilterItems} />,
    <SidebarFilterGroup key={"obstruction"} filterCodeSmells={filterSmells} filterGroupName="obstruction" filterItems={obstructionFilterItems} />,
    <SidebarFilterGroup key={"occurrence"} filterCodeSmells={filterSmells} filterGroupName="occurrence" filterItems={occurrenceFilterItems} />,
    <SidebarFilterGroup
      key={"smell_hierarchies"}
      filterCodeSmells={filterSmells}
      filterGroupName="smell_hierarchies"
      filterItems={smellHierarchiesItems}
    />,
    <SidebarFilterGroup key={"tags"} filterCodeSmells={filterSmells} filterGroupName="tags" filterItems={tagsFilterItems} />,
  ]

  const currentWidth = useWindowDimensions().width

  return (
    <>
      {isMobile(currentWidth) ? (
        <CatalogSidebarMobile style={classes} sidebarElements={sidebarElements} mobileSidebar={mobileSidebar} />
      ) : (
        <CatalogSidebarDesktop style={classes} sidebarElements={sidebarElements} />
      )}
    </>
  )
}

export default CatalogSidebarFilter
