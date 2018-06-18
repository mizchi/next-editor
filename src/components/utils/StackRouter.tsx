import React from "react"
import { connect } from "react-redux"
import { RootState } from "../../reducers"
import { Config } from "../pages/Config"
import { Editor } from "../pages/Editor"

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
    case "editor": {
      return <Editor />
    }
    case "config": {
      return <Config />
    }
    default: {
      return <span>Route Error: No {props.current}</span>
    }
  }
})
