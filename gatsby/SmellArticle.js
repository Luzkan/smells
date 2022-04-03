const path = require("path");
const smellArticle = path.resolve("src/templates/SmellArticleTemplate.tsx");

const getSmellArticle = (edge, navbarItems, nextEdge, prevEdge) => {
    return {
        path: edge.node.fields.slug,
        component: smellArticle,
        context: {
            slug: edge.node.fields.slug,
            title: edge.node.frontmatter.meta.title,
            bottomNavigation: {
                next: {
                    title: nextEdge.node.frontmatter.meta.title,
                    slug: nextEdge.node.fields.slug,
                },
                previous: {
                    title: prevEdge.node.frontmatter.meta.title,
                    slug: prevEdge.node.fields.slug,
                }
            },
            navbarItems: navbarItems
        }
    }
}

module.exports = getSmellArticle;
