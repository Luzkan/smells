import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"
import theme from "utils/theme"

import { Link, List, makeStyles } from "@material-ui/core"
import { BookmarksOutlined, LayersOutlined, MenuBookSharp, MenuOpenOutlined, RecentActorsOutlined, SportsKabaddiOutlined } from "@material-ui/icons"

import SmellInformationBoxListItem from "./info-item"

const useStyles = makeStyles({
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    minWidth: 200,
  },
})

interface Props {
  codeSmell: CodeSmell
}

const SmellInformationBox = ({ codeSmell }: Props) => {
  const classes = useStyles()

  const relatedSmellText: JSX.Element[] = codeSmell.relations.related_smells.map((related_smell, index) => (
    <span key={index}>
      {`- `}
      {
        <Link key={related_smell.slug} href={related_smell.slug}>
          {related_smell.name}
        </Link>
      }
      {` (${related_smell.type.join(", ")})`}
      <br />
    </span>
  ))

  const historyText: JSX.Element[] = codeSmell.history.map((history, index) => (
    <span key={index}>
      {`${history.author} in ${history.source.type} (${history.source.year}):\n"${history.source.name}"`}
      {index !== codeSmell.history.length - 1 ? (
        <>
          <br />
          <br />
        </>
      ) : (
        ""
      )}
    </span>
  ))

  return (
    <List className={classes.list} style={{ maxWidth: "inherit !important" }}>
      <SmellInformationBoxListItem
        section={"Also Known As"}
        keyName={"known-as"}
        icon={<MenuBookSharp />}
        text={codeSmell.meta.known_as.join("\n")}
      />
      <SmellInformationBoxListItem
        section={"Obstruction"}
        keyName={"obstruction"}
        icon={<SportsKabaddiOutlined />}
        text={codeSmell.categories.obstruction.join(" / ")}
      />
      <SmellInformationBoxListItem
        section={"Occurrence"}
        keyName={"occurrence"}
        icon={<MenuOpenOutlined />}
        text={codeSmell.categories.occurrence.join(" / ")}
      />
      <SmellInformationBoxListItem
        section={"Expanse"}
        keyName={"expanse"}
        icon={<LayersOutlined />}
        text={codeSmell.categories.expanse === "Between" ? "Between Classes" : "Within a Class"}
      />
      <SmellInformationBoxListItem section={"Related Smells"} keyName={"related-smells"} icon={<BookmarksOutlined />} text={relatedSmellText} />
      <SmellInformationBoxListItem section={"History"} keyName={"history"} icon={<RecentActorsOutlined />} text={historyText} />
    </List>
  )
}

export default SmellInformationBox
