import React from "react"
import styled from "styled-components"
import { Pane } from "../atoms/Pane"

export function GlobalHeader() {
  return (
    <Header>
      <Title>
        <Pane>Next Editor</Pane>
      </Title>
      <TitleMenus />
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #222;
`

const Title = styled.div`
  display: inline-block;
  width: 120px;
  color: #ddd;
`

const TitleMenus = styled.div`
  flex: 1;
`
