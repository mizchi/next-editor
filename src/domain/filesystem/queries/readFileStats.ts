import fs from "fs"
import * as git from "isomorphic-git"
import orderBy from "lodash/orderBy"
import path from "path"
import pify from "pify"
import { FileInfo } from "../../types"

export async function readFileStats(
  projectRoot: string,
  dirpath: string
): Promise<FileInfo[]> {
  const filenames: string[] = await pify(fs.readdir)(dirpath)

  const relpath = path.relative(projectRoot, dirpath)

  const mat = await (git as any).statusMatrix({
    dir: projectRoot,
    pattern: relpath.length > 0 ? path.join(relpath, "*") : "*"
  })

  const indexedFiles = mat.map((x: [string, number, number, number]) =>
    path.join(dirpath, x[0])
  )

  const ret: any = await Promise.all(
    filenames.map(async name => {
      const childPath = path.join(dirpath, name)
      const stat = await pify(fs.stat)(childPath)

      return {
        name,
        type: stat.isDirectory() ? "dir" : "file",
        ignored: !indexedFiles.includes(childPath)
      }
    })
  )
  return orderBy(ret, [(s: FileInfo) => s.type + "" + s.name])
}
