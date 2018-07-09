import { ActionCreator, buildActionCreator, createReducer } from "hard-reducer"
import { RootState } from "."
import { commitChanges } from "../../domain/git/commands/commitChanges"
import { getBranchStatus } from "../../domain/git/queries/getBranchStatus"
import { getHistory } from "../../domain/git/queries/getHistory"
import { getStagingStatus } from "../../domain/git/queries/getStagingStatus"
import { updateStagingStatus } from "../../domain/git/queries/updateStagingStatus"
import {
  CommitDescription,
  GitStagingStatus,
  GitStatusString
} from "../../domain/types"

type ThunkAction<A> = (
  dispatch: (a: A) => void | Promise<void>,
  getState: () => RootState
) => void | Promise<void>

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

export const updateHistory = createAsyncAction(
  "update-history",
  async (input: { projectRoot: string; branch: string }) => {
    const history = await getHistory(input.projectRoot, { ref: input.branch })
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
    const author = {
      email: window.localStorage.getItem("committer-email") || "dummy",
      name: window.localStorage.getItem("committer-name") || "dummy"
    }
    const state = getState()
    await commitChanges(projectRoot, message, author)
    dispatch(startStagingUpdate(projectRoot, []))
    dispatch(updateHistory({ projectRoot, branch: state.git.currentBranch }))
  }
)

export async function initialize(
  projectRoot: string
): Promise<ThunkAction<any>> {
  return async (dispatch, getState) => {
    dispatch(startInitialize({ projectRoot }))

    const { currentBranch, branches } = await getBranchStatus(projectRoot)
    const history = await getHistory(projectRoot, { ref: currentBranch })

    dispatch(
      endInitialize({
        history,
        currentBranch,
        branches
      })
    )

    const staging = await getStagingStatus(projectRoot, status => {
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
      const newStaging = await updateStagingStatus(
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
