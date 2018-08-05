import React from "react"

export class CloneProjectModalContent extends React.Component<
  {
    onConfirm: (dirname: string) => void
    onCancel: () => void
  },
  { value: string }
> {
  state = {
    opened: false,
    value: ""
  }
  render() {
    const { onConfirm, onCancel } = this.props
    return (
      <>
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
        <button onClick={() => onConfirm(this.state.value)}>clone</button>
        <hr />
        <div>
          <button onClick={onCancel}>cancel</button>
        </div>
      </>
    )
  }
}
