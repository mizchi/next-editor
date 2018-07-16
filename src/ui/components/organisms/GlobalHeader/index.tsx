import React from "react"
import FaCog from "react-icons/fa/cog"
import FaToggleOff from "react-icons/fa/toggle-off"
import FaToggleOn from "react-icons/fa/toggle-on"
import styled from "styled-components"
import { connector } from "../../../actions"

export const GlobalHeader = connector(
  state => ({
    layouts: state.app.layouts,
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
  }),
  actions => {
    return {
      pushScene: actions.app.pushScene,
      setLayoutMode: actions.app.setLayoutMode
    }
  }
)(props => {
  return (
    <Header>
      <Title>Next Editor</Title>
      <Menus>
        <button
          onClick={() => {
            if (props.layouts.length === 2) {
              props.setLayoutMode(["editor"])
            } else {
              props.setLayoutMode(["editor", "preview"])
            }
          }}
        >
          {props.layouts.length === 2 ? <FaToggleOn /> : <FaToggleOff />}
        </button>
      </Menus>
      <ConfigMenu>
        {props.currentScene !== "config" && (
          <button
            onClick={() => {
              props.pushScene("config")
            }}
          >
            <FaCog />
          </button>
        )}
      </ConfigMenu>
    </Header>
  )
})

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #222;
`

const Title = styled.div`
  display: inline-block;
  width: 120px;
  color: #ddd;
  padding-left: 10px;
`

const Menus = styled.div`
  flex: 1;
`

const ConfigMenu = styled.div`
  width: 40px;
`
