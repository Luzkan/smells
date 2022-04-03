import config from "config"
import React from "react"
import Helmet from "react-helmet"
import { CodeSmell } from "types/interfaces/CodeSmell"

import { SEOProps } from "./SEO"

interface HelmetValues {
  title: string
  defer?: boolean
}

interface Props {
  postPath?: string
  codeSmell?: CodeSmell
  helmetValues: HelmetValues
}

const SEO = ({ postPath, codeSmell, helmetValues }: Props) => {
  const SeoProps = new SEOProps(codeSmell, postPath)

  return (
    <Helmet title={helmetValues.title} defer={helmetValues.defer ? helmetValues.defer : true}>
      <meta name="description" content={SeoProps.description} />
      <meta name="image" content={SeoProps.image} />

      <script type="application/ld+json">{JSON.stringify(SeoProps.jsonLD)}</script>

      <meta property="og:url" content={codeSmell ? SeoProps.urls.post : SeoProps.urls.site} />
      {codeSmell ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={SeoProps.title} />
      <meta property="og:description" content={SeoProps.description} />
      <meta property="og:image" content={SeoProps.image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={config.user.twitter ? config.user.twitter : ""} />
      <meta name="twitter:title" content={SeoProps.title} />
      <meta name="twitter:description" content={SeoProps.description} />
      <meta name="twitter:image" content={SeoProps.image} />
    </Helmet>
  )
}

export default SEO
