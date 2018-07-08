import { getFilesRecursively } from "../../filesystem/queries/getFileRecursively"

export async function getRepositoryFiles(
  projectRoot: string,
  ignoreGit: boolean = true
): Promise<string[]> {
  const files = await getFilesRecursively(projectRoot)
  const relpaths = files.map(fpath => fpath.replace(projectRoot + "/", ""))

  if (ignoreGit) {
    return relpaths.filter(fpath => !fpath.startsWith(".git"))
  } else {
    return relpaths
  }
}
