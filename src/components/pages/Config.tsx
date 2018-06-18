import * as React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { popScene } from "../../reducers/app"
import { GlobalHeader } from "../molecules/GlobalHeader"
import { Config as ConfigContent } from "../organisms/Config"

const selector = () => ({})
const actions = {
  popScene
}

export const Config = connect(
  selector,
  actions
)((props: any) => {
  return (
    <Layout>
      <Header>
        <GlobalHeader />
      </Header>
      <Content>
        <ConfigContent onClickBack={() => props.popScene()} />
      </Content>
    </Layout>
  )
})

export const Layout = styled.div`
  width: 100vx;
  height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 40px 1fr 1fr;
  grid-template-areas: "header header header" "content content content" "content content content";
`

export const Header = styled.div`
  width: 100%;
  height: 100%;
  grid-area: header;
`
export const Content = styled.div`
  width: 100%;
  height: 100%;
  grid-area: content;
`
