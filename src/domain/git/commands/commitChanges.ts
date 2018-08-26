import * as git from "isomorphic-git"
export function commitChanges(
  projectRoot: string,
  message: string = "Update",
  author: { name: string; email: string }
): Promise<string> {
  return git.commit({
    author,
    dir: projectRoot,
    message
  })
}
