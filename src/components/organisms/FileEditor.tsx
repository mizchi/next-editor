import React from "react"
import styled from "styled-components"
import { EditorConsumer, EditorContext } from "../../contexts/EditorContext"
import { writeFile } from "../../lib/gitActions"
import { JavaScriptEditor } from "../atoms/JavaScriptEditor"
import { MarkdownEditor } from "../atoms/MarkdownEditor"

const initialCode = `// code
import React from 'https://dev.jspm.io/react';
import ReactDOM from 'https://dev.jspm.io/react-dom';

const el = document.querySelector('#app-root')
ReactDOM.render(<h1>Hello</h1>, el)
`

type Props = {
  // fPath: string
}
type State = {
  editorValue: string
}
export class FileEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      editorValue: initialCode
    }
  }

  // async commitFile(filepath: string, content: string) {
  //   const repo: Repository = {
  //     dir: this.props.projectRoot,
  //     fs
  //   }
  //   const hash = await commitSingleFileInRepository(repo, filepath, content)
  //   console.log("commited", Date.now().toString())
  // }

  render() {
    const { editorValue } = this.state
    return (
      <Layout>
        <Filename>
          <EditorFileTitle />
        </Filename>
        <Content>
          <EditorContent />
        </Content>
      </Layout>
    )
  }
}

function EditorFileTitle() {
  return (
    <EditorConsumer>
      {(context: EditorContext) => {
        return <span>{context.filePath || "Not Selected"}</span>
      }}
    </EditorConsumer>
  )
}

function EditorContent() {
  return (
    <EditorConsumer>
      {(context: EditorContext) => {
        switch (context.fileType) {
          case "javascript": {
            return (
              <JavaScriptEditor
                initialValue={context.value || ""}
                onSave={newValue => {
                  console.log("on save", newValue)
                  // this.setState({ editorValue: value })
                }}
                onChange={async newValue => {
                  console.log("on change", newValue)
                  if (context.filePath) {
                    await writeFile(context.filePath, newValue)
                    console.log("saved", newValue)
                  }
                }}
              />
            )
          }
          case "markdown": {
            return (
              <MarkdownEditor
                initialValue={context.value || ""}
                onSave={newValue => {
                  console.log("on save", newValue)
                  // this.setState({ editorValue: value })
                }}
                onChange={async newValue => {
                  if (context.filePath) {
                    await writeFile(context.filePath, newValue)
                    console.log("saved", newValue)
                  }
                }}
              />
            )
          }
          default: {
            return "Loading..."
          }
        }
      }}
    </EditorConsumer>
  )
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Filename = styled.div`
  width: 100%;
  height: 30px;
`

const Content = styled.div`
  flex: 1;
`
