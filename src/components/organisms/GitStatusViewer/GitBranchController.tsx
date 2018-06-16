import React from "react"

export class GitBranchController extends React.PureComponent<{
  projectRoot: string
  currentBranch: string
  branches: string[]
  onChangeBranch: (branchName: string) => void
  onClickCreateBranch: (branchName: string) => void
}> {
  private newBranchInputRef: any = React.createRef()
  render() {
    const {
      currentBranch,
      branches,
      onChangeBranch,
      onClickCreateBranch
    } = this.props
    return (
      <>
        <div>
          git checkout
          <select
            value={currentBranch}
            onChange={ev => {
              onChangeBranch(ev.target.value)
            }}
          >
            {branches.map(branchName => (
              <option value={branchName} key={branchName}>
                {branchName}
              </option>
            ))}
          </select>
        </div>
        <div>
          git branch <input ref={this.newBranchInputRef} />
          &nbsp;
          <button
            onClick={async () => {
              const newBranchName = this.newBranchInputRef.current.value
              this.newBranchInputRef.current.value = ""
              onClickCreateBranch(newBranchName)
            }}
          >
            create
          </button>
        </div>
      </>
    )
  }
}
