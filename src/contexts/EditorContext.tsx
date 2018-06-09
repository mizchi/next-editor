import fs from "fs"
import path from "path"
import pify from "pify"
import React from "react"
import { extToFileType } from "../lib/extToFileType"

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
  load(s: string): void
  updateCurrentFileValue(s: string): void
}

export class EditorProvider extends React.Component<OuterProps, State> {
  load: (s: string) => Promise<void>
  updateCurrentFileValue: (s: string) => Promise<void>
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
          fileType: extToFileType(filePath),
          loading: false,
          value: fileContent.toString()
        }
      })
    }

    this.updateCurrentFileValue = async (value: string) => {
      this.setState((s: State) => {
        return {
          ...s,
          value
        }
      })
    }
  }

  componentDidMount() {
    // this.load("/playground/README.md")
  }

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          load: this.load,
          updateCurrentFileValue: this.updateCurrentFileValue
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}

export const EditorConsumer: React.ComponentType<any> = Context.Consumer
