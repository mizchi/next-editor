import React from "react"
import FaClone from "react-icons/fa/clone"
import Modal from "react-modal"
import ReactTooltip from "react-tooltip"

export class CloneProjectButton extends React.Component<
  {
    onClickClone: (dirname: string) => void
  },
  { opened: boolean; value: string }
> {
  state = {
    opened: false,
    value: ""
  }
  render() {
    const { onClickClone } = this.props
    return (
      <>
        <ReactTooltip place="top" type="dark" effect="solid" id="clone-project">
          Clone project from GitHub
        </ReactTooltip>
        <button
          onClick={() => {
            this.setState({ opened: true })
          }}
          data-tip="React-tooltip"
          data-for="clone-project"
        >
          <FaClone />
        </button>
        <Modal
          isOpen={this.state.opened}
          onRequestClose={() => this.setState({ opened: false })}
          style={customStyles}
          contentLabel="Clone project"
        >
          <h2>Clone project</h2>
          <p>Clone project from GitHub.</p>
          <div>
            <input
              style={{ width: "100%" }}
              placeholder="username/repo"
              spellCheck={false}
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button
            onClick={() => {
              this.setState({ opened: false })
              onClickClone(this.state.value)
            }}
          >
            clone
          </button>
          <hr />
          <div>
            <button onClick={() => this.setState({ opened: false })}>
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
