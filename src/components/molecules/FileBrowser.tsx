import path from "path"
import React, { Children } from "react"
import { readFiles, Repository } from "../../lib/gitActions"
import { ProjectConsumer } from "../atoms/ProjectContext"

export function FileBrowser() {
  return (
    <ProjectConsumer>
      {(context: any) => {
        return (
          <div>
            <div>Proj: {context.repo.dir}</div>
            <DirectoryNode repo={context.repo} dirpath="." />
          </div>
        )
      }}
    </ProjectConsumer>
  )
}

type Props = {
  dirpath: string
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
    const { dirpath, repo } = this.props
    const { opened } = this.state
    const dirname = path.dirname(dirpath)
    const basename = path.basename(dirpath)
    return (
      <div>
        {opened && (
          <FileListLoader aPath={path.join(repo.dir, dirpath)}>
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

class FileListLoader extends React.Component<
  { aPath: string; children: any },
  { loading: boolean; loaded: boolean; files: string[]; error: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = {
      error: false,
      files: [],
      loaded: false,
      loading: true
    }
  }

  async componentDidMount() {
    const { aPath } = this.props
    const files = await readFiles(aPath)
    this.setState({ files, loaded: true, loading: false })
  }

  render() {
    const { loading, loaded, files } = this.state
    if (!loaded) {
      return <span>...</span>
    } else {
      return <this.props.children files={this.state.files} />
    }
  }
}
