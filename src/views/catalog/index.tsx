import React, { useState } from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import SmellCatalogFilter from "./CatalogFilter"
import SmellCatalogContent from "./content"
import CatalogSidebarFilter from "./sidebar-filter"

interface Props {
  codeSmells: CodeSmell[]
}

const SmellCatalogPage = ({ codeSmells }: Props): JSX.Element => {
  const [smellsFiltered, filterSmells] = SmellCatalogFilter(codeSmells)
  const [isOpenMobileSidebar, setIsMobileSidebarOpen] = useState(false)
  const handleToggleMobileSidebar = (): void => setIsMobileSidebarOpen(!isOpenMobileSidebar)

  return (
    <>
      <CatalogSidebarFilter
        filterSmells={filterSmells}
        mobileSidebar={{
          handleToggle: handleToggleMobileSidebar,
          isOpen: isOpenMobileSidebar,
        }}
      />
      <SmellCatalogContent codeSmellsFiltered={smellsFiltered} handleSidebarToggle={handleToggleMobileSidebar} />
    </>
  )
}

export default SmellCatalogPage
