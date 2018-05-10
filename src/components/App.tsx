import * as React from "react"
import styled from "styled-components"
import { log } from "util"

type Props = {}
type State = {
  text: string
}

export default class App extends React.Component<Props, State> {
  public state = {
    text: ""
  }
  public async componentDidMount() {
    const API_ENDPOINT =
      location.protocol + "//" + location.host + "/.netlify/functions"
    const res = await fetch(`${API_ENDPOINT}/hello`, {
      mode: "cors"
    })
    const data = await res.text()
    this.setState({ text: data })
  }
  public render() {
    return (
      <Container>
        <h1>Hello/ {this.state.text}</h1>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`
