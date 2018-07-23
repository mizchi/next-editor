import format from "date-fns/format"
import path from "path"
import React from "react"
import { getFileHistory } from "../../../domain/git/queries/getFileHistory"
import { connector } from "../../actionCreators"
import { loadFile } from "../../actionCreators/editorActions"

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
      updateFileContent: actions.editor.updateFileContent
    }
  }
)(props => {
  const { filepath, projectRoot, currentBranch, updateFileContent } = props
  if (filepath) {
    return (
      <FileHistoryContent
        filepath={filepath}
        projectRoot={projectRoot}
        currentBranch={currentBranch}
        onCheckout={(_oid, value) => {
          updateFileContent(filepath, value)
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
    }>
  }
> {
  state = {
    history: []
  }

  async componentDidMount() {
    //
    const { filepath, projectRoot, currentBranch } = this.props
    const relpath = path.relative(projectRoot, filepath)
    const changeHistory = await getFileHistory(
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
          content: c.blob.object.toString()
        }
      })
      .reverse()
    this.setState({ history })
  }
  render() {
    const { filepath, projectRoot, currentBranch, onCheckout } = this.props
    const relpath = path.relative(projectRoot, filepath)
    return (
      <div style={{ padding: 10 }}>
        {projectRoot}: {relpath} on {currentBranch}
        <hr />
        {this.state.history.map((h: any) => {
          return (
            <div key={h.commitId}>
              {format(h.timestamp * 1000, "MM/DD HH:mm")}
              :
              {h.message}
              &nbsp;
              <button
                onClick={() => {
                  onCheckout(h.blobId, h.content)
                }}
              >
                checkout
              </button>
            </div>
          )
        })}
      </div>
    )
  }
}
