import { NavbarItem } from "types/interfaces/queries/QuerySmellPageArticleContext"

import { deserializeSmellCategories } from "./deserializeCategories"

export const deserializeNavbarItem = (navbarItem: NavbarItem): NavbarItem => {
  return {
    title: navbarItem.title,
    slug: navbarItem.slug,
    categories: deserializeSmellCategories(navbarItem.categories),
  }
}
