import faFile from "@fortawesome/fontawesome-free-solid/faFile"
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import "react-contexify/dist/ReactContexify.min.css"
import { connect } from "react-redux"
import { loadFile } from "../../../reducers/editor"

type OwnProps = {
  depth: number
  gitStatus: string
  filepath: string
  ignoreGit?: boolean
}

type Props = OwnProps & {
  loadFile: typeof loadFile
}

const selector = (_state: any, ownProps: OwnProps) => {
  return ownProps
}

const actions = {
  loadFile
}

export const File = connect(
  selector,
  actions
)(
  class extends React.Component<Props> {
    render() {
      const { depth, filepath, gitStatus } = this.props
      const basename = path.basename(filepath)
      const prefix = range(depth)
        .map((_: any, i: number) => "◽")
        .join("")

      const suffix = this.props.ignoreGit ? "" : ` [${gitStatus}]`
      return (
        <div>
          <ContextMenuProvider id="file" data={{ filepath }}>
            <div onClick={() => this.props.loadFile(filepath)}>
              <span>{prefix}</span>
              <FontAwesomeIcon icon={faFile} />
              &nbsp;
              <span>{basename}</span>
              <span>{suffix}</span>
            </div>
          </ContextMenuProvider>
        </div>
      )
    }
  }
)
