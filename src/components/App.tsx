import * as React from "react"
import styled from "styled-components"

type Props = {}

export default (props: Props) => {
  return (
    <Container>
      <h1>Hello</h1>
    </Container>
  )
}

const v: number = 1

const Container = styled.div`
  width: 100%;
  height: 100%;
`
