import { ActionCreator, buildActionCreator } from "hard-reducer"

// Action
const { createAction } = buildActionCreator({
  prefix: "global/"
})

export const projectChanged: ActionCreator<{
  projectRoot: string
}> = createAction("project-changed")

export const fileChanged: ActionCreator<{
  filepath: string
}> = createAction("file-changed")

export const startAsync: ActionCreator<{}> = createAction("start-async")
export const endAsync: ActionCreator<{}> = createAction("end-async")
