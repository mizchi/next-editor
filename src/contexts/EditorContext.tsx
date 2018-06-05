import fs from "fs"
import path from "path"
import pify from "pify"
import React from "react"

const Context: any = React.createContext("editor")

type OuterProps = {
  children: React.ReactNode
}

export type State = {
  filePath: string | null
  fileType: "javascript" | "markdown" | "text"
  value: string | null
  loading: boolean
}

export type EditorContext = State & {
  update(s: string): void
}

function detectFileType(filePath: string) {
  const type = path.extname(filePath)
  switch (type) {
    case ".md":
      return "markdown"
    case ".js":
      return "javascript"
    default:
      return "text"
  }
}

export class EditorProvider extends React.Component<OuterProps, State> {
  load: (s: string) => Promise<void>
  constructor(props: OuterProps) {
    super(props)
    this.state = {
      filePath: null,
      fileType: "text",
      loading: true,
      value: null
    }

    this.load = async (filePath: string) => {
      this.setState({ loading: true })
      const fileContent = await pify(fs.readFile)(filePath)

      this.setState((s: State) => {
        return {
          filePath,
          fileType: detectFileType(filePath),
          loading: false,
          value: fileContent.toString()
        }
      })
    }
  }

  componentDidMount() {
    this.load("/react-app/README.md")
  }

  render() {
    return (
      <Context.Provider value={{ ...this.state, load: this.load }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export const EditorConsumer: React.ComponentType<any> = Context.Consumer
