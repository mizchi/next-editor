import React from "react"
import { connect } from "react-redux"
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

export const StackRouter = connect(selector)(function StackRouterImpl(
  props: Props
) {
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
})
