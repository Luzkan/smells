import { Expanse } from "types/enum/Expanse"
import { Obstruction } from "types/enum/Obstruction"
import { Occurrence } from "types/enum/Occurrence"
import { SmellHierarchy } from "types/enum/SmellHierarchy"

export interface Categories {
  expanse: Expanse
  obstruction: Obstruction[]
  occurrence: Occurrence[]
  smell_hierarchies: SmellHierarchy[]
  tags: string[]
}
