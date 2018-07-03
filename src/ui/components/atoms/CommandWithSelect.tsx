import React from "react"
import ReactTooltip from "react-tooltip"

type Props = {
  description: string
  options: string[]
  tooltip?: (s: string) => string
  validate?: (value: string) => boolean
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
    const { description, onExec, options, validate, tooltip } = this.props
    const { value } = this.state
    const tooltipText = tooltip && tooltip(value)
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
        {tooltipText && (
          <ReactTooltip place="top" type="dark" effect="solid" id={tooltipText}>
            {tooltipText}
          </ReactTooltip>
        )}
        <button
          data-tip
          data-for={tooltipText || undefined}
          disabled={validate && !validate(this.state.value)}
          onClick={() => onExec(this.state.value)}
        >
          exec
        </button>
      </div>
    )
  }
}
