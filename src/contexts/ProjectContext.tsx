import React from "react"

const Context: any = React.createContext("project")

type OuterProps = {
  projectRoot: string
  children: React.ReactNode
}

export type ProjectContext = {
  repo: {
    fs: any
    dir: string
  }
}

export class ProjectProvider extends React.Component<
  OuterProps,
  ProjectContext
> {
  constructor(props: OuterProps) {
    super(props)
    const fs = require("fs")
    this.state = { repo: { fs, dir: props.projectRoot } }
  }
  render() {
    return (
      // tslint:disable
      <Context.Provider value={{ repo: this.state.repo }}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export const ProjectConsumer: any = Context.Consumer
