import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../reducers"
import { Config } from "../pages/Config"
import { Main } from "../pages/Main"

type Props = {
  current: string
}

const selector = (state: RootState): Props => {
  return {
    current: state.app.sceneStack[state.app.sceneStack.length - 1]
  }
}

export const StackRouter = connect(selector)((props: Props) => {
  switch (props.current) {
    case "main": {
      return <Main />
    }
    case "config": {
      return <Config />
    }
    default: {
      return <span>Route Error: No {props.current}</span>
    }
  }
})
