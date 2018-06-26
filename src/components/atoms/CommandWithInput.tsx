import React from "react"
import ReactTooltip from "react-tooltip"

type Props = {
  description: string
  tooltip?: (s: string) => string
  placeholder?: string
  validate?: (value: string) => boolean
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
    const { description, placeholder, onExec, validate, tooltip } = this.props
    const { value } = this.state
    const tooltipText = tooltip && tooltip(value)
    return (
      <div>
        <span>{description}</span>
        &nbsp;
        <input
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
          placeholder={placeholder}
          spellCheck={false}
        />
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
          onClick={() => {
            onExec(this.state.value)
            this.setState({ value: "" })
          }}
        >
          exec
        </button>
      </div>
    )
  }
}
