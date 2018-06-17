import React from "react"
import Modal from "react-modal"

export class CreateNewProjectButton extends React.Component<
  {
    onClickCreate: (dirname: string) => void
  },
  { opened: boolean; newProjectPath: string }
> {
  state = {
    opened: false,
    newProjectPath: ""
  }
  render() {
    const { onClickCreate } = this.props
    return (
      <>
        <button
          onClick={() => {
            this.setState({ opened: true })
          }}
        >
          Create new project
        </button>
        <Modal
          isOpen={this.state.opened}
          onRequestClose={() => this.setState({ opened: false })}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div>Create Project</div>
          <input
            value={this.state.newProjectPath}
            onChange={event => {
              const value = event.target.value
              this.setState({ newProjectPath: value })
            }}
          />
          &nbsp;
          <button
            onClick={() => {
              this.setState({ opened: false })
              onClickCreate(this.state.newProjectPath)
            }}
          >
            create
          </button>
          <br />
          <div>
            <button
              onClick={() =>
                this.setState({ opened: false, newProjectPath: "" })
              }
            >
              close
            </button>
          </div>
        </Modal>
      </>
    )
  }
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
}
