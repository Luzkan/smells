const _ = require("lodash")
const moment = require("moment")
const config = require("../src/config")

const getSlug = (node) => {
  if ("frontmatter" in node) {
    if ("meta" in node.frontmatter && "slug" in node.frontmatter.meta) return `/${_.kebabCase(node.frontmatter.meta.slug)}`
    if ("slug" in node.frontmatter) return `/${_.kebabCase(node.frontmatter.slug)}`
    if ("title" in node.frontmatter) return `/${_.kebabCase(node.frontmatter.title)}`
    throw "Smell Article has no viable slug/title to create path from."
  }
}

const getDate = (node) => {
  if ("frontmatter" in node && "meta" in node.frontmatter && "last_update_date" in node.frontmatter.meta) {
    const date = moment(node.frontmatter.meta.last_update_date, config.formatting.date.from)
    if (!date.isValid) console.warn(`WARNING: Invalid date.`, node.frontmatter)
    return date
  }
}

module.exports = {
  getSlug: getSlug,
  getDate: getDate,
}
