import * as git from "isomorphic-git"
import * as Parser from "../queries/parseStatusMatrix"

export async function commitAll(
  root: string,
  message: string,
  author: { name: string; email: string }
): Promise<string> {
  const mat = await git.statusMatrix({ dir: root })
  const modified = Parser.getModifiedFilenames(mat)
  const removable = Parser.getRemovableFilenames(mat)

  for (const filepath of modified) {
    if (removable.includes(filepath)) {
      await git.remove({ dir: root, filepath })
    } else {
      // TODO: Why?????
      if (filepath) {
        await git.add({ dir: root, filepath })
      }
    }
  }

  return git.commit({
    dir: root,
    message,
    author
  })
}
