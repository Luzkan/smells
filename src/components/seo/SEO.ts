import config from "config"
import { CodeSmell } from "types/interfaces/CodeSmell"
import urljoin from "url-join"

interface JsonLDSchema {
  "@context": string
  "@type": string
  url?: string
  name?: string
  alternateName?: string
  headline?: string
  description?: string
  prepTime?: string
  datePublished?: string
  itemListElement?: {
    "@type": string
    position: number
    item: {
      "@id": string
      name: string
      image: string
    }
  }[]
  image?: {
    "@type": string
    url: string
  }
}

interface URLS {
  site: string
  post: string
}

export class SEOProps {
  title: string
  description: string
  image: string
  urls: URLS
  jsonLD?: JsonLDSchema[]

  constructor(private codeSmell?: CodeSmell, private postPath?: string) {
    const siteURL = urljoin(config.site.url.path, config.site.url.prefix)
    if (this.codeSmell) {
      this.title = this.codeSmell.meta.title
      this.description = this.codeSmell.content.excerpt
      this.image = urljoin(config.site.url.path, config.site.url.prefix, this.codeSmell.meta.cover)
      this.urls = {
        site: siteURL,
        post: this.postPath ? urljoin(config.site.url.path, config.site.url.prefix, this.postPath) : siteURL,
      }
    } else {
      this.title = config.site.title.full
      this.description = config.site.description
      this.image = urljoin(config.site.url.path, config.site.url.prefix, config.site.logo)
      this.urls = {
        site: siteURL,
        post: siteURL,
      }
    }

    const schemaOrgJSONLD: JsonLDSchema[] = [
      {
        "@context": "http://schema.org",
        "@type": "WebSite",
        url: siteURL,
        name: this.title,
        alternateName: config.site.title.alt,
      },
    ]

    if (codeSmell) {
      schemaOrgJSONLD.push(
        {
          "@context": "http://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@id": this.urls.post,
                name: this.title,
                image: this.image,
              },
            },
          ],
        },
        {
          "@context": "http://schema.org",
          "@type": "BlogPosting",
          url: siteURL,
          name: this.title,
          alternateName: config.site.title.alt,
          headline: this.title,
          image: {
            "@type": "ImageObject",
            url: this.image,
          },
          description: this.description,
        }
      )
    }

    this.jsonLD = schemaOrgJSONLD
  }
}
