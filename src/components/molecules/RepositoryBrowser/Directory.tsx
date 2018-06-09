import range from "lodash/range"
import path from "path"
import React from "react"
import lifecycle from "recompose/lifecycle"
import {
  FileInfo,
  readFileStats,
  Repository
} from "../../../lib/repositoryActions"
import { DataLoader } from "../../atoms/DataLoader"
import { File } from "./File"

type Props = {
  dPath: string
  depth: number
  repo: Repository
  open?: boolean
}

export class Directory extends React.Component<Props, { opened: boolean }> {
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
                          <File depth={depth + 1} fPath={name} />
                        )}
                        {f.type === "dir" && (
                          <Directory
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

export const RootDirectory: React.ComponentType<Props> = lifecycle({
  async componentDidMount() {
    // const { repo } = this.props as any
    // await ensureProjectRepository(repo)
    // console.log("git init")
    // console.log("started!4")
  }
})(Directory)
