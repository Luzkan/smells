import { Categories } from "types/interfaces/Categories"

export interface BottomNavigation {
  next: {
    title: string
    slug: string
  }
  previous: {
    title: string
    slug: string
  }
}

export interface NavbarItem {
  title: string
  slug: string
  categories: Categories
}

export interface QuerySmellPageArticleContext {
  slug: string
  title: string
  bottomNavigation: BottomNavigation
  navbarItems: NavbarItem[]
}
