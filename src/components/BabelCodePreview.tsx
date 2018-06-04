import React from "react"
import styled from "styled-components"
import { compileWithBabel } from "../lib/babel"

type Props = { code: string }

export class BabelCodePreview extends React.Component<Props, {}> {
  render() {
    const { code } = this.props
    const ret = compileWithBabel(code)
    return (
      <Container>
        <pre>{ret}</pre>
      </Container>
    )
  }
}

const Container = styled.div`
  padding: 10px;
`
