import * as React from "react"
import styled from "styled-components"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { Config as ConfigContent } from "../organisms/Config"

export function Config() {
  return (
    <Layout>
      <Header>
        <GlobalHeader />
      </Header>
      <Content>
        <ConfigContent />
      </Content>
    </Layout>
  )
}

export const Layout = styled.div`
  width: 100vx;
  height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 40px 1fr 1fr;
  grid-template-areas: "header header header" "content content content" "content content content";
`

export const Header = styled.div`
  width: 100%;
  height: 100%;
  grid-area: header;
`
export const Content = styled.div`
  width: 100%;
  height: 100%;
  grid-area: content;
`
