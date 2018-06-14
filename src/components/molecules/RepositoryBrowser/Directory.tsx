import faFolder from "@fortawesome/fontawesome-free-solid/faFolder"
import faFolderOpen from "@fortawesome/fontawesome-free-solid/faFolderOpen"
import FontAwesomeIcon from "@fortawesome/react-fontawesome"
import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import lifecycle from "recompose/lifecycle"
import { FileInfo } from "../../../lib/repository"
import { AddFile } from "./AddFile"
import { File } from "./File"
import { FileListLoader } from "./FileListLoader"

type Props = {
  root: string
  dPath: string
  depth: number
  open?: boolean
  ignoreGit?: boolean
}

export class Directory extends React.Component<Props, { opened: boolean }> {
  constructor(props: Props) {
    super(props)
    this.state = { opened: this.props.open || false }
  }
  render() {
    const { dPath, depth, root, ignoreGit = false } = this.props
    const { opened } = this.state

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
            <FileListLoader root={root} aPath={path.join(root, relPath)}>
              {({
                data,
                loading
              }: {
                loading: boolean
                data: { fileList: FileInfo[] } | null
              }) => {
                if (loading) {
                  return null
                } else if (data != null) {
                  return (
                    <DirectoryFileList
                      fileList={data.fileList}
                      depth={depth}
                      dPath={dPath}
                      root={root}
                      ignoreGit={ignoreGit}
                    />
                  )
                }
              }}
            </FileListLoader>
          </>
        )}
      </div>
    )
  }
}

function DirectoryFileList({
  root,
  fileList,
  depth,
  dPath,
  ignoreGit = false
}: {
  root: string
  fileList: FileInfo[]
  dPath: string
  depth: number
  ignoreGit?: boolean
}) {
  return (
    <>
      {fileList.map((f: FileInfo) => {
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
  )
}

export const RootDirectory: React.ComponentType<Props> = lifecycle({
  // async componentDidMount() {}
})(Directory)
