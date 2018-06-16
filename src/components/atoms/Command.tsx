import { DefaultButton } from "office-ui-fabric-react/lib/components/Button"
import React from "react"
import styled from "styled-components"
import { Input } from "./Input"
import { InlineText, Text } from "./Text"
import faTerminal from "@fortawesome/fontawesome-free-solid/faTerminal"
import FontAwesomeIcon from "@fortawesome/react-fontawesome"

type Props = {
  command: string
  description: string
  placeholder?: string
  type?: "input" | "select"
  options?: string[]
  initialValue?: string
  validate?: (value: string) => boolean
  onExec: (value: string, command: string) => void
}

type State = {
  value: string
}

export class Command extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: props.initialValue || ""
    }
  }
  render() {
    const {
      command,
      description,
      onExec,
      placeholder,
      validate,
      type = "input",
      options = []
    } = this.props
    let preText
    let postText
    let hasInput
    if (command.indexOf("$$") > -1) {
      ;[preText, postText] = command.split("$$")
      hasInput = true
    } else {
      preText = command
      hasInput = false
    }

    const valid = validate == null ? true : validate(this.state.value)

    return (
      <Container>
        <Description>{description}</Description>
        <CommandBox>
          <CommandBoxInputContainer>
            <FontAwesomeIcon icon={faTerminal} />
            &nbsp;
            <CommandBoxText>{preText}</CommandBoxText>
            {hasInput &&
              type === "input" && (
                <>
                  &nbsp;<CommandBoxInput
                    value={this.state.value}
                    placeholder={placeholder}
                    onChange={event => {
                      const value = event.target.value
                      console.log("onchange input", value)
                      this.setState({ value })
                    }}
                  />
                </>
              )}
            {hasInput &&
              type === "select" && (
                <>
                  &nbsp;<CommandBoxSelect
                    value={this.state.value}
                    placeholder={placeholder}
                    onChange={event => {
                      const value = event.target.value
                      this.setState({ value })
                    }}
                  >
                    {options.map(optionText => (
                      <CommandBoxOption value={optionText} key={optionText}>
                        {optionText}
                      </CommandBoxOption>
                    ))}
                  </CommandBoxSelect>
                </>
              )}
            {postText && (
              <>
                &nbsp;<CommandBoxText>{postText}</CommandBoxText>
              </>
            )}
          </CommandBoxInputContainer>
          <DefaultButton
            disabled={!valid}
            onClick={() => {
              const { value } = this.state
              const built = command.replace("$$", value)
              onExec(value, built)
            }}
          >
            Exec
          </DefaultButton>
        </CommandBox>
      </Container>
    )
  }
}

const Container = styled.div`
  display: inline-block;
  height: 64px;
  width: 100%;
  /* padding: 3px; */
  outline: 1px solid black;
`

const Description = styled.div`
  padding-left: 3px;
  background: #555;
  color: #ddd;
`

const CommandBox = styled.div`
  padding: 2px 5px;
  height: 32px;
`
const CommandBoxText = styled(InlineText)`
  height: 100%;
  font-family: monospace;
`

const CommandBoxInput = styled(Input)`
  height: 100%;
  font-family: monospace;
`

const CommandBoxSelect = styled.select`
  height: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
`

const CommandBoxOption = styled.option``

const CommandBoxInputContainer = styled.div`
  display: inline-block;
  font-family: monospace;
`
