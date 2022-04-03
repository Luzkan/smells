import Layout from "components/layout"
import SEO from "components/seo"
import config from "config"
import { graphql } from "gatsby"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"
import { QuerySmell } from "types/interfaces/queries/QuerySmell"
import { deserializeSmells } from "utils/graphql-parsers/deserializeSmells"
import SmellCatalogPage from "views/catalog"

interface Props {
  data: {
    allMarkdownRemark: {
      edges: {
        node: QuerySmell
      }[]
    }
  }
}

const Index = ({ data }: Props) => {
  const codeSmellsData: CodeSmell[] = data.allMarkdownRemark.edges.map((edge: { node: QuerySmell }): CodeSmell => {
    return deserializeSmells(edge.node)
  })

  return (
    <Layout>
      <SEO helmetValues={{ title: config.site.title.full }} />
      <SmellCatalogPage codeSmells={codeSmellsData} />
    </Layout>
  )
}

export default Index

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(limit: 2000, sort: { fields: [frontmatter___meta___last_update_date], order: DESC }) {
      edges {
        node {
          html
          excerpt(pruneLength: 165)
          timeToRead
          fields {
            slug
          }
          frontmatter {
            meta {
              last_update_date(formatString: "MMMM DD, YYYY")
              title
              cover
              known_as
            }
            categories {
              obstruction
              expanse
              occurrence
              smell_hierarchies
              tags
            }
            relations {
              related_smells {
                name
                slug
                type
              }
            }
            history {
              author
              type
              named_as
              regarded_as
              source {
                year
                authors
                name
                type
              }
            }
          }
        }
      }
    }
  }
`
