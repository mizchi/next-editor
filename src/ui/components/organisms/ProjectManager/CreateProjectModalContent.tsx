import { Button } from "@blueprintjs/core"
import React from "react"

export class CreateProjectModalContent extends React.Component<
  {
    onConfirm: (newProjectRoot: string) => void
    onCancel: () => void
  },
  {
    isValidProjectName: boolean
    newProjectRoot: string
  }
> {
  state = {
    isValidProjectName: true,
    newProjectRoot: ""
  }
  render() {
    return (
      <>
        <h2>Create Project</h2>
        <p>Create directory to local file system.</p>
        <div>
          <input
            spellCheck={false}
            style={{ width: "100%" }}
            value={this.state.newProjectRoot}
            onChange={event => {
              const value = event.target.value
              this.setState({ newProjectRoot: value })
            }}
          />
        </div>
        <Button
          disabled={this.state.newProjectRoot.length === 0}
          icon="confirm"
          text="create"
          onClick={() => this.props.onConfirm(this.state.newProjectRoot)}
        />
        <hr />
        <div>
          <Button text="cancel" onClick={this.props.onCancel} />
        </div>
      </>
    )
  }
}
