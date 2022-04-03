import { Categories } from "types/interfaces/Categories"
import { History } from "types/interfaces/History"
import { Meta } from "types/interfaces/Meta"
import { Relations } from "types/interfaces/Relations"

export interface QuerySmell {
  frontmatter: {
    meta: Meta
    categories: Categories
    relations: Relations
    history: History[]
  }
  html: string
  excerpt: string
  timeToRead: number
  fields: {
    slug: string
  }
}
