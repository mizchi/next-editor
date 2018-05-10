import * as React from "react"
import styled from "styled-components"
import { log } from "util"

type Props = {}

export default (props: Props) => {
  return (
    <Container>
      <h1>Hello</h1>
    </Container>
  )
}

const v: number = 1

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const main = async () => {
  const API_ENDPOINT =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:9000"
      : location.protocol + "//" + location.host + "/.netlify/functions"
  const res = await fetch(`${API_ENDPOINT}/hello`)
  const data = await res.json()
  ;(console as any).log(data)
}

main()
