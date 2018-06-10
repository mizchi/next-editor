import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import {
  CommitDescription,
  getLogInRepository,
  listGitFilesInRepository
} from "../../lib/repository"
import { RootState } from "../../reducers"

type Props = {
  projectRoot: string
  touchCounter: number
}

type State = {
  gitFiles: Array<{
    filepath: string
    gitStatus: string
  }>
  history: CommitDescription[]
}

const selector = (state: RootState) => {
  return {
    projectRoot: state.repository.currentProjectRoot,
    touchCounter: state.repository.touchCounter
  }
}

export const GitStatusViewer = connect(selector)(
  class extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props)
      this.state = {
        gitFiles: [],
        history: []
      }
    }

    async componentDidMount() {
      this._updateStatus()
    }

    async componentDidUpdate(prevProps: Props) {
      if (prevProps.touchCounter !== this.props.touchCounter) {
        this._updateStatus()
      }
    }

    render() {
      const { projectRoot } = this.props
      const { gitFiles, history } = this.state
      return (
        <Container>
          <h2>GitStatus</h2>
          <p>{projectRoot}</p>
          {gitFiles.map(f => {
            return (
              <div key={f.filepath}>
                {f.filepath} / {f.gitStatus}
              </div>
            )
          })}
          <hr />
          {history.map((descrption, idx) => {
            return (
              <div key={descrption.oid}>
                {descrption.oid.slice(0, 7)}|{descrption.message}
              </div>
            )
          })}
        </Container>
      )
    }

    private async _updateStatus() {
      const { projectRoot } = this.props
      const gitFiles = await listGitFilesInRepository(projectRoot)
      const history = await getLogInRepository(projectRoot, {})
      this.setState({ gitFiles, history })
    }
  }
)

const Container = styled.div`
  padding: 10px;
`
