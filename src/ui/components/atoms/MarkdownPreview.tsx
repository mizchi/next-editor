import "github-markdown-css/github-markdown.css"
import React from "react"
import remark from "remark"
import remarkReact from "remark-react"
import styled from "styled-components"

const processor = remark().use(remarkReact)

type Props = { source: string }

export class MarkdownPreview extends React.Component<Props, {}> {
  render() {
    const { source } = this.props
    const contents = processor.processSync(source).contents
    try {
      return <Container className="markdown-body">{contents}</Container>
    } catch (e) {
      return e.massage || "syntax error"
    }
  }
}

const Container = styled.div`
  overflow: auto;
  height: 100%;
  padding: 10px;
`
