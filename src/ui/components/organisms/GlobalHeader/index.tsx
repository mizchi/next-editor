import flatten from "lodash/flatten"
import uniq from "lodash/uniq"
import { desaturate } from "polished"
import React from "react"
import FaCog from "react-icons/fa/cog"
import FaToggleOff from "react-icons/fa/toggle-off"
import FaToggleOn from "react-icons/fa/toggle-on"
import styled from "styled-components"
import { connector } from "../../../actionCreators"

export const GlobalHeader = connector(
  state => ({
    mainLayout: state.app.mainLayout,
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
  }),
  actions => {
    return {
      pushScene: actions.app.pushScene,
      setLayoutAreas: actions.app.setLayoutAreas
    }
  }
)(props => {
  const currentColumnConut = uniq(flatten(props.mainLayout.areas)).length
  return (
    <Header>
      <Title>Next Editor</Title>
      <Menus>
        <button
          onClick={() => {
            if (currentColumnConut === 2) {
              props.setLayoutAreas({ areas: [["editor", "editor"]] })
            } else {
              props.setLayoutAreas({ areas: [["editor", "support"]] })
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
  background-color: ${p => desaturate(0.1, "#272822")};
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
