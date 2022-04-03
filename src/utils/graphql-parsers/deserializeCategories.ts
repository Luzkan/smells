import { Expanse } from "types/enum/Expanse"
import { Obstruction } from "types/enum/Obstruction"
import { Occurrence } from "types/enum/Occurrence"
import { SmellHierarchy } from "types/enum/SmellHierarchy"
import { Categories } from "types/interfaces/Categories"

export const deserializeSmellCategories = (categories: Categories): Categories => {
  return {
    expanse: categories.expanse as Expanse,
    obstruction: categories.obstruction as Obstruction[],
    occurrence: categories.occurrence as Occurrence[],
    smell_hierarchies: categories.smell_hierarchies as SmellHierarchy[],
    tags: categories.tags,
  }
}
