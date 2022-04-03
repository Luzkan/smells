const getSmellArticle = require("./gatsby/SmellArticle")
const { getSlug, getDate } = require("./gatsby/NodeFields")
const config = require("./src/config")

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "MarkdownRemark") {
    const slug = getSlug(node)
    createNodeField({ node, name: "slug", value: slug })

    const date = getDate(node)
    if (date)
      createNodeField({
        node,
        name: "last_update_date",
        value: date.format(config.formatting.date.to), // alt: date.toISOString()
      })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const markdownQueryResult = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              meta {
                last_update_date
                title
              }
              categories {
                obstruction
                expanse
                occurrence
                smell_hierarchies
                tags
              }
            }
          }
        }
      }
    }
  `)

  if (markdownQueryResult.errors) {
    console.error(markdownQueryResult.errors)
    throw markdownQueryResult.errors
  }

  const postsEdges = markdownQueryResult.data.allMarkdownRemark.edges
  const navbarItems = postsEdges.map((edge) => {
    return {
      title: edge.node.frontmatter.meta.title,
      slug: edge.node.fields.slug,
      categories: {
        expanse: edge.node.frontmatter.categories.expanse,
        obstruction: edge.node.frontmatter.categories.obstruction,
        occurrence: edge.node.frontmatter.categories.occurrence,
        smell_hierarchies: edge.node.frontmatter.categories.smell_hierarchies,
        tags: edge.node.frontmatter.categories.tags,
      },
    }
  })

  postsEdges.forEach((edge, index) => {
    const nextID = index + 1 < postsEdges.length ? index + 1 : 0
    const prevID = index - 1 >= 0 ? index - 1 : postsEdges.length - 1
    const nextEdge = postsEdges[nextID]
    const prevEdge = postsEdges[prevID]
    createPage(getSmellArticle(edge, navbarItems, nextEdge, prevEdge))
  })
}
