import { getFilesRecursively } from "../../filesystem/queries/getFileRecursively"

export async function getRepositoryFiles(
  projectRoot: string
): Promise<string[]> {
  const files = await getFilesRecursively(projectRoot)
  return files
    .map(fpath => fpath.replace(projectRoot + "/", ""))
    .filter(fpath => !fpath.startsWith(".git"))
}
