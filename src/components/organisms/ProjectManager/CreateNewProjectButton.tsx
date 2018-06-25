import faPlus from "@fortawesome/fontawesome-free-solid/faPlus"
import Icon from "@fortawesome/react-fontawesome"
import React from "react"
import Modal from "react-modal"
import ReactTooltip from "react-tooltip"
import { Button } from "../../utils/LayoutUtils"

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
        <ReactTooltip
          place="top"
          type="dark"
          effect="solid"
          id="create-project"
        >
          Create new project
        </ReactTooltip>
        <Button
          onClick={() => {
            this.setState({ opened: true })
          }}
          data-tip="React-tooltip"
          data-for="create-project"
        >
          <Icon icon={faPlus} />
        </Button>
        <Modal
          isOpen={this.state.opened}
          onRequestClose={() => this.setState({ opened: false })}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>Create Project</h2>
          <p>Create directory to local file system.</p>
          <div>
            <input
              style={{ width: "100%" }}
              value={this.state.newProjectPath}
              onChange={event => {
                const value = event.target.value
                this.setState({ newProjectPath: value })
              }}
            />
          </div>
          <button
            onClick={() => {
              this.setState({ opened: false })
              onClickCreate(this.state.newProjectPath)
            }}
          >
            create
          </button>
          <hr />
          <div>
            <button
              onClick={() =>
                this.setState({ opened: false, newProjectPath: "" })
              }
            >
              cancel
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
    width: 600,
    height: 400,
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
}
