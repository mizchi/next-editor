import React from "react"

const ProjectContext: any = React.createContext("project")

type Props = {
  projectRoot: string
  children: React.ReactNode
}

type State = {
  repo: {
    fs: any
    dir: string
  }
}

export class ProjectProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const fs = require("fs")
    this.state = { repo: { fs, dir: props.projectRoot } }
  }
  render() {
    const Provider = ProjectContext.Provider
    return (
      // tslint:disable
      <Provider value={{ repo: this.state.repo }}>
        {this.props.children}
      </Provider>
    )
  }
}

export const ProjectConsumer: any = ProjectContext.Consumer

// export class ProjectConsumer extends React.Component<Props, State> {
//   constructor(props: Props) {
//     super(props)
//     this.state = { repo: { fs, dir: props.projectRoot } }
//   }
//   render() {
//     const Provider = RepositoryContext.Consumber
//     return (
//       // tslint:disable
//       <Provider repo={this.state.repo}>{this.props.children}</Provider>
//     )
//   }
// }
