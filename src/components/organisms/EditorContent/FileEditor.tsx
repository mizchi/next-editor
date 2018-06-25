import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { RootState } from "../../../reducers"
import { EditorContent } from "../../molecules/EditorContent"

type Props = {}
type State = {
  editorValue: string
}

export class FileEditor extends React.Component<Props, State> {
  render() {
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
  return <span>{filePath || "<not-selected>"}</span>
})

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 95%;
`

const Filename = styled.div`
  width: 100%;
  height: 30px;
`

const Content = styled.div`
  flex: 1;
`
