export type SmellGroups = "expanse" | "obstruction" | "occurrence" | "smell_hierarchies" | "tags"
export type FilterCodeSmells = (group: SmellGroups, checkedFilterNames: string[]) => void
