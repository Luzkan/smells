const urljoin = require("url-join")
const config = require("./src/config")

const fs = require("fs")
const path = require("path")

const getSourceDirectoryPathConfiguration = () => {
  const sourceDirectories = fs.readdirSync(path.resolve(__dirname, "src"))
  return sourceDirectories.reduce((acc, sourceDirectory) => {
    acc[sourceDirectory] = path.resolve(__dirname, "src", sourceDirectory)
    return acc
  }, {})
}

module.exports = {
  pathPrefix: `/smells`,
  siteMetadata: {
    siteUrl: urljoin(config.site.url.path, config.site.url.prefix),
    rssMetadata: {
      site_url: urljoin(config.site.url.path, config.site.url.prefix),
      feed_url: urljoin(config.site.url.path, config.site.url.prefix, config.site.rss.path),
      title: config.site.title.full,
      description: config.site.description,
      image_url: `${urljoin(config.site.url.path, config.site.url.prefix)}/logos/logo-48.png`,
      copyright: config.site.copyright,
    },
  },
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sass",
    "gatsby-plugin-htaccess",
    // "gatsby-plugin-material-ui",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "assets",
        path: `${__dirname}/static/`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: `gatsby-plugin-react-redux`,
      options: {
        pathToCreateStoreModule: "./src/store/createStore",
        serialize: {
          space: 0,
          isJSON: true,
          unsafe: false,
          ignoreFunction: true,
        },
        cleanupOnClient: true,
        windowKey: "__PRELOADED_STATE__",
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 690,
            },
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
          },
          // {
          //   resolve: `gatsby-remark-highlight-code`,
          // },
          {
            resolve: "gatsby-remark-prismjs",
          },
          // "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-autolink-headers",
          "gatsby-remark-markdown-linker",
        ],
      },
    },
    {
      resolve: "gatsby-plugin-root-import",
      options: getSourceDirectoryPathConfiguration(),
    },
    {
      resolve: "gatsby-plugin-resolve-src",
      options: {
        srcPath: path.resolve(__dirname, "src"),
      },
    },
    // {
    //   resolve: "gatsby-plugin-google-analytics",
    //   options: {
    //     trackingId: config.site.apps.googleAnalyticsID,
    //   },
    // },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          config.site.apps.googleAnalyticsID,
        ],
      },
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: config.theme.color.primary,
      },
    },
    {
      resolve: "gatsby-plugin-sharp",
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-twitter",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: config.site.title.full,
        short_name: config.site.title.short,
        description: config.site.description,
        start_url: config.site.url.prefix,
        background_color: config.theme.color.background,
        theme_color: config.theme.color.primary,
        display: "minimal-ui",
        icon: "static/logos/logo-1024.png",
        icons: [
          {
            src: "static/logos/logo-48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "static/logos/logo-1024.png",
            sizes: "1024x1024",
            type: "image/png",
          },
          {
            src: "static/logos/logo-text-2560x1280.png",
            sizes: "2560x1280",
            type: "image/png",
          },
        ],
      },
    },
    "gatsby-plugin-offline",
    {
      resolve: "gatsby-plugin-feed",
      options: {
        setup(ref) {
          const ret = ref.query.site.siteMetadata.rssMetadata
          ret.allMarkdownRemark = ref.query.allMarkdownRemark
          ret.generator = "Code Smells Catalog"
          return ret
        },
        query: `
        {
          site {
            siteMetadata {
              rssMetadata {
                site_url
                feed_url
                title
                description
                image_url
                copyright
              }
            }
          }
        }
      `,
        feeds: [
          {
            serialize(ctx) {
              const { rssMetadata } = ctx.query.site.siteMetadata
              return ctx.query.allMarkdownRemark.edges.map((edge) => ({
                categories: edge.node.frontmatter.categories.occurrence,
                date: edge.node.frontmatter.meta.last_update_date,
                title: edge.node.frontmatter.meta.title,
                description: edge.node.excerpt,
                url: rssMetadata.site_url + edge.node.fields.slug,
                guid: rssMetadata.site_url + edge.node.fields.slug,
                custom_elements: [{ "content:encoded": edge.node.html }, { author: config.user.email }],
              }))
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___meta___last_update_date] },
              ) {
                edges {
                  node {
                    excerpt
                    html
                    timeToRead
                    fields {
                      slug
                    }
                    frontmatter {
                      meta {
                        last_update_date
                        title
                        cover
                      }
                      categories {
                        occurrence
                      }
                    }
                  }
                }
              }
            }
          `,
            output: config.site.rss.path,
            title: config.site.rss.path,
          },
        ],
      },
    },
  ],
}
