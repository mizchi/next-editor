import React from "react"
import FaCog from "react-icons/fa/cog"
import styled from "styled-components"
import { connector } from "../../../reducers"

export const GlobalHeader = connector(
  state => ({
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
  }),
  actions => {
    return {
      pushScene: actions.app.pushScene
    }
  }
)(props => {
  return (
    <Header>
      <Title>Next Editor</Title>
      <TitleMenus>
        {props.currentScene !== "config" && (
          <>
            <button
              onClick={() => {
                props.pushScene("config")
              }}
            >
              <FaCog />
            </button>
          </>
        )}
      </TitleMenus>
    </Header>
  )
})

const Header = styled.header`
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #222;
`

const Title = styled.div`
  display: inline-block;
  width: 120px;
  color: #ddd;
`

const TitleMenus = styled.div`
  flex: 1;
`
