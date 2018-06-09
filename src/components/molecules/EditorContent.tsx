import React from "react"
import { EditorConsumer, EditorContext } from "../../contexts/EditorContext"
import { writeFile } from "../../lib/repository"
import { JavaScriptEditor } from "../atoms/JavaScriptEditor"
import { MarkdownEditor } from "../atoms/MarkdownEditor"

export function EditorContent() {
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
                    context.updateCurrentFileValue(newValue)
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
                    context.updateCurrentFileValue(newValue)
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
