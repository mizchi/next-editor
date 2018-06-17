import React from "react"
import Modal from "react-modal"

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
        <button
          onClick={() => {
            this.setState({ opened: true })
          }}
        >
          Clone project from github
        </button>
        <Modal
          isOpen={this.state.opened}
          onRequestClose={() => this.setState({ opened: false })}
          style={customStyles}
          contentLabel="Clone project"
        >
          <div>Clone project</div>
          <input
            placeholder="username/repo in github"
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
          />
          &nbsp;
          <button
            onClick={() => {
              this.setState({ opened: false })
              onClickClone(this.state.value)
            }}
          >
            clone
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
