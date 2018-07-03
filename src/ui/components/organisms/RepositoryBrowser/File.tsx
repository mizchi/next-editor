import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import "react-contexify/dist/ReactContexify.min.css"
import FaFile from "react-icons/fa/file"
import { connect } from "react-redux"
import { loadFile } from "../../../reducers/editor"

type OwnProps = {
  depth: number
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
      const { depth, filepath } = this.props
      const basename = path.basename(filepath)
      const prefix = range(depth)
        .map((_: any, i: number) => "◽")
        .join("")

      const suffix = ""
      return (
        <div>
          <ContextMenuProvider id="file" data={{ filepath }}>
            <div onClick={() => this.props.loadFile(filepath)}>
              <span>{prefix}</span>
              <FaFile />
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
