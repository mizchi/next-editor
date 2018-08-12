import { Icon, Tooltip } from "@blueprintjs/core"
import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import { DragDropContext } from "react-dnd"
import ReactDnDHTML5Backend from "react-dnd-html5-backend"
import lifecycle from "recompose/lifecycle"
import { compose } from "redux"
import styled from "styled-components"
import { readFileStats } from "../../../../domain/filesystem/queries/readFileStats"
import { FileInfo } from "../../../../domain/types"
import { connector } from "../../../actionCreators"
import * as EditorActions from "../../../actionCreators/editorActions"
import { RootState } from "../../../reducers"
import * as RepositoryActions from "../../../reducers/repository"
import { Pathname } from "../../atoms/Pathname"
import { AddDir } from "./AddDir"
import { AddFile } from "./AddFile"
import { Draggable } from "./Draggable"
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
  fileMoved: typeof EditorActions.fileMoved
}

type DirectroyState = {
  opened: boolean
  fileList: FileInfo[] | null
  loaded: boolean
  loading: boolean
  error: null
  hovered: boolean
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
      fileMoved: actions.editor.fileMoved,
      startFileCreating: actions.repository.startFileCreating,
      startDirCreating: actions.repository.startDirCreating,
      deleteDirectory: actions.editor.deleteDirectory
    }
  }
)(function DirectoryLineImpl(props) {
  return <DirectoryLineContent {...props} />
})

const DirectoryLineContent: React.ComponentClass<
  Props
> = class extends React.Component<Props, DirectroyState> {
  _unmounted: boolean = false

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

  componentWillUnmount() {
    this._unmounted = true
  }

  async _updateChildren() {
    if (this._unmounted) {
      return
    }
    try {
      const fileList = await readFileStats(this.props.root, this.props.dirpath)
      this.setState({ fileList, loaded: true, loading: false })
    } catch (error) {
      this.setState({ loaded: true, loading: false, error })
    }
  }

  render() {
    const { dirpath, depth, root } = this.props
    const { opened, fileList } = this.state

    const relpath = path.relative(root, dirpath)
    const basename = path.basename(relpath)

    const ignoreGit = relpath === ".git" || this.props.ignoreGit || false

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
              if (!this.state.loading) {
                this.setState({ opened: !this.state.opened })
              }
            }}
          >
            <Draggable
              pathname={dirpath}
              type="dir"
              onDrop={result => {
                if (result) {
                  this.props.fileMoved(result)
                }
              }}
              onDropByOther={_result => {
                this.setState({ opened: true })
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ flex: 1 }}>
                  <Prefix depth={depth} />
                  {opened ? (
                    <Icon icon="folder-open" />
                  ) : (
                    <Icon icon="folder-close" />
                  )}
                  &nbsp;
                  <Pathname ignoreGit={ignoreGit}>
                    {basename || `${dirpath}`}
                  </Pathname>
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
            </Draggable>
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
              editingFilepath={this.props.editingFilepath}
            />
          )}
      </>
    )
  }
}

function LinkedLines({
  dirpath,
  root,
  depth,
  fileList,
  editingFilepath
}: {
  dirpath: string
  root: string
  depth: number
  fileList: FileInfo[]
  editingFilepath: string | null
}) {
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
              ignoreGit={f.ignored}
            />
          )
        } else if (f.type === "dir") {
          return (
            <DirectoryLine
              key={f.name}
              root={root}
              dirpath={filepath}
              depth={depth}
              open={
                // open if dir includes editing filepath
                editingFilepath != null &&
                !path.relative(filepath, editingFilepath).startsWith("..")
              }
              ignoreGit={f.ignored} // TODO: See .gitignore
            />
          )
        }
      })}
    </>
  )
}

export const RootDirectory: React.ComponentType<OwnProps> = compose(
  lifecycle({
    async componentDidMount() {
      //
    }
  }),
  DragDropContext(ReactDnDHTML5Backend)
)(DirectoryLine) as any

// Styled

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
    <Tooltip content="Create new file" position="top">
      <Icon
        icon="document"
        onClick={event => props.onClickFile(event as any)}
      />
    </Tooltip>

    <Tooltip content="Creat new dir" position="top">
      <Icon
        icon="folder-new"
        data-tip
        data-for="new-dir"
        onClick={event => props.onClickDir(event as any)}
      />
    </Tooltip>

    {props.basename !== ".git" &&
      props.dirpath !== props.root && (
        <Tooltip content="Delete" position="top">
          <Icon
            icon="trash"
            data-tip
            data-for="delete"
            onClick={ev => props.onClickRemove(ev as any)}
          />
        </Tooltip>
      )}
  </div>
)

const Prefix = ({ depth }: { depth: number }) => (
  <>
    {range(depth).map((_, k) => (
      <span key={k}>&nbsp;&nbsp;</span>
    ))}
  </>
)
