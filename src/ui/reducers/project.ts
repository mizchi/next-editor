import {
  ActionCreator,
  buildActionCreator,
  createReducer,
  Reducer
} from "hard-reducer"
import { readDirectories } from "../../domain/filesystem"
import { cloneRepository, createProject } from "../../domain/git"
import { projectChanged } from "./../actionCreators/globalActions"

type Project = {
  projectRoot: string
}

const { createThunkAction, createAction } = buildActionCreator({
  prefix: "project/"
})

export const updateProjectList: ActionCreator<{
  projects: Project[]
}> = createAction("update-project-list")

export const loadProjectList = createThunkAction(
  "create-new-project",
  async (_, dispatch) => {
    dispatch(updateProjectList(await updateProjects()))
  }
)

export const createNewProject = createThunkAction(
  "create-new-project",
  async (input: { newProjectRoot: string }, dispatch) => {
    await createProject(input.newProjectRoot)
    dispatch(updateProjectList(await updateProjects()))
  }
)

export const cloneFromGitHub = createThunkAction(
  "clone-from-github",
  async (input: { projectRoot: string; clonePath: string }, dispatch) => {
    await cloneRepository(input.projectRoot, input.clonePath)
    dispatch(updateProjectList(await updateProjects()))
  }
)

export type ProjectState = {
  projectRoot: string
  projects: Project[]
}

const initialState: ProjectState = {
  projectRoot: "/",
  projects: []
}

export const reducer: Reducer<ProjectState> = createReducer(initialState)
  .case(projectChanged, (state, payload) => {
    return {
      ...state,
      projectRoot: payload.projectRoot
    }
  })
  .case(updateProjectList, (state, payload) => {
    return {
      ...state,
      projects: payload.projects
    }
  })

async function updateProjects(): Promise<{ projects: Project[] }> {
  const projectNames = await readDirectories("/")
  return {
    projects: projectNames.map(p => {
      return {
        projectRoot: p
      }
    })
  }
}
