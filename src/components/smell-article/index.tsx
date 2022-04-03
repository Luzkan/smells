import React from "react"
import { CodeSmell } from "types/interfaces/CodeSmell"

import SmellArticleInformationBox from "./information-box"
import SmellArticleMain from "./main"

interface Props {
  codeSmell: CodeSmell
}

const SmellArticle = ({ codeSmell }: Props) => {
  return (
    <>
      <SmellArticleInformationBox codeSmell={codeSmell} />
      <SmellArticleMain html={codeSmell.content.html} />
    </>
  )
}

export default SmellArticle
