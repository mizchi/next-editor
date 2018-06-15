import faFolder from "@fortawesome/fontawesome-free-solid/faFolder"
import faFolderOpen from "@fortawesome/fontawesome-free-solid/faFolderOpen"
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import { connect } from "react-redux"
import lifecycle from "recompose/lifecycle"
import { FileInfo, readFileStats } from "../../../lib/repository"
import { RootState } from "../../../reducers"
import { AddFile } from "./AddFile"
import { File } from "./File"

type OwnProps = {
  root: string
  dPath: string
  depth: number
  open?: boolean
  ignoreGit?: boolean
}

type Props = OwnProps & {
  lastChangedPath: string
  touchCounter: number
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
      touchCounter: state.repository.touchCounter
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
      const { dPath, depth, root, ignoreGit = false } = this.props
      const { opened, fileList, loading, loaded } = this.state

      const relPath = path.relative(root, dPath)
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
            <button
              onClick={() => {
                this.setState({ opened: !this.state.opened })
              }}
            >
              {opened ? (
                <FontAwesomeIcon icon={faFolderOpen} />
              ) : (
                <FontAwesomeIcon icon={faFolder} />
              )}
            </button>
            &nbsp;
            <MyContextMenuProvider
              id="directory"
              data={{ dirpath: dPath }}
              component="span"
            >
              {basename || `${dPath}`}
            </MyContextMenuProvider>
          </div>
          {opened && (
            <>
              {!ignoreGit && (
                <div>
                  {prefixPlusOne}
                  <AddFile parentDir={dPath} />
                </div>
              )}
              {fileList != null &&
                fileList.map((f: FileInfo) => {
                  const filepath = path.join(dPath, f.name)
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
                          dPath={path.join(dPath, f.name)}
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
        const fileList = await readFileStats(this.props.root, this.props.dPath)
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
