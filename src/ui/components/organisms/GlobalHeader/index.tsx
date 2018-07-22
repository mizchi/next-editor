import React from "react"
import FaCog from "react-icons/fa/cog"
import FaToggleOff from "react-icons/fa/toggle-off"
import FaToggleOn from "react-icons/fa/toggle-on"
import styled from "styled-components"
import { connector } from "../../../actions"

export const GlobalHeader = connector(
  state => ({
    mainLayout: state.app.mainLayout,
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
  }),
  actions => {
    return {
      pushScene: actions.app.pushScene,
      setLayoutMode: actions.app.setLayoutMode
    }
  }
)(props => {
  const currentColumnConut = props.mainLayout.areas[0].length
  return (
    <Header>
      <Title>Next Editor</Title>
      <Menus>
        <button
          onClick={() => {
            if (currentColumnConut === 2) {
              props.setLayoutMode({ areas: [["main"]] })
            } else {
              props.setLayoutMode({ areas: [["main", "support"]] })
            }
          }}
        >
          {currentColumnConut === 2 ? <FaToggleOn /> : <FaToggleOff />}
        </button>
      </Menus>
      <ConfigMenu>
        {props.currentScene !== "config" && (
          <button
            onClick={() => {
              props.pushScene({ nextScene: "config" })
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
