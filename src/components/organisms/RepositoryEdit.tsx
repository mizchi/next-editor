import fs from "fs"
import * as React from "react"
import styled from "styled-components"
import { ProjectProvider } from "../../contexts/ProjectContext"
import {
  commitSingleFileInRepository,
  initGitProject,
  Repository
} from "../../lib/gitActions"
import { EditorProvider } from "../../contexts/EditorContext"
import { BabelCodePreview } from "../atoms/BabelCodePreview"
import { FileBrowser } from "../molecules/FileBrowser"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { FileEditor } from "./FileEditor"

type Props = {
  projectRoot: string
}
type State = {
  editorValue: string
}

const initialCode = `// code
import React from 'https://dev.jspm.io/react';
import ReactDOM from 'https://dev.jspm.io/react-dom';

const el = document.querySelector('#app-root')
ReactDOM.render(<h1>Hello</h1>, el)
`

export class RepositoryEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      editorValue: initialCode
    }
  }

  async commitFile(filepath: string, content: string) {
    const repo: Repository = {
      dir: this.props.projectRoot,
      fs
    }
    const hash = await commitSingleFileInRepository(repo, filepath, content)
    console.log("commited", Date.now().toString())
  }

  async componentDidMount() {
    const repo: Repository = {
      dir: this.props.projectRoot,
      fs
    }
    await initGitProject(repo)

    // const status = await git.status({ ...repo, filepath: "README.md" })
    // console.log(status)
    // const list = await git.listFiles(repo)
    // console.log("lsret", list)
  }
  render() {
    const { editorValue } = this.state
    return (
      <ProjectProvider projectRoot={this.props.projectRoot}>
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
              <BabelCodePreview source={editorValue} />
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
