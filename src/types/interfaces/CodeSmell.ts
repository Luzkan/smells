import { Categories } from "types/interfaces/Categories"

import { Content } from "./Content"
import { History } from "./History"
import { Meta } from "./Meta"
import { Relations } from "./Relations"

export interface CodeSmell {
  meta: Meta
  categories: Categories
  relations: Relations
  history: History[]
  content: Content
}
