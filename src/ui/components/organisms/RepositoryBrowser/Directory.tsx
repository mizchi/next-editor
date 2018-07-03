import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import FaFolder from "react-icons/fa/folder"
import FaFolderOpen from "react-icons/fa/folder-o"
import { connect } from "react-redux"
import { lifecycle } from "recompose"
import styled from "styled-components"
import { readFileStats } from "../../../../domain/filesystem/queries/readFileStats"
import { FileInfo } from "../../../../domain/types"
import { RootState } from "../../../reducers"
import { AddDir } from "./AddDir"
import { AddFile } from "./AddFile"
import { File } from "./File"

type OwnProps = {
  root: string
  dirpath: string
  depth: number
  open?: boolean
  ignoreGit?: boolean
}

type Props = OwnProps & {
  lastChangedPath: string
  touchCounter: number
  isFileCreating: boolean
  isDirCreating: boolean
}

type State = {
  opened: boolean
  fileList: FileInfo[] | null
  loaded: boolean
  loading: boolean
  error: null
}

export const Directory: React.ComponentType<OwnProps> = connect(
  (state: RootState, ownProps: OwnProps): Props => {
    return {
      ...ownProps,
      lastChangedPath: state.repository.lastChangedPath,
      touchCounter: state.repository.fsTouchCounter,
      isFileCreating: ownProps.dirpath === state.repository.fileCreatingDir,
      isDirCreating: ownProps.dirpath === state.repository.dirCreatingDir
    }
  }
)(
  class extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props)
      this.state = {
        opened: this.props.open || false,
        fileList: null,
        loaded: false,
        loading: true,
        error: null
      }
    }

    async componentDidMount() {
      this._updateChildren()
    }

    async componentDidUpdate(prevProps: Props) {
      // TODO: See lastChangedPath
      if (
        this.state.opened &&
        prevProps.touchCounter !== this.props.touchCounter
      ) {
        this._updateChildren()
      }
    }

    render() {
      const { dirpath, depth, root, ignoreGit = false } = this.props
      const { opened, fileList, loading, loaded } = this.state

      const relPath = path.relative(root, dirpath)
      const basename = path.basename(relPath)
      const prefix = range(depth)
        .map(_ => "◽")
        .join("")
      const prefixPlusOne = range(depth + 1)
        .map(_ => "◽")
        .join("")

      // Just casting
      const MyContextMenuProvider: any = ContextMenuProvider
      return (
        <div>
          <div>
            {prefix}
            <DirectoryButton
              onClick={() => {
                this.setState({ opened: !this.state.opened })
              }}
            >
              {opened ? <FaFolderOpen /> : <FaFolder />}
            </DirectoryButton>
            &nbsp;
            <MyContextMenuProvider
              id="directory"
              data={{ dirpath }}
              component="span"
            >
              {basename || `${dirpath}`}
            </MyContextMenuProvider>
          </div>
          {opened && (
            <>
              {this.props.isFileCreating && (
                <div>
                  {prefixPlusOne}
                  <AddFile parentDir={dirpath} />
                </div>
              )}
              {this.props.isDirCreating && (
                <div>
                  {prefixPlusOne}
                  <AddDir parentDir={dirpath} />
                </div>
              )}
              {fileList != null &&
                fileList.map((f: FileInfo) => {
                  const filepath = path.join(dirpath, f.name)
                  return (
                    <div key={f.name}>
                      {f.type === "file" && (
                        <File
                          depth={depth + 1}
                          filepath={filepath}
                          ignoreGit={ignoreGit}
                        />
                      )}
                      {f.type === "dir" && (
                        <Directory
                          root={root}
                          dirpath={path.join(dirpath, f.name)}
                          depth={depth + 1}
                          ignoreGit={f.name === ".git"} // TODO: See .gitignore
                        />
                      )}
                    </div>
                  )
                })}
            </>
          )}
        </div>
      )
    }

    private async _updateChildren() {
      try {
        const fileList = await readFileStats(
          this.props.root,
          this.props.dirpath
        )
        this.setState({ fileList, loaded: true, loading: false })
      } catch (error) {
        this.setState({ loaded: true, loading: false, error })
      }
    }
  }
)

export const RootDirectory: React.ComponentType<OwnProps> = lifecycle({
  // async componentDidMount() {}
})(Directory)

const DirectoryButton = styled.button`
  color: white;
  background: black;
  border: none;
  outline: none;
`
