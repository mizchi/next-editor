import { Button, Classes, Dialog, Switch } from "@blueprintjs/core"
import fs from "fs"
import path from "path"
import pify from "pify"
import React from "react"
import url from "url"
import { cloneRepository } from "../../../domain/git"
import { connector } from "../../actionCreators"

// This is example reference
export const CloneRepoModal = connector(
  state => {
    return {
      corsProxy: state.config.corsProxy,
      openedCloneRepoModal: state.app.openedCloneRepoModal
    }
  },
  actions => {
    return {
      closeModal: actions.app.closeCloneRepoModal,
      startProjectRootChanged: actions.editor.startProjectRootChanged,
      deleteProject: actions.editor.deleteProject,
      loadProjectList: actions.project.loadProjectList
    }
  }
)(function CloneRepoModalImpl(props) {
  const { openedCloneRepoModal, closeModal, corsProxy, loadProjectList } = props
  return (
    <Dialog
      autoFocus
      canEscapeKeyClose
      isOpen={openedCloneRepoModal}
      onClose={() => {
        closeModal({})
      }}
    >
      <div className={Classes.DIALOG_BODY}>
        <ModalContent
          corsProxy={corsProxy}
          onCloneEnd={async projectRoot => {
            props.closeModal({})

            await new Promise(r => setTimeout(r, 300))
            loadProjectList({})

            props.startProjectRootChanged({
              projectRoot
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
    corsProxy: string
    onCloneEnd: (dirname: string) => void
  },
  {
    value: string
    cloningProgress: string
    cloningMessage: string
    onCloning: boolean
    singleBranch: boolean
    depth: number | undefined
  }
> {
  state = {
    value: "",
    cloningMessage: "",
    cloningProgress: "",
    onCloning: false,
    singleBranch: true,
    depth: undefined
  }
  render() {
    const { corsProxy, onCloneEnd } = this.props
    const { onCloning, cloningMessage, cloningProgress } = this.state
    return (
      <div>
        <h2>Clone repository</h2>
        <div>
          <label>
            GIT URL: HTTPS only
            <input
              className="bp3-input"
              style={{ width: "100%" }}
              placeholder="https://github.com/<username>/<repo>"
              spellCheck={false}
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </label>

          <label>
            SingleBranch:
            <input type="checkbox" checked={true} disabled={true} />
          </label>
          <br />

          <label>
            <Switch
              label="Set depth: 1"
              onChange={ev => {
                const { checked } = ev.target as any
                if (checked) {
                  this.setState({ depth: 1 })
                } else {
                  this.setState({ depth: undefined })
                }
              }}
            />
            {/* {typeof this.state.depth === "number" && (
              <NumericInput value={this.state.depth} onChange={() => {
                ev.
              }} disabled={true} />
            )} */}
          </label>
        </div>

        <Button
          disabled={onCloning}
          onClick={async () => {
            // Rewrite with proxy path
            const repoPath = this.state.value

            const parsed: any = url.parse(repoPath)
            const clonePath = parsed.pathname.replace(/\.git$/, "")
            // /a/b
            const [, user, repo] = clonePath.split("/")

            try {
              await pify(fs.mkdir)(path.join("/", user))
            } catch (e) {
              console.log(path.join("/", user), "exists")
              // Exists
            }

            const destPath = path.join("/", user, repo)

            this.setState({ onCloning: true })

            // TODO: It's a smart UI to show progress easily
            await cloneRepository(destPath, repoPath, {
              singleBranch: true,
              depth: this.state.depth,
              corsProxy, // Use cors proxy to access private repo
              onProgress: pe => {
                console.log("[clone/progress]", pe)
              },
              onMessage: message => {
                this.setState({ cloningMessage: message })
                console.log("[clone/message]", message)
              }
            })
            this.setState({ onCloning: false })
            onCloneEnd(destPath)
          }}
          text="Clone"
        />
        {onCloning && (
          <div>
            <div>Cloning...</div>
            <p>{cloningMessage}</p>
            <p>{cloningProgress}</p>
          </div>
        )}
      </div>
    )
  }
}
