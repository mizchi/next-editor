import { FileNode } from "../../types"
import { readRecursiveFileNode } from "../queries/getFileRecursively"
import { rmdir } from "./rmdir"
import { unlink } from "./unlink"

export async function removeDirectory(dirpath: string) {
  const node = await readRecursiveFileNode(dirpath)
  return removeDirectoryRecursively(node)
}

async function removeDirectoryRecursively(node: FileNode) {
  if (node.type === "file") {
    await unlink(node.pathname)
  } else if (node.type === "dir") {
    for (const child of node.children) {
      await removeDirectoryRecursively(child)
    }
    await rmdir(node.pathname)
  }
}
