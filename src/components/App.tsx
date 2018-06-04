import * as React from "react"
import styled from "styled-components"
import {
  commitSingleFileInRepository,
  initGitProject,
  Repository
} from "../lib/git"
import { BabelCodePreview } from "./BabelCodePreview"
import { MyMonacoEditor } from "./MyMonacoEditor"

type Props = {
  projectRoot: "/react-app"
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

export class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      editorValue: initialCode
    }
  }

  async commitFile(filepath: string, content: string) {
    const repo: Repository = {
      dir: this.props.projectRoot,
      fs: window.fs
    }
    const hash = await commitSingleFileInRepository(repo, filepath, content)
    console.log("commited", Date.now().toString())
  }

  async componentDidMount() {
    const repo: Repository = {
      dir: this.props.projectRoot,
      fs: window.fs
    }
    await initGitProject(repo)

    // const initialized = await pify(window.fs.exists)(repo.dir + "/.git")
    // if (!initialized) {
    //   await git.init(repo)
    // } else {
    //   console.log("git initialized")
    // }
    // await git.add({ ...repo, filepath: "README.md" })
    // const status = await git.status({ ...repo, filepath: "README.md" })
    // console.log(status)
    // const list = await git.listFiles(repo)
    // console.log("lsret", list)
  }
  render() {
    const { editorValue } = this.state
    return (
      <Layout>
        <Header>React Playground</Header>
        <Editor>
          <MyMonacoEditor
            initialValue={editorValue}
            onSave={value => {
              console.log("on save", value)
              this.setState({ editorValue: value })
            }}
          />
        </Editor>
        <Preview>
          <BabelCodePreview code={editorValue} />
        </Preview>
      </Layout>
    )
  }
}

export const Layout = styled.div`
  width: 100vx;
  height: 90vh;
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 40px 1fr 1fr;
  grid-template-areas: "header header header" "menu editor preview" "menu editor preview";
`

export const Header = styled.div`
  grid-area: header;
`

export const Menu = styled.div`
  grid-area: menu;
`

export const Editor = styled.div`
  grid-area: editor;
`

export const Preview = styled.div`
  grid-area: preview;
`
