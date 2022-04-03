import { CodeSmell } from "types/interfaces/CodeSmell"
import { QuerySmell } from "types/interfaces/queries/QuerySmell"

import { deserializeSmellCategories } from "./deserializeCategories"

export const deserializeSmells = (data: QuerySmell): CodeSmell => {
  const categories = data.frontmatter.categories

  return {
    meta: data.frontmatter.meta,
    categories: deserializeSmellCategories(categories),
    relations: data.frontmatter.relations,
    history: data.frontmatter.history,
    content: {
      html: data.html,
      excerpt: data.excerpt,
      timeToRead: data.timeToRead,
      slug: data.fields.slug,
    },
  }
}
