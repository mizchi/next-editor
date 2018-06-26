import React from "react"

type Props = {
  description: string
  options: string[]
  tooltip?: string
  initialValue?: string
  completions?: string[]
  onExec: (value: string) => void
}
type State = {
  value: string
}

export class CommandWithSelect extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: props.initialValue || ""
    }
  }
  render() {
    const { description, onExec, options } = this.props
    return (
      <div>
        <span>{description}</span>
        &nbsp;
        <select
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
        >
          {options.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        &nbsp;
        <button onClick={() => onExec(this.state.value)}>exec</button>
      </div>
    )
  }
}
