import actions from "../../actionCreators"

type MousetrapExpr = string | string[]

export const setLayoutMode1 = "setLayoutMode1"
export const setLayoutMode2 = "setLayoutMode2"
export const setLayoutMode3 = "setLayoutMode3"
export const setLayoutMode4 = "setLayoutMode4"
export const saveCurrentFile = "saveCurrentFile"
export const commitAll = "commitAll"

export const implCommandMap: {
  [event: string]: (dispatch: any, event: any) => void
} = {
  [setLayoutMode1]: dispatch => {
    dispatch(actions.app.setLayout1({}))
  },
  [setLayoutMode2]: dispatch => {
    dispatch(actions.app.setLayout2({}))
  },
  [setLayoutMode3]: dispatch => {
    dispatch(actions.app.setLayout3({}))
  },
  [setLayoutMode4]: dispatch => {
    dispatch(actions.app.setLayout4({}))
  },
  [saveCurrentFile]: (dispatch, event) => {
    event.preventDefault()
    dispatch(actions.buffer.saveFile({}))
  },
  [commitAll]: dispatch => {
    dispatch(actions.git.commitAll({ message: "Update" }))
  }
}

export const defaultKeyMap: {
  [commandName: string]: MousetrapExpr | null
} = {
  [setLayoutMode1]: "ctrl+1",
  [setLayoutMode2]: "ctrl+2",
  [setLayoutMode3]: "ctrl+3",
  [setLayoutMode4]: "ctrl+4",
  [saveCurrentFile]: "command+s",
  [commitAll]: "command+shift+s"
}
