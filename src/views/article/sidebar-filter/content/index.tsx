import React from "react"
import { NavbarItem } from "types/interfaces/queries/QuerySmellPageArticleContext"

import { Divider } from "@mui/material"

import ArticleSidebarFilterDrawerRadios from "./radios"
import ArticleSidebarFilterDrawerSection from "./section"

export interface NavbarRowsByCategorization {
  [name: string]: NavbarItem[]
}

export interface SideNavbarCategories {
  rows: NavbarRowsByCategorization
  label: string
}

interface Props {
  categoriesOfNavbarItems: SideNavbarCategories[]
}

function ArticleSidebarFilterDrawerContent({ categoriesOfNavbarItems }: Props): JSX.Element {
  const [listBy, setListBy] = React.useState(categoriesOfNavbarItems[0].label)

  const getNavigationSection = (navbarItems: NavbarRowsByCategorization): JSX.Element[] => {
    return Object.keys(navbarItems).map((section: string, index: number) => {
      return (
        <div key={index}>
          <Divider />
          <ArticleSidebarFilterDrawerSection filterGroupName={section} items={navbarItems[section]} />
        </div>
      )
    })
  }

  const getIndexedNavigations = (navbarItems: SideNavbarCategories[]) => {
    const navigationSectionsByLabels: { [name: string]: JSX.Element[] } = {}
    navbarItems.forEach((navbarItem: SideNavbarCategories) => {
      navigationSectionsByLabels[navbarItem.label] = getNavigationSection(navbarItem.rows)
    })
    return navigationSectionsByLabels
  }

  const navigationSections = getIndexedNavigations(categoriesOfNavbarItems)

  return (
    <>
      <ArticleSidebarFilterDrawerRadios
        listBy={listBy}
        setListBy={setListBy}
        labels={categoriesOfNavbarItems.map((navbarItem: SideNavbarCategories) => navbarItem.label)}
      />
      {navigationSections[listBy]}
    </>
  )
}

export default ArticleSidebarFilterDrawerContent
