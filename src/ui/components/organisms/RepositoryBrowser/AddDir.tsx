import path from "path"
import React from "react"
import FaFolder from "react-icons/fa/folder"
import { connect } from "react-redux"
import styled from "styled-components"
import { RootState } from "../../../reducers"
import {
  cancelDirCreating,
  createDirectory,
  createFile,
  finishDirCreating
} from "../../../reducers/repository"

const actions = {
  createFile,
  createDirectory,
  finishDirCreating,
  cancelDirCreating
}

type OwnProps = {
  parentDir: string
}

type Props = OwnProps & typeof actions

type State = {
  value: string
}

export const AddDir = (connect as any)(
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
          <FaFolder />
          <input
            ref={this.inputRef}
            value={value}
            onChange={event => {
              this.setState({ value: event.target.value })
            }}
            onBlur={() => {
              this.props.cancelDirCreating({})
            }}
            onKeyDown={ev => {
              if (ev.keyCode === 27) {
                this.props.cancelDirCreating({})
              }
              if (ev.keyCode === 13) {
                const dirpath = path.join(parentDir, value)
                this.props.finishDirCreating({ dirpath })
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
