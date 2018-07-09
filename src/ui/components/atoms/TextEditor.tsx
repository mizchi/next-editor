import React from "react"
import styled from "styled-components"

type Props = {
  initialValue: string
  onChange?: (e: any) => void
  onSave?: (e: any) => void
}

type State = {
  fontScale: number
  value: string
}

export class TextEditor extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      fontScale: 1.0,
      value: props.initialValue
    }
  }

  render() {
    const { value } = this.state
    return (
      <Container>
        <Textarea
          fontScale={this.state.fontScale}
          spellCheck={false}
          value={value}
          onChange={(e: any) => {
            this.setState({ value: e.target.value }, () => {
              const { onChange } = this.props
              onChange && onChange(this.state.value)
            })
          }}
        />
      </Container>
    )
  }
}

const Container = styled.div`
  height: 100%;
`

const Toolbar = styled.div`
  height: 0px;
`

const Textarea: React.ComponentType<{
  fontScale: number
  spellCheck: boolean
  value: string
  onChange: any
}> = styled.textarea`
  font-size: ${p => p.fontScale}em;
  line-height: 1.5em;
  background: #fff;
  width: 100%;
  resize: none;
  height: calc(100% - 0px);
`
