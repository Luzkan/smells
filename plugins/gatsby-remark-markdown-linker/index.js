const visit = require("unist-util-visit")
const config = require("../../src/config")

module.exports = ({ markdownAST }) => {
  function removeCompiledDirectory(url) {
    return url.replace(/\/(.*)\/(.*).(md|markdown)$/, (match, compiled_directory, smell_slug, extension) => {
      return `/${smell_slug}`
    })
  }

  function addWebsitePrefix(url) {
    return `${config.site.url.prefix}${url}`
  }

  function isMarkdownHref(url) {
    return url && /.\/(.*).(md|markdown)$/.test(url)
  }

  visit(markdownAST, "link", (node) => {
    if (isMarkdownHref(node.url)) {
      console.log(`Changing URL: "${node.url}"`)
      node.url = addWebsitePrefix(removeCompiledDirectory(node.url))
      console.log(`... into: "${node.url}"`)
    }
  })

  return markdownAST
}
