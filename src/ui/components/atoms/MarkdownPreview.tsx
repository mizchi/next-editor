import React from "react"
import remark from "remark"
import remarkReact from "remark-react"
import styled from "styled-components"
import { GithubMarkdownBody } from "./GithubMarkdownBody"

const processor = remark().use(remarkReact)

type Props = { source: string }

export class MarkdownPreview extends React.Component<Props, {}> {
  render() {
    const { source } = this.props
    const contents = processor.processSync(source).contents
    try {
      return (
        <Container>
          <GithubMarkdownBody>{contents}</GithubMarkdownBody>
        </Container>
      )
    } catch (e) {
      return e.massage || "syntax error"
    }
  }
}

const Container = styled.div`
  overflow: auto;
  height: 100%;
`
