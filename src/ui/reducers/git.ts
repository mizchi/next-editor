import fs from "fs"
import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"
import * as git from "isomorphic-git"
import { RootState } from "."
import * as Git from "../../domain/git"
import { GitStagingStatus, GitStatusString } from "../../domain/types"
import { projectChanged } from "../actionCreators/globalActions"
import { CommitDescription } from "./../../domain/types"

const {
  createAction,
  createAsyncAction,
  createThunkAction
} = buildActionCreator({
  prefix: "git/"
})

// actions

export const failInitialize: ActionCreator<{}> = createAction("initialize-fail")

export const endInitialize: ActionCreator<{
  history: CommitDescription[]
  currentBranch: string
  branches: string[]
  remotes: string[]
  remoteBranches: string[]
}> = createAction("initialize-end")

export const progressStagingLoading: ActionCreator<{
  status: { filepath: string; status: GitStatusString }
}> = createAction("progress-staging")

export const endStagingLoading: ActionCreator<{
  staging: GitStagingStatus
}> = createAction("end-staging")

export const updateStaging: ActionCreator<{
  staging: GitStagingStatus
}> = createAction("update-staging")

export const updateBranchStatus: ActionCreator<{
  currentBranch: string
  branches: string[]
}> = createAction("update-branch-status")

export const mergeBranches = createThunkAction(
  "merge-branches",
  async (
    {
      projectRoot,
      ref1,
      ref2
    }: { projectRoot: string; ref1: string; ref2: string },
    dispatch
  ) => {
    await git.merge({
      fs,
      dir: projectRoot,
      ours: ref1,
      theirs: ref2
    })
    dispatch(updateHistory({ projectRoot, branch: ref1 }))
  }
)

export const checkoutNewBranch = createThunkAction(
  "update-branches",
  async (input: { projectRoot: string; branch: string }) => {
    await Git.createBranch(input.projectRoot, input.branch)
    await Git.checkoutBranch(input.projectRoot, input.branch)
    const { branches } = await Git.getBranchStatus(input.projectRoot)
    return { branches, currentBranch: input.branch }
  }
)

export const removeBranch = createThunkAction(
  "remove-branches",
  async (
    input: { projectRoot: string; branch: string },
    _dispatch,
    getState: () => RootState
  ) => {
    const state = getState()
    await Git.deleteBranch(input.projectRoot, input.branch)

    // checkout master if target is currentBranch
    if (state.git.currentBranch === input.branch) {
      await Git.checkoutBranch(input.projectRoot, "master")
    }
    const { branches } = await Git.getBranchStatus(input.projectRoot)
    return { branches, currentBranch: input.branch }
  }
)

export const updateHistory = createAsyncAction(
  "update-history",
  async (input: { projectRoot: string; branch: string }) => {
    const history = await Git.getHistory(input.projectRoot, {
      ref: input.branch
    })
    return { history }
  }
)

export const commitStagedChanges = createThunkAction(
  "commit-staged-changes",
  async (
    {
      projectRoot,
      message
    }: {
      projectRoot: string
      message: string
    },
    dispatch,
    getState: () => RootState
  ) => {
    const { config } = getState()
    const author = {
      name: config.committerName || "<none>",
      email: config.committerEmail || "<none>"
    }
    const state = getState()
    await Git.commitChanges(projectRoot, message, author)
    dispatch(startStagingUpdate(projectRoot, []))
    dispatch(updateHistory({ projectRoot, branch: state.git.currentBranch }))
  }
)

export function startStagingUpdate(projectRoot: string, files: string[]) {
  return async (dispatch: any, getState: () => RootState) => {
    const state = getState()
    if (state.git.staging) {
      const newStaging = await Git.updateStagingStatus(
        projectRoot,
        state.git.staging,
        files
      )
      dispatch(updateStaging({ staging: newStaging }))
    }
  }
}

// State
export type GitState = {
  type: "loading" | "git" | "no-git"
  loaded: boolean
  projectRoot: string
  currentBranch: string
  branches: string[]
  remotes: string[]
  remoteBranches: string[]
  history: CommitDescription[]
  staging: GitStagingStatus | null
  stagingLoading: boolean
}

const initialState: GitState = {
  type: "loading",
  loaded: false,
  projectRoot: null as any,
  currentBranch: null as any,
  branches: [],
  remotes: [],
  remoteBranches: [],
  history: [],
  staging: null,
  stagingLoading: true
}

export const reducer: Reducer<GitState> = createReducer(initialState)
  .case(projectChanged, (state, payload) => {
    return {
      ...state,
      type: "loading",
      projectRoot: payload.projectRoot
    }
  })
  .case(failInitialize, state => {
    return {
      ...state,
      type: "no-git"
    }
  })
  .case(endInitialize, (state, payload) => {
    return {
      type: "git",
      loaded: true,
      projectRoot: state.projectRoot,
      currentBranch: payload.currentBranch,
      branches: payload.branches,
      history: payload.history,
      remotes: payload.remotes,
      remoteBranches: payload.remoteBranches,
      stagingLoading: true,
      staging: null
    }
  })
  .case(endStagingLoading, (state, payload) => {
    return {
      ...state,
      stagingLoading: false,
      staging: payload.staging
    }
  })
  .case(updateStaging, (state, payload) => {
    return {
      ...state,
      staging: payload.staging
    }
  })
  .case(updateHistory.resolved, (state, payload) => {
    return {
      ...state,
      history: payload.history
    }
  })
  .case(checkoutNewBranch.resolved, (state, payload) => {
    return {
      ...state,
      branches: payload.branches,
      currentBranch: payload.currentBranch
    }
  })
  .case(updateBranchStatus, (state, payload) => {
    return {
      ...state,
      currentBranch: payload.currentBranch,
      branches: payload.branches
    }
  })
