import React from "react"
import styled from "styled-components"
import { Pane } from "../atoms/Pane"

export function GlobalHeader() {
  return (
    <StyledHeader>
      <Title>
        <Pane>Next Editor</Pane>
      </Title>
      <TitleMenus />
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #222;
`

const Title = styled.div`
  display: inline-block;
  width: 300px;
  background-color: #222;
  color: #ddd;
`

const TitleMenus = styled.div`
  flex: 1;
`
