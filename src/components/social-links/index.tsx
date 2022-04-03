import config from "config"
import React from "react"
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  RedditShareCount,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share"
import { CodeSmell } from "types/interfaces/CodeSmell"
import urljoin from "url-join"

import { createStyles, makeStyles } from "@material-ui/core"

interface SmellProps {
  codeSmell: CodeSmell
  codeSmellArticleURLSlug: string
}

interface Props {
  smellProps: SmellProps
}

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      filter: "grayscale(65%)",
      transition: "all 200ms ease-in-out",
      "&:hover": {
        filter: "grayscale(0%)",
        transform: "translateY(-5px)",
      },
    },
  })
)

function SocialLinks({ smellProps }: Props) {
  const classes = useStyles()
  const url = urljoin(config.site.url.path, config.site.url.prefix, smellProps.codeSmellArticleURLSlug)
  const iconSize = 32
  const filter = (count: number) => (count > 0 ? count : "")
  const renderShareCount = (count: number) => <div>{filter(count)}</div>

  return (
    <>
      <RedditShareButton url={url} title={smellProps.codeSmell.meta.title}>
        <RedditIcon round size={iconSize} className={classes.icon} />
        <RedditShareCount url={url}>{(count) => renderShareCount(count)}</RedditShareCount>
      </RedditShareButton>

      <TwitterShareButton url={url} title={smellProps.codeSmell.meta.title}>
        <TwitterIcon round size={iconSize} className={classes.icon} />
      </TwitterShareButton>

      <FacebookShareButton url={url} quote={smellProps.codeSmell.content.excerpt}>
        <FacebookIcon round size={iconSize} className={classes.icon} />
        <FacebookShareCount url={url}>{(count) => renderShareCount(count)}</FacebookShareCount>
      </FacebookShareButton>

      <LinkedinShareButton url={url} title={smellProps.codeSmell.meta.title} summary={smellProps.codeSmell.content.excerpt}>
        <LinkedinIcon round size={iconSize} className={classes.icon} />
      </LinkedinShareButton>

      <TelegramShareButton url={url}>
        <TelegramIcon round size={iconSize} className={classes.icon} />
      </TelegramShareButton>
    </>
  )
}

export default SocialLinks
