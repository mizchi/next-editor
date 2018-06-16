import { DefaultButton } from "office-ui-fabric-react/lib/components/Button"
import React from "react"
import styled from "styled-components"
import { Input } from "./Input"
import { InlineText, Text } from "./Text"

type Props = {
  command: string
  description: string
  placeholder?: string
  validate?: (value: string) => boolean
  onExec: (value: string, command: string) => void
}

type State = {
  value: string
}

export class Command extends React.Component<Props, State> {
  state = {
    value: ""
  }
  render() {
    const { command, description, onExec, placeholder, validate } = this.props
    let pre
    let post
    let hasInput
    if (command.indexOf("$$") > -1) {
      ;[pre, post] = command.split("$$")
      hasInput = true
    } else {
      pre = command
      hasInput = false
    }

    const valid = validate == null ? true : validate(this.state.value)

    return (
      <Container>
        <Description>{description}</Description>
        <CommandBox>
          <CommandBoxInputContainer>
            <CommandBoxText>{pre}</CommandBoxText>
            {hasInput && (
              <>
                &nbsp;<CommandBoxInput
                  placeholder={placeholder}
                  onChange={event => {
                    const v = event.target.value
                    this.setState({ value: v })
                  }}
                />
              </>
            )}
            {post && (
              <>
                &nbsp;<CommandBoxText>{post}</CommandBoxText>
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
  /* padding: 3px; */
  outline: 1px solid black;
`

const Description = styled(Text)`
  width: 100%;
  background: #333;
  color: #faa;
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

const CommandBoxInputContainer = styled.div`
  display: inline-block;
  font-family: monospace;
`
