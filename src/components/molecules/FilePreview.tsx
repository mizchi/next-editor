import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../reducers"
import { EditorState } from "../../reducers/editor"
import { BabelCodePreview } from "../atoms/BabelCodePreview"
import { MarkdownPreview } from "../atoms/MarkdownPreview"
import { GitStatusViewer } from "../organisms/GitStatusViewer/index"

const selector = (state: RootState) => state.editor

export const FilePreview = connect(selector)((props: EditorState) => {
  return <GitStatusViewer />
  switch (props.fileType) {
    case "javascript": {
      return <BabelCodePreview source={props.value || ""} />
    }
    case "markdown": {
      return <MarkdownPreview source={props.value || ""} />
    }
    case "text": {
      return <pre>{props.value || ""}</pre>
    }
  }
})
