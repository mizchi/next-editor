import { Button, Classes, Dialog } from "@blueprintjs/core"
import path from "path"
import React from "react"
import { connector } from "../../actionCreators"

// This is example reference
export const CreateRepoModal = connector(
  state => {
    return {
      openedCreateRepoModal: state.app.openedCreateRepoModal
    }
  },
  actions => {
    return {
      createNewProject: actions.project.createNewProject,
      closeModal: actions.app.closeCreateRepoModal,
      loadProjectList: actions.project.loadProjectList,
      startProjectRootChanged: actions.editor.startProjectRootChanged
    }
  }
)(function CreateRepoModalImpl(props) {
  const {
    openedCreateRepoModal,
    createNewProject,
    closeModal,
    startProjectRootChanged
  } = props
  return (
    <Dialog
      autoFocus
      canEscapeKeyClose
      isOpen={openedCreateRepoModal}
      onClose={() => {
        closeModal({})
      }}
    >
      <div className={Classes.DIALOG_BODY}>
        <ModalContent
          onConfirm={async projectRoot => {
            const newProjectRoot = path.join("/", projectRoot)

            closeModal({})

            createNewProject({ newProjectRoot })
            // TODO: fix it

            await new Promise(r => setTimeout(r, 500))
            props.loadProjectList({})

            startProjectRootChanged({
              projectRoot: newProjectRoot
            })
          }}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <Button text="cancel" onClick={() => closeModal({})} />
      </div>
    </Dialog>
  )
})

class ModalContent extends React.Component<
  {
    onConfirm: (newProjectRoot: string) => void
  },
  {
    isValidProjectName: boolean
    newProjectRoot: string
  }
> {
  state = {
    isValidProjectName: true,
    newProjectRoot: ""
  }
  render() {
    return (
      <>
        <h2>Create Project</h2>
        <p>Create directory to local file system.</p>
        <div>
          <input
            spellCheck={false}
            style={{ width: "100%" }}
            value={this.state.newProjectRoot}
            onChange={event => {
              const value = event.target.value
              this.setState({ newProjectRoot: value })
            }}
          />
        </div>
        <Button
          disabled={this.state.newProjectRoot.length === 0}
          icon="confirm"
          text="create"
          onClick={() => this.props.onConfirm(this.state.newProjectRoot)}
        />
      </>
    )
  }
}
