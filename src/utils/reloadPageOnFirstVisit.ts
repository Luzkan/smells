export const handleReloadPageOnFirstVisit = () => {
  // This solves the FOUC problem w/o adding "gatsby-plugin-material-ui" to the gatsby-config.js
  // which was supposed to fix the issue, but it creates a whole new CSS styling that overrides
  // the custom CSS styling for components, making the whole page ugly.
  //
  // ref.:
  //  - https://en.wikipedia.org/wiki/Flash_of_unstyled_content
  //  - https://www.gatsbyjs.com/plugins/gatsby-plugin-material-ui/
  if (typeof window === "undefined") return

  const handleNewVisit = () => {
    localStorage.setItem("lastVisit", Date())
    window.setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const neverVisted = (): boolean => !localStorage.getItem("lastVisit")
  if (neverVisted()) handleNewVisit()

  const lastVisitDateTime = new Date(localStorage.getItem("lastVisit") as string)
  const currentDateTime = new Date()
  const lastVisitMoreThanDayAgo = (): boolean => currentDateTime.getTime() - lastVisitDateTime.getTime() > 86400000
  if (lastVisitMoreThanDayAgo()) handleNewVisit()
}
