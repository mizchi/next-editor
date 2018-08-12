import React from "react"

export class Input extends React.Component<
  {
    initialValue: string
    focus?: boolean
    onConfirm: (value: string) => void
    onCancel: () => void
  },
  {
    value: string
  }
> {
  inputRef: any = React.createRef()

  constructor(props: any) {
    super(props)
    this.state = {
      value: props.initialValue
    }
  }

  componentDidMount() {
    if (this.props.focus) {
      this.inputRef.current.focus()
    }
  }

  render() {
    return (
      <input
        ref={this.inputRef}
        className="bp3-input"
        value={this.state.value}
        onBlur={() => {
          this.props.onCancel()
        }}
        onChange={ev => {
          this.setState({ value: ev.target.value })
        }}
        onKeyDown={async ev => {
          if (ev.key === "Enter") {
            this.props.onConfirm(this.state.value)
          }

          if (ev.key === "Escape") {
            this.props.onCancel()
          }
        }}
      />
    )
  }
}
