import { buildActionCreator, createReducer, Reducer } from "hard-reducer"
import { readDirectories } from "../../domain/filesystem/queries/readDirectories"
import { cloneRepository } from "../../domain/git/commands/cloneRepository"
import { createProject } from "../../domain/git/commands/createProject"

type Project = {
  projectRoot: string
}

const { createAsyncAction } = buildActionCreator({
  prefix: "project/"
})

export const loadProjectList = createAsyncAction(
  "load-project-list",
  async () => {
    return updateProjects()
  }
)

export const createNewProject = createAsyncAction(
  "create-new-project",
  async (input: { newProjectRoot: string }) => {
    await createProject(input.newProjectRoot)
    return updateProjects()
  }
)

export const cloneFromGitHub = createAsyncAction(
  "clone-from-github",
  async (input: { projectRoot: string; clonePath: string }) => {
    await cloneRepository(input.projectRoot, input.clonePath)
    return updateProjects()
  }
)

export type ProjectState = {
  projects: Project[]
}

const initialState: ProjectState = {
  projects: []
}

export const reducer: Reducer<ProjectState> = createReducer(initialState)
  // TODO: Error handler
  .case(loadProjectList.resolved, (_, payload) => payload)
  .case(createNewProject.resolved, (_, payload) => payload)
  .case(cloneFromGitHub.resolved, (_, payload) => payload)

async function updateProjects(): Promise<ProjectState> {
  const projectNames = await readDirectories("/")
  return {
    projects: projectNames.map(p => {
      return {
        projectRoot: p
      }
    })
  }
}
