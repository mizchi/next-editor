import { ActionCreator, buildActionCreator, createReducer } from "hard-reducer"
import { RootState } from "."
import * as Git from "../../domain/git"
import {
  CommitDescription,
  GitStagingStatus,
  GitStatusString
} from "../../domain/types"

const {
  createAction,
  createAsyncAction,
  createThunkAction
} = buildActionCreator({
  prefix: "git/"
})

// actions

/* start git project loading */
export const startInitialize: ActionCreator<{
  projectRoot: string
}> = createAction("initialize-start")

/* start git project */
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

export const moveToBranch = createThunkAction(
  "move-to-branches",
  async (input: { projectRoot: string; branch: string }) => {
    await Git.checkoutBranch(input.projectRoot, input.branch)
    return { currentBranch: input.branch }
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

export async function initialize(projectRoot: string) {
  return async (dispatch: any, getState: () => RootState) => {
    dispatch(startInitialize({ projectRoot }))

    const {
      currentBranch,
      branches,
      remotes,
      remoteBranches
    } = await Git.getBranchStatus(projectRoot)
    const history = await Git.getHistory(projectRoot, { ref: currentBranch })

    dispatch(
      endInitialize({
        history,
        remotes,
        currentBranch,
        branches,
        remoteBranches
      })
    )

    const staging = await Git.getStagingStatus(projectRoot, status => {
      const current = getState()
      // stop if root changed
      if (current.repository.currentProjectRoot === projectRoot) {
        dispatch(
          progressStagingLoading({
            status
          })
        )
      }
    })

    const lastState = getState()
    if (lastState.repository.currentProjectRoot === projectRoot) {
      dispatch(endStagingLoading({ staging }))
    }
  }
}

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

export const reducer = createReducer(initialState)
  .case(startInitialize, (state, payload) => {
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
  .case(moveToBranch.resolved, (state, payload) => {
    return {
      ...state,
      currentBranch: payload.currentBranch
    }
  })
