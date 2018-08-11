import { Button, Tooltip } from "@blueprintjs/core"
import React from "react"

type Props = {
  description: string
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
    const { description, placeholder, onExec, validate } = this.props
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
        <Button
          text="exec"
          disabled={validate && !validate(this.state.value)}
          onClick={() => {
            onExec(this.state.value)
            this.setState({ value: "" })
          }}
        />
      </div>
    )
  }
}
