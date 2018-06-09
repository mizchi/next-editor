import * as React from "react"
import styled from "styled-components"
import { EditorProvider } from "../../contexts/EditorContext"
import { ProjectProvider } from "../../contexts/ProjectContext"
import { FilePreview } from "../molecules/FilePreview"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { RepositoryBrowser } from "../molecules/RepositoryBrowser"
import { FileEditor } from "./FileEditor"

export function RepositoryEdit() {
  return (
    <ProjectProvider projectRoot={"/playground"}>
      <EditorProvider>
        <Layout>
          <Header>
            <GlobalHeader />
          </Header>
          <Menu>
            <RepositoryBrowser />
          </Menu>
          <Editor>
            <FileEditor />
          </Editor>
          <Preview>
            <FilePreview />
          </Preview>
        </Layout>
      </EditorProvider>
    </ProjectProvider>
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

export const Editor = styled.div`
  width: 100%;
  height: 100%;
  grid-area: editor;
`

export const Preview = styled.div`
  width: 100%;
  height: 100%;
  grid-area: preview;
`
