import Layout from "components/layout"
import SEO from "components/seo"
import config from "config"
import React from "react"
import { Typography } from "@mui/material"

const NotFoundPage = () => (
  <Layout>
    <SEO helmetValues={{ title: `404: Not Found | ${config.site.title.full}` }} />
    <main>
      <Typography variant="h3">404 Not Found</Typography>
      <Typography variant="body1">You just hit a route that doesn&#39;t exist... the sadness.</Typography>
    </main>
  </Layout>
)

export default NotFoundPage
