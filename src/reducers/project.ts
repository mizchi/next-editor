import { readDirectories } from "../domain/filesystem/queries/readDirectories"
import { createProject } from "../domain/git/commands/createProject"

type Project = {
  projectRoot: string
}

const LOAD_PROJECT_LIST = "project/load-project-list"

type LoadProjectList = {
  type: typeof LOAD_PROJECT_LIST
  payload: {
    projects: Project[]
  }
}

export async function loadProjectList(): Promise<LoadProjectList> {
  const projectNames = await readDirectories("/")
  return {
    type: LOAD_PROJECT_LIST,
    payload: {
      projects: projectNames.map(p => {
        return {
          projectRoot: p
        }
      })
    }
  }
}

export async function createNewProject(
  newProjectRoot: string
): Promise<LoadProjectList> {
  await createProject(newProjectRoot)
  return loadProjectList()
}

export type ProjectState = {
  projects: Project[]
}

const initialState: ProjectState = {
  projects: []
}

export type Action = LoadProjectList

export function reducer(state: ProjectState = initialState, action: Action) {
  switch (action.type) {
    case LOAD_PROJECT_LIST: {
      return { ...state, projects: action.payload.projects }
    }
    default: {
      return state
    }
  }
}
