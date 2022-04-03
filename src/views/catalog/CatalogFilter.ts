import { useState } from "react"
import { FilterCodeSmells, SmellGroups } from "types/groups"
import { CodeSmell } from "types/interfaces/CodeSmell"

const SmellCatalogFilter = (codeSmells: CodeSmell[]): [CodeSmell[], FilterCodeSmells] => {
  const [smellsFiltered, setCodeSmellsFiltered] = useState(codeSmells)
  const [codeSmellsActiveFilters, setCodeSmellsActiveFilters] = useState({
    expanse: ["All"],
    obstruction: ["All"],
    occurrence: ["All"],
    tags: ["All"],
    smell_hierarchies: ["All"],
  })

  const filterCodeSmellCards = (group: SmellGroups, checkedFilterNames: string[]): void => {
    const codeSmellActiveFiltersNew = {
      ...codeSmellsActiveFilters,
      [group]: checkedFilterNames,
    }

    const codeSmellsFilteredBy = (filterGroup: SmellGroups): CodeSmell[] => {
      const isNoFilterSelected: boolean = codeSmellActiveFiltersNew[filterGroup].length === 1 && codeSmellActiveFiltersNew[filterGroup][0] === "All"
      if (isNoFilterSelected) return codeSmells
      return codeSmells.filter((codeSmell: CodeSmell) => {
        return codeSmell.categories[filterGroup]
          .toString()
          .split(",")
          .some((v) => codeSmellActiveFiltersNew[filterGroup].includes(v))
      })
    }

    const filteredCodeSmells: CodeSmell[] = codeSmellsFilteredBy("expanse")
      .filter((x) => codeSmellsFilteredBy("obstruction").includes(x))
      .filter((x) => codeSmellsFilteredBy("occurrence").includes(x))
      .filter((x) => codeSmellsFilteredBy("tags").includes(x))
      .filter((x) => codeSmellsFilteredBy("smell_hierarchies").includes(x))

    setCodeSmellsActiveFilters(codeSmellActiveFiltersNew)
    setCodeSmellsFiltered(filteredCodeSmells)
  }

  return [smellsFiltered, filterCodeSmellCards]
}

export default SmellCatalogFilter
