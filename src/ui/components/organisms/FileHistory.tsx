import { Button, Card } from "@blueprintjs/core"
import format from "date-fns/format"
import path from "path"
import React from "react"
import { getFileHistoryWithDiff } from "../../../domain/git/queries/getFileHistory"
import { connector } from "../../actionCreators"

export const FileHistory = connector(
  state => {
    return {
      filepath: state.buffer.filepath,
      currentBranch: state.git.currentBranch,
      projectRoot: state.git.projectRoot
    }
  },
  actions => {
    return {
      saveFile: actions.editor.saveFile
    }
  }
)(function FileHistoryImpl(props) {
  const { filepath, projectRoot, currentBranch, saveFile } = props
  if (filepath) {
    return (
      <FileHistoryContent
        filepath={filepath}
        projectRoot={projectRoot}
        currentBranch={currentBranch}
        onCheckout={(_oid, value) => {
          saveFile(filepath, value, true)
        }}
      />
    )
  } else {
    return <div>File not selected</div>
  }
})

class FileHistoryContent extends React.Component<
  {
    filepath: string
    projectRoot: string
    currentBranch: string
    onCheckout: (oid: string, value: string) => void
  },
  {
    history: Array<{
      message: string
      commitId: string
      blobId: string
      timestamp: number
      content: string
      diffText: string
    }>
  }
> {
  state = {
    history: []
  }

  async componentDidMount() {
    const { filepath, projectRoot, currentBranch } = this.props
    const relpath = path.relative(projectRoot, filepath)
    const changeHistory = await getFileHistoryWithDiff(
      projectRoot,
      currentBranch,
      relpath
    )
    const history = changeHistory
      .map(c => {
        return {
          message: c.commit.message,
          commitId: c.commit.oid,
          blobId: c.blob.oid,
          timestamp: c.commit.committer.timestamp,
          content: c.blob.object.toString(),
          diffText: c.diff
            .map(d => {
              if (d.added) {
                return "+ " + d.value
              }
              if (d.removed) {
                return "- " + d.value
              }
              return d.value
            })
            .join("\n")
        }
      })
      .reverse()
    this.setState({ history })
  }

  render() {
    const { filepath, projectRoot, currentBranch, onCheckout } = this.props
    const relpath = path.relative(projectRoot, filepath)
    return (
      <div
        style={{
          padding: 10
        }}
      >
        {projectRoot}: {relpath} on {currentBranch}
        <hr />
        {this.state.history.map((h: any) => {
          return (
            <Card key={h.commitId}>
              <div>
                {format(h.timestamp * 1000, "MM/DD-HH:mm")}
                |&nbsp;
                {h.message}
                &nbsp;
                <Button
                  onClick={() => {
                    onCheckout(h.blobId, h.content)
                  }}
                  text="checkout"
                />
              </div>
              <pre className="bp3-code-block">
                <code>{h.diffText}</code>
              </pre>
            </Card>
          )
        })}
      </div>
    )
  }
}
