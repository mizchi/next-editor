import React from "react"
import Modal from "react-modal"

export class CreateNewProjectButton extends React.Component<
  {},
  { opened: boolean }
> {
  state = {
    opened: false
  }
  render() {
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
          <input />
          &nbsp;
          <button
            onClick={() => {
              this.setState({ opened: false })
            }}
          >
            create
          </button>
          <br />
          <div>
            <button onClick={() => this.setState({ opened: false })}>
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
