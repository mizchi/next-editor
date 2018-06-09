import range from "lodash/range"
import path from "path"
import React from "react"
import { lifecycle } from "recompose"
import { EditorConsumer } from "../../contexts/EditorContext"
import { ProjectConsumer } from "../../contexts/ProjectContext"
import {
  ensureProjectRepository,
  FileInfo,
  readFileStats,
  Repository
} from "../../lib/gitActions"
import { DataLoader } from "../atoms/DataLoader"

export function FileBrowser() {
  return (
    <ProjectConsumer>
      {(context: any) => {
        return (
          <div>
            <RootDirectoryNode
              repo={context.repo}
              dPath={context.repo.dir}
              depth={0}
              open
            />
          </div>
        )
      }}
    </ProjectConsumer>
  )
}

type Props = {
  dPath: string
  depth: number
  repo: Repository
  open?: boolean
}

export class FileNode extends React.Component<{
  depth: number
  fPath: string
}> {
  render() {
    const { depth, fPath } = this.props
    const basename = path.basename(fPath)
    const prefix = range(depth)
      .map(_ => "◽")
      .join("")
    // return <div>{`${prefix}  - ${basename}`}</div>
    return (
      <EditorConsumer>
        {(context: any) => {
          return (
            <div
              onClick={() => {
                console.log("load start2", fPath)
                context.load(fPath)
              }}
            >{`${prefix}  - ${basename}`}</div>
          )
        }}
      </EditorConsumer>
    )
  }
}

export class DirectoryNode extends React.Component<Props, { opened: boolean }> {
  constructor(props: Props) {
    super(props)
    this.state = { opened: this.props.open || false }
  }
  render() {
    const { dPath, repo, depth } = this.props
    const { opened } = this.state

    const relPath = path.relative(repo.dir, dPath)
    // const rootPrefix = range(depth + 2)
    const basename = path.basename(relPath)
    const prefix = range(depth)
      .map(_ => "◽")
      .join("")

    return (
      <div>
        <div>
          {prefix}
          <button
            onClick={() => {
              this.setState({ opened: !this.state.opened })
            }}
          >
            {opened ? "-" : "+"}
          </button>
          &nbsp;
          {basename || `${dPath}`}
        </div>
        {opened && (
          <FileListLoader aPath={path.join(repo.dir, relPath)}>
            {({ fileList }: { fileList: FileInfo[] }) => {
              return (
                <>
                  {fileList.map((f: FileInfo) => {
                    const name = path.join(dPath, f.name)
                    return (
                      <div key={f.name}>
                        {f.type === "file" && (
                          <FileNode depth={depth + 1} fPath={name} />
                        )}
                        {f.type === "dir" && (
                          <DirectoryNode
                            dPath={path.join(dPath, f.name)}
                            depth={depth + 1}
                            repo={repo}
                          />
                        )}
                      </div>
                    )
                  })}
                </>
              )
            }}
          </FileListLoader>
        )}
      </div>
    )
  }
}

function FileListLoader(props: { aPath: string; children: any }) {
  const { aPath, children } = props
  return (
    <DataLoader<{ fileList: FileInfo[] }>
      loader={async () => {
        const fileList = await readFileStats(aPath)
        return { fileList }
      }}
    >
      {({ loading, loaded, data }: any) => {
        if (!loaded) {
          // return <span>...</span>
          return ""
        } else {
          const { fileList } = data
          return <props.children fileList={fileList} />
        }
      }}
    </DataLoader>
  )
}

export const RootDirectoryNode: React.ComponentType<Props> = lifecycle({
  async componentDidMount() {
    // const { repo } = this.props as any
    // await ensureProjectRepository(repo)
    // console.log("git init")
    // console.log("started!4")
  }
})(DirectoryNode)
