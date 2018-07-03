import path from "path"
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { RootState } from "../../../reducers"
import {
  cancelFileCreating,
  createDirectory,
  createFile,
  endFileCreating
} from "../../../reducers/repository"

const actions = {
  createFile,
  createDirectory,
  endFileCreating,
  cancelFileCreating
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
          <input
            ref={this.inputRef}
            value={value}
            onChange={event => {
              this.setState({ value: event.target.value })
            }}
            onBlur={() => {
              this.props.cancelFileCreating()
            }}
            onKeyDown={ev => {
              if (ev.keyCode === 27) {
                this.props.cancelFileCreating()
              }
              if (ev.keyCode === 13) {
                this.props.endFileCreating(path.join(parentDir, value))
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
