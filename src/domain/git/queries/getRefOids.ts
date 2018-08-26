import * as git from "isomorphic-git"
import flatten from "lodash/flatten"
import path from "path"

export async function getRefOids(projectRoot: string, ref: string) {
  const sha = await git.resolveRef({ dir: projectRoot, ref })
  return getCommitOids(projectRoot, sha)
}

export async function getCommitOids(projectRoot: string, oid: string) {
  const { object: commit } = await git.readObject({ dir: projectRoot, oid })
  return await searchTree(projectRoot, commit.tree)
}

export async function searchTree(
  projectRoot: string,
  oid: string
): Promise<Array<{ oid: string; filepath: string }>> {
  const files = await _searchTree({ dir: projectRoot, oid, prefix: "" })
  return files.sort((a, b) => (a.filepath < b.filepath ? -1 : 1))
}

async function _searchTree({
  dir,
  oid,
  prefix
}: {
  dir: string
  oid: string
  prefix: string
}): Promise<Array<{ oid: string; filepath: string }>> {
  const { object: tree } = await git.readObject({ dir, oid })
  const files = await Promise.all(
    tree.entries.map(async (entry: any) => {
      if (entry.type === "blob") {
        return [
          {
            oid: entry.oid,
            filepath: path.join(prefix, entry.path)
          }
        ]
      } else if (entry.type === "tree") {
        return _searchTree({
          dir,
          oid: entry.oid,
          prefix: path.join(prefix, entry.path)
        })
      }
    })
  )
  return flatten(files as any)
}
