import fs from "fs"
import * as git from "isomorphic-git"
import uniq from "lodash/uniq"
import { getFilesRecursively } from "../../filesystem/queries/getFileRecursively"

export async function getRepositoryFiles(
  projectRoot: string,
  ignoreGit: boolean = true
): Promise<string[]> {
  const files = await getFilesRecursively(projectRoot)
  const relpaths = files.map(fpath => fpath.replace(projectRoot + "/", ""))
  const indexes: string[] = (await git.listFiles({
    fs,
    dir: projectRoot,
    ref: "HEAD"
  })).filter((a: string) => !a.startsWith(".."))

  const withGitIndex = uniq(relpaths.concat(indexes))
  withGitIndex.sort()

  if (ignoreGit) {
    return withGitIndex.filter(fpath => !fpath.startsWith(".git"))
  } else {
    return withGitIndex
  }
}
