import fs from "fs"
import orderBy from "lodash/orderBy"
import path from "path"
import pify from "pify"
import { FileInfo } from "../../types"

export async function readFileStats(
  projectRoot: string,
  dirpath: string
): Promise<FileInfo[]> {
  const filenames: string[] = await pify(fs.readdir)(dirpath)

  const ret: any = await Promise.all(
    filenames.map(async name => {
      const childPath = path.join(dirpath, name)
      const stat = await pify(fs.stat)(childPath)
      return {
        name,
        type: stat.isDirectory() ? "dir" : "file"
      }
    })
  )
  return orderBy(ret, [(s: FileInfo) => s.type + "" + s.name])
}
