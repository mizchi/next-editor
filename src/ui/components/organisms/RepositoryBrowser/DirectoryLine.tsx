import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import FaFile from "react-icons/fa/file"
import FaFolder from "react-icons/fa/folder"
import FaFolderOpen from "react-icons/fa/folder-open"
import FaTrash from "react-icons/fa/trash"
import Tooltip from "react-tooltip"
import lifecycle from "recompose/lifecycle"
import styled from "styled-components"
import { readFileStats } from "../../../../domain/filesystem/queries/readFileStats"
import { FileInfo } from "../../../../domain/types"
import { connector } from "../../../actions"
import * as EditorActions from "../../../actions/editorActions"
import { RootState } from "../../../reducers"
import * as RepositoryActions from "../../../reducers/repository"
import { AddDir } from "./AddDir"
import { AddFile } from "./AddFile"
import { FileLine } from "./FileLine"

type OwnProps = {
  root: string
  dirpath: string
  depth: number
  open?: boolean
  ignoreGit?: boolean
}

type Props = OwnProps & {
  editingFilepath: string | null
  touchCounter: number
  isFileCreating: boolean
  isDirCreating: boolean
  startFileCreating: typeof RepositoryActions.startFileCreating
  startDirCreating: typeof RepositoryActions.startDirCreating
  deleteDirectory: typeof EditorActions.deleteDirectory
}

export const DirectoryLine: React.ComponentType<OwnProps> = connector(
  (state: RootState, ownProps: OwnProps) => {
    return {
      ...ownProps,
      editingFilepath: state.buffer.filepath,
      touchCounter: state.repository.touchCounter,
      isFileCreating: ownProps.dirpath === state.repository.fileCreatingDir,
      isDirCreating: ownProps.dirpath === state.repository.dirCreatingDir
    }
  },
  actions => {
    return {
      startFileCreating: actions.repository.startFileCreating,
      startDirCreating: actions.repository.startDirCreating,
      deleteDirectory: actions.editor.deleteDirectory
    }
  }
)(props => {
  return <DirectoryLineContent {...props} />
})

type State = {
  opened: boolean
  fileList: FileInfo[] | null
  loaded: boolean
  loading: boolean
  error: null
  hovered: boolean
}

const DirectoryLineContent: React.ComponentClass<
  Props
> = class extends React.Component<Props, State> {
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
    if (
      this.state.opened &&
      prevProps.touchCounter !== this.props.touchCounter
    ) {
      this._updateChildren()
    }
  }

  async _updateChildren() {
    try {
      const fileList = await readFileStats(this.props.root, this.props.dirpath)
      this.setState({ fileList, loaded: true, loading: false })
    } catch (error) {
      this.setState({ loaded: true, loading: false, error })
    }
  }

  render() {
    const { dirpath, depth, root, ignoreGit = false } = this.props
    const { opened, fileList } = this.state

    const relpath = path.relative(root, dirpath)
    const basename = path.basename(relpath)
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
                  <Prefix depth={depth} />
                  {opened ? <FaFolderOpen /> : <FaFolder />}
                  &nbsp;
                  {basename || `${dirpath}`}
                </div>
                {this.state.hovered && (
                  <HoveredMenu
                    root={root}
                    basename={basename}
                    dirpath={dirpath}
                    onClickFile={event => {
                      event.stopPropagation()
                      this.setState({ opened: true }, () => {
                        this.props.startFileCreating({
                          fileCreatingDir: dirpath
                        })
                      })
                    }}
                    onClickDir={event => {
                      event.stopPropagation()
                      this.setState({ opened: true }, () => {
                        this.props.startDirCreating({
                          dirCreatingDir: dirpath
                        })
                      })
                    }}
                    onClickRemove={event => {
                      event.stopPropagation()
                      if (window.confirm(`Confirm: delete ${dirpath}`)) {
                        this.props.deleteDirectory({ dirpath })
                      }
                    }}
                  />
                )}
              </div>
            </div>
            {opened && (
              <>
                {this.props.isFileCreating && (
                  <div>
                    <Prefix depth={depth + 1} />
                    <AddFile parentDir={dirpath} />
                  </div>
                )}
                {this.props.isDirCreating && (
                  <div>
                    <Prefix depth={depth + 1} />
                    <AddDir parentDir={dirpath} />
                  </div>
                )}
              </>
            )}
          </Container>
        </MyContextMenuProvider>
        {opened &&
          fileList != null && (
            <LinkedLines
              root={root}
              dirpath={dirpath}
              depth={depth + 1}
              fileList={fileList}
              ignoreGit={ignoreGit}
            />
          )}
      </>
    )
  }
}

const LinkedLines = ({
  dirpath,
  root,
  depth,
  fileList,
  ignoreGit
}: {
  dirpath: string
  root: string
  depth: number
  fileList: FileInfo[]
  ignoreGit: boolean
}) => {
  return (
    <>
      {fileList.map((f: FileInfo) => {
        const filepath = path.join(dirpath, f.name)
        if (f.type === "file") {
          return (
            <FileLine
              key={f.name}
              depth={depth}
              filepath={filepath}
              ignoreGit={ignoreGit}
            />
          )
        } else if (f.type === "dir") {
          return (
            <DirectoryLine
              key={f.name}
              root={root}
              dirpath={filepath}
              depth={depth}
              ignoreGit={f.name === ".git"} // TODO: See .gitignore
            />
          )
        }
      })}
    </>
  )
}

export const RootDirectory: React.ComponentType<OwnProps> = lifecycle({
  // async componentDidMount() {}
})(DirectoryLine)
const Container = styled.div`
  cursor: pointer;
  user-select: none;
  padding-left: 2px;
  &:hover {
    background: black;
    color: white;
  }
`

const HoveredMenu = (props: {
  basename: string
  dirpath: string
  root: string
  onClickFile: (event: Event) => any
  onClickDir: (event: Event) => any
  onClickRemove: (event: Event) => any
}) => (
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
      onClick={event => props.onClickFile(event as any)}
    />
    <FaFolder
      data-tip
      data-for="new-dir"
      onClick={event => props.onClickDir(event as any)}
    />
    {props.basename !== ".git" &&
      props.dirpath !== props.root && (
        <FaTrash
          data-tip
          data-for="delete"
          onClick={ev => props.onClickRemove(ev as any)}
        />
      )}
  </div>
)

const Prefix = ({ depth }: { depth: number }) => (
  <>{range(depth).map((_, k) => <span key={k}>&nbsp;&nbsp;</span>)}</>
)
