import React from "react"
import styled from "styled-components"
import { Command } from "../../atoms/Command"

type Props = { initialOpen: boolean; children: any }
type State = {
  opened: boolean
}

class Foldable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      opened: props.initialOpen
    }
  }
  render() {
    return <div />
  }
}

export class GitCommitStatus extends React.PureComponent<{
  added: string[]
  staged: string[]
  modified: string[]
  untracked: string[]
  onClickGitAdd: (filepath: string) => void
  onClickGitCommit: (message: string) => void
}> {
  render() {
    const {
      added,
      staged,
      modified,
      untracked,
      onClickGitAdd,
      onClickGitCommit
    } = this.props
    const hasStagedChanges = added.length > 0 || staged.length > 0
    const hasChanges =
      added.length > 0 ||
      staged.length > 0 ||
      modified.length > 0 ||
      untracked.length > 0
    return (
      <div>
        <h2>Staging & Commit</h2>
        {!hasChanges && <>No changes in repository</>}
        {hasStagedChanges && (
          <>
            <div>
              <Command
                description="Commit staged changes"
                command="git commit -m $$"
                onExec={value => {
                  onClickGitCommit(value)
                }}
              />
            </div>
            <StatusText>[staged]</StatusText>
            {added.map(filepath => {
              return <div key={filepath}>{filepath} (Added)</div>
            })}
            {staged.map(filepath => {
              return <div key={filepath}>{filepath} (Changed)</div>
            })}
            {modified.length > 0 &&
              modified.map(filepath => {
                return (
                  <>
                    <StatusText>[modified]</StatusText>
                    <div key={filepath}>
                      {filepath}
                      &nbsp;
                      <button
                        onClick={() => {
                          onClickGitAdd(filepath)
                        }}
                      >
                        add to stage
                      </button>
                    </div>
                  </>
                )
              })}
          </>
        )}
        {untracked.length > 0 && (
          <>
            <StatusText>[untracked]</StatusText>
            {untracked.map(filepath => {
              return (
                <div key={filepath}>
                  {filepath}
                  &nbsp;
                  <button
                    onClick={() => {
                      onClickGitAdd(filepath)
                    }}
                  >
                    add to stage
                  </button>
                </div>
              )
            })}
          </>
        )}
      </div>
    )
  }
}

const StatusText = styled.div``
