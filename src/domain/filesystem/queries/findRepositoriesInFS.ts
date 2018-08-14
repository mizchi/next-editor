import fs from "fs"
import flatten from "lodash/flatten"
import path from "path"
import pify from "pify"
import { existsPath } from ".."

export async function findRepositoriesWithGit(
  currentDir: string = ""
): Promise<string[]> {
  if (await existsPath(path.join(currentDir, ".git"))) {
    return [currentDir]
  }
  const paths = await pify(fs.readdir)(currentDir)
  const chunks: string[][] = (await Promise.all(
    paths.map(async (s: string) => {
      const nextDir = path.join(currentDir, s)
      const stat = await pify(fs.stat)(nextDir)
      if (stat.isDirectory()) {
        return findRepositoriesWithGit(nextDir)
      }
      return []
    })
  )) as any

  return flatten(chunks)
}
