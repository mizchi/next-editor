import path from "path"
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { RootState } from "../../../reducers"
import { createDirectory, createFile } from "../../../reducers/repository"

type OwnProps = {
  parentDir: string
}

type Props = OwnProps & {
  createDirectory: typeof createDirectory
  createFile: typeof createFile
}

type State = {
  value: string
}

export const AddFile = (connect as any)(
  (_state: RootState, ownProps: OwnProps) => ownProps,
  { createFile, createDirectory }
)(
  class extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props)
      this.state = {
        value: ""
      }
    }

    render() {
      const { parentDir } = this.props
      const { value } = this.state
      return (
        <Container>
          <input
            value={value}
            onChange={event => {
              this.setState({ value: event.target.value })
            }}
          />
          <button
            onClick={async () => {
              const { value: filename } = this.state
              const fpath = path.join(parentDir, filename)
              console.log("create file", fpath)
              await this.props.createFile(fpath)
            }}
          >
            +f
          </button>
          <button
            onClick={async () => {
              const { value: filename } = this.state
              const fpath = path.join(parentDir, filename)
              console.log("create dir", fpath)
              await this.props.createDirectory(fpath)
            }}
          >
            +d
          </button>
        </Container>
      )
    }
  }
)

const Container = styled.div`
  display: inline-block;
`
