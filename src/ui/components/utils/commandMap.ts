import actions from "../../actionCreators"

type MousetrapExpr = string | string[]

export enum ImplCommandList {
  setLayoutMode1 = "setLayoutMode1",
  setLayoutMode2 = "setLayoutMode2",
  setLayoutMode3 = "setLayoutMode3",
  setLayoutMode4 = "setLayoutMode4",
  saveCurrentFile = "saveCurrentFile",
  commitAll = "commitAll"
}

export const implCommandMap: {
  [commandName in ImplCommandList]: (dispatch: any, ev: Event) => void
} = {
  [ImplCommandList.setLayoutMode1]: dispatch => {
    dispatch(actions.app.setLayout1({}))
  },
  [ImplCommandList.setLayoutMode2]: dispatch => {
    dispatch(actions.app.setLayout2({}))
  },
  [ImplCommandList.setLayoutMode3]: dispatch => {
    dispatch(actions.app.setLayout3({}))
  },
  [ImplCommandList.setLayoutMode4]: dispatch => {
    dispatch(actions.app.setLayout4({}))
  },
  [ImplCommandList.saveCurrentFile]: (dispatch, event) => {
    event.preventDefault()
    dispatch(actions.buffer.saveFile({}))
  },
  [ImplCommandList.commitAll]: (dispatch, event) => {
    dispatch(actions.git.commitAll({ message: "Update" }))
  }
}

export const defaultKeyMap: {
  [commandName in ImplCommandList]: MousetrapExpr | null
} = {
  [ImplCommandList.setLayoutMode1]: "ctrl+1",
  [ImplCommandList.setLayoutMode2]: "ctrl+2",
  [ImplCommandList.setLayoutMode3]: "ctrl+3",
  [ImplCommandList.setLayoutMode4]: "ctrl+4",
  [ImplCommandList.saveCurrentFile]: "command+s",
  [ImplCommandList.commitAll]: "command+shift+s"
}
