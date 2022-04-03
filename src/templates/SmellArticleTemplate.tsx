import Layout from "components/layout"
import SEO from "components/seo"
import { graphql } from "gatsby"
import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"
import { QuerySmell } from "types/interfaces/queries/QuerySmell"
import { NavbarItem, QuerySmellPageArticleContext } from "types/interfaces/queries/QuerySmellPageArticleContext"
import { deserializeNavbarItem } from "utils/graphql-parsers/deserializeNavbarItem"
import { deserializeSmells } from "utils/graphql-parsers/deserializeSmells"
import SmellArticlePage from "views/article"

interface Props {
  data: {
    markdownRemark: QuerySmell
  }
  pageContext: QuerySmellPageArticleContext
}

const SmellArticleTemplate = ({ data, pageContext }: Props) => {
  const codeSmell: CodeSmell = deserializeSmells(data.markdownRemark)
  const navbarItems: NavbarItem[] = pageContext.navbarItems.map((navbarItem) => deserializeNavbarItem(navbarItem))

  return (
    <Layout>
      <SEO
        postPath={pageContext.slug}
        codeSmell={codeSmell}
        helmetValues={{
          title: `Code Smells | ${pageContext.title}`,
          defer: false,
        }}
      />
      <SmellArticlePage codeSmell={codeSmell} pageContext={pageContext} navbarItems={navbarItems} />
    </Layout>
  )
}

export default SmellArticleTemplate

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query CodeSmellBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt
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
`
