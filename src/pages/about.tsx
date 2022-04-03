import Layout from "components/layout"
import SEO from "components/seo"
import config from "config"
import React from "react"
import About from "views/about"

function AboutPage() {
  return (
    <Layout>
      <SEO helmetValues={{ title: `About | ${config.site.title.full}` }} />
      <About />
    </Layout>
  )
}

export default AboutPage
