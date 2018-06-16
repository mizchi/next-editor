import React from "react"

export class GitCommitStatus extends React.PureComponent<{
  added: string[]
  staged: string[]
  modified: string[]
  untracked: string[]
  onClickGitAdd: (filepath: string) => void
  onClickGitCommit: (message: string) => void
}> {
  private commitMassageInputRef: any = React.createRef()
  render() {
    const {
      added,
      staged,
      modified,
      untracked,
      onClickGitAdd,
      onClickGitCommit
    } = this.props
    return (
      <div>
        <h3>staging</h3>
        <div>
          git commit -m &nbsp;
          <input
            ref={this.commitMassageInputRef}
            placeholder="Commit massage here ..."
          />
          &nbsp;
          <button
            onClick={() => {
              const value = this.commitMassageInputRef.current.value
              this.commitMassageInputRef.current.value = ""

              onClickGitCommit(value)
            }}
          >
            Commit
          </button>
        </div>
        {added.map(filepath => {
          return <div key={filepath}>Added: {filepath}</div>
        })}
        {staged.map(filepath => {
          return <div key={filepath}>Changed: {filepath}</div>
        })}
        <hr />
        <h3>modified</h3>
        {modified.map(filepath => {
          return (
            <div key={filepath}>
              {filepath}
              &nbsp;
              <button
                onClick={() => {
                  onClickGitAdd(filepath)
                }}
              >
                git add {filepath}
              </button>
            </div>
          )
        })}
        <hr />
        {untracked.length > 0 && (
          <>
            <h3>untracked</h3>
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
                    git add {filepath}
                  </button>
                </div>
              )
            })}
            <hr />
          </>
        )}
      </div>
    )
  }
}
