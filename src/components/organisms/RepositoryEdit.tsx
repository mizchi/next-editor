import fs from "fs"
import * as React from "react"
import styled from "styled-components"
import { EditorProvider } from "../../contexts/EditorContext"
import { ProjectProvider } from "../../contexts/ProjectContext"
import {
  commitSingleFileInRepository,
  initGitProject,
  Repository
} from "../../lib/gitActions"
import { BabelCodePreview } from "../atoms/BabelCodePreview"
import { FileBrowser } from "../molecules/FileBrowser"
import { FilePreview } from "../molecules/FilePreview"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { FileEditor } from "./FileEditor"

type Props = {}
type State = {
  editorValue: string
}

export class RepositoryEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      editorValue: ""
    }
  }

  render() {
    const { editorValue } = this.state
    return (
      <ProjectProvider projectRoot={"/playground"}>
        <EditorProvider>
          <Layout>
            <Header>
              <GlobalHeader />
            </Header>
            <Menu>
              <FileBrowser />
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
