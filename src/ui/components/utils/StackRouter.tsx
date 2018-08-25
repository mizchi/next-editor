import React from "react"
import { connector } from "../../actionCreators"
import { RootState } from "../../reducers"
import { Config } from "../pages/Config"
import { Main } from "../pages/Main"

type Props = {
  currentScene: string
}

const selector = (state: RootState): Props => {
  return {
    currentScene: state.app.sceneStack[state.app.sceneStack.length - 1]
  }
}

export const StackRouter = connector(selector, _a => ({}))(
  function StackRouterImpl(props: Props) {
    switch (props.currentScene) {
      case "main": {
        return <Main />
      }
      case "config": {
        return <Config />
      }
      default: {
        return <span>Route Error: No {props.currentScene}</span>
      }
    }
  }
)
