import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import FaFile from "react-icons/fa/file"
import FaFolder from "react-icons/fa/folder"
import FaFolderOpen from "react-icons/fa/folder-open"
import FaTrash from "react-icons/fa/trash"
import { connect } from "react-redux"
import Tooltip from "react-tooltip"
import { lifecycle } from "recompose"
import styled from "styled-components"
import { readFileStats } from "../../../../domain/filesystem/queries/readFileStats"
import { FileInfo } from "../../../../domain/types"
import { RootState } from "../../../reducers"
import * as RepositoryActions from "../../../reducers/repository"
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

const actions = {
  startFileCreating: RepositoryActions.startFileCreating,
  startDirCreating: RepositoryActions.startDirCreating,
  deleteDirectory: RepositoryActions.deleteDirectory
}

type Props = OwnProps &
  (typeof actions) & {
    lastChangedPath: string
    editingFilepath: string | null
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
  hovered: boolean
}

export const Directory: React.ComponentType<OwnProps> = connect(
  (state: RootState, ownProps: OwnProps) => {
    return {
      ...ownProps,
      editingFilepath: state.editor.filePath,
      lastChangedPath: state.repository.lastChangedPath,
      touchCounter: state.repository.fsTouchCounter,
      isFileCreating: ownProps.dirpath === state.repository.fileCreatingDir,
      isDirCreating: ownProps.dirpath === state.repository.dirCreatingDir
    }
  },
  actions
)(
  class extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props)
      this.state = {
        opened: this.props.open || false,
        fileList: null,
        loaded: false,
        loading: true,
        error: null,
        hovered: false
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
      // Just casting
      const MyContextMenuProvider: any = ContextMenuProvider
      return (
        <>
          <MyContextMenuProvider
            id="directory"
            data={{ dirpath }}
            component="span"
          >
            <Container
              onMouseOver={() => {
                if (!this.state.hovered) {
                  this.setState({ hovered: true })
                }
              }}
              onMouseLeave={() => {
                this.setState({ hovered: false })
              }}
              onClick={() => {
                this.setState({ opened: !this.state.opened })
              }}
            >
              <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ flex: 1 }}>
                    {range(depth).map((_, k) => (
                      <span key={k}>&nbsp;&nbsp;</span>
                    ))}
                    {opened ? <FaFolderOpen /> : <FaFolder />}
                    &nbsp;
                    {basename || `${dirpath}`}
                  </div>
                  {this.state.hovered && (
                    <div style={{ minWidth: "30px" }}>
                      <Tooltip id="new-file" effect="solid">
                        Create new file
                      </Tooltip>
                      <Tooltip id="new-dir" effect="solid">
                        Create new directory
                      </Tooltip>
                      <Tooltip id="delete" effect="solid">
                        Delete
                      </Tooltip>
                      <FaFile
                        data-tip
                        data-for="new-file"
                        onClick={ev => {
                          ev.stopPropagation()
                          this.setState({ opened: true }, () => {
                            this.props.startFileCreating(dirpath)
                          })
                        }}
                      />
                      <FaFolder
                        data-tip
                        data-for="new-dir"
                        onClick={ev => {
                          ev.stopPropagation()
                          this.setState({ opened: true }, () => {
                            this.props.startDirCreating(dirpath)
                          })
                        }}
                      />
                      {basename !== ".git" &&
                        dirpath !== root && (
                          <FaTrash
                            data-tip
                            data-for="delete"
                            onClick={ev => {
                              ev.stopPropagation()
                              if (confirm(`Confirm: delete ${dirpath}`)) {
                                this.props.deleteDirectory(dirpath)
                              }
                            }}
                          />
                        )}
                    </div>
                  )}
                </div>
              </div>

              {opened && (
                <>
                  {this.props.isFileCreating && (
                    <div>
                      {range(depth + 1).map((_, k) => (
                        <span key={k}>&nbsp;&nbsp;</span>
                      ))}
                      <AddFile parentDir={dirpath} />
                    </div>
                  )}
                  {this.props.isDirCreating && (
                    <div>
                      {range(depth + 1).map((_, k) => (
                        <span key={k}>&nbsp;&nbsp;</span>
                      ))}
                      <AddDir parentDir={dirpath} />
                    </div>
                  )}
                </>
              )}
            </Container>
          </MyContextMenuProvider>
          {opened &&
            fileList != null &&
            fileList.map((f: FileInfo) => {
              const filepath = path.join(dirpath, f.name)
              return (
                <React.Fragment key={f.name}>
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
                </React.Fragment>
              )
            })}
        </>
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

const Container = styled.div`
  cursor: pointer;
  user-select: none;
  padding-left: 2px;
  &:hover {
    background: black;
    color: white;
  }
`
