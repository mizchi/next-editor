import range from "lodash/range"
import path from "path"
import React from "react"
import { readFiles, Repository } from "../../lib/gitActions"
import { DataLoader } from "../atoms/DataLoader"
import { ProjectConsumer } from "../atoms/ProjectContext"

export function FileBrowser() {
  return (
    <ProjectConsumer>
      {(context: any) => {
        return (
          <div>
            {/* <div>Proj: {context.repo.dir}</div> */}
            <DirectoryNode
              repo={context.repo}
              dPath={context.repo.dir}
              depth={0}
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
}

export class DirectoryNode extends React.Component<Props, { opened: boolean }> {
  constructor(props: Props) {
    super(props)
    this.state = {
      opened: true
    }
  }
  render() {
    const { dPath, repo, depth } = this.props
    const { opened } = this.state

    const relPath = path.relative(repo.dir, dPath)
    // const dirname = path.dirname()
    // const basename = path.basename(dPath)

    const prefix = range(depth)
      .map(_ => "  ")
      .join("")
    return (
      <div>
        <div>
          <button
            onClick={() => {
              this.setState({ opened: !this.state.opened })
            }}
          >
            {opened ? "-" : "+"}
          </button>
          &nbsp;{relPath || "<root>"}
        </div>
        {opened && (
          <FileListLoader aPath={path.join(repo.dir, relPath)}>
            {({ files }: { files: string[] }) => {
              return (
                <>
                  {files.map(fname => {
                    return <div key={fname}>- {fname}</div>
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
    <DataLoader<{ files: string[] }>
      loader={async () => {
        const files = await readFiles(aPath)
        return { files }
      }}
    >
      {({ loading, loaded, data }: any) => {
        const { files } = data
        if (!loaded) {
          return <span>...</span>
        } else {
          return <props.children files={files} />
        }
      }}
    </DataLoader>
  )
}
