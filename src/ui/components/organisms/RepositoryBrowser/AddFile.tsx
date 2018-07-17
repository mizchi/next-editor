import path from "path"
import React from "react"
import FaFile from "react-icons/fa/file"
import { connect } from "react-redux"
import styled from "styled-components"
import Actions from "../../../actions"
import { RootState } from "../../../reducers"

const actions = {
  createFile: Actions.editor.createFile,
  createDirectory: Actions.editor.createDirectory,
  finishFileCreating: Actions.editor.finishFileCreating,
  cancelFileCreating: Actions.repository.cancelFileCreating
}

type OwnProps = {
  parentDir: string
}

type Props = OwnProps & typeof actions

type State = {
  value: string
}

export const AddFile = (connect as any)(
  (_state: RootState, ownProps: OwnProps) => ownProps,
  actions
)(
  class extends React.Component<Props, State> {
    inputRef: any = React.createRef()
    constructor(props: Props) {
      super(props)
      this.state = {
        value: ""
      }
    }

    componentDidMount() {
      this.inputRef.current.focus()
    }

    render() {
      const { parentDir } = this.props
      const { value } = this.state
      return (
        <Container>
          <FaFile />
          <input
            ref={this.inputRef}
            value={value}
            onChange={event => {
              this.setState({ value: event.target.value })
            }}
            onBlur={() => {
              this.props.cancelFileCreating({})
            }}
            onKeyDown={ev => {
              if (ev.keyCode === 27) {
                this.props.cancelFileCreating({})
              }
              if (ev.keyCode === 13) {
                const filepath = path.join(parentDir, value)
                this.props.finishFileCreating({ filepath })
              }
            }}
          />
        </Container>
      )
    }
  }
)

const Container = styled.div`
  display: inline-block;
`
