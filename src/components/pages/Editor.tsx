import * as React from "react"
import styled from "styled-components"
import { FilePreview } from "../molecules/FilePreview"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { FileEditor } from "../organisms/FileEditor"
import { RepositoryBrowser } from "../organisms/RepositoryBrowser"

export function Editor() {
  return (
    <Layout>
      <Header>
        <GlobalHeader />
      </Header>
      <Menu>
        <RepositoryBrowser />
      </Menu>
      <_Editor>
        <FileEditor />
      </_Editor>
      <Preview>
        <FilePreview />
      </Preview>
    </Layout>
  )
}

export const Layout = styled.div`
  width: 100vx;
  height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 40px 1fr 1fr;
  grid-template-areas: "header header header" "menu editor preview" "menu editor preview";
`

export const Header = styled.div`
  width: 100%;
  height: 100%;
  grid-area: header;
`

export const Menu = styled.div`
  width: 100%;
  height: 100%;
  padding: 4px;
  grid-area: menu;
`

export const _Editor = styled.div`
  width: 100%;
  height: 100%;
  grid-area: editor;
`

export const Preview = styled.div`
  width: 100%;
  height: 100%;
  grid-area: preview;
`
