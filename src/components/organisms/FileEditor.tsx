import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { RootState } from "../../reducers"
import { EditorContent } from "../molecules/EditorContent"

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

const EditorFileTitle = connect((state: RootState) => {
  return { filePath: state.editor.filePath }
})(({ filePath }: any) => {
  return <span>{filePath || "Not Selected"}</span>
})

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
