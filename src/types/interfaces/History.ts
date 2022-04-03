import { Source } from "types/interfaces/Source"

export interface History {
  author: string
  type: string
  named_as?: string[]
  regarded_as?: string[]
  source: Source
}
