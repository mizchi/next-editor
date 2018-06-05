import React from "react"
import { EditorConsumer, EditorContext } from "../../contexts/EditorContext"
import { BabelCodePreview } from "../atoms/BabelCodePreview"
import { MarkdownPreview } from "../atoms/MarkdownPreview"

export function FilePreview() {
  return (
    <EditorConsumer>
      {(context: EditorContext) => {
        switch (context.fileType) {
          case "javascript": {
            return <BabelCodePreview source={context.value || ""} />
          }
          case "markdown": {
            return <MarkdownPreview source={context.value || ""} />
          }
          case "text": {
            return <pre>{context.value || ""}</pre>
          }
        }
      }}
    </EditorConsumer>
  )
}
