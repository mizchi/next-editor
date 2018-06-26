import React from "react"
type Props = {
  description: string
  tooltip?: string
  placeholder?: string
  initialValue?: string
  completions?: string[]
  onExec: (value: string) => void
}
type State = {
  value: string
}

export class CommandWithInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: props.initialValue || ""
    }
  }
  render() {
    const { description, placeholder, onExec } = this.props
    return (
      <div>
        <span>{description}</span>
        &nbsp;
        <input
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
          placeholder={placeholder}
        />
        &nbsp;
        <button onClick={() => onExec(this.state.value)}>exec</button>
      </div>
    )
  }
}
