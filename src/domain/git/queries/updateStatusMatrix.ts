import * as git from "isomorphic-git"
import { StatusMatrix, StatusRow } from "../../types"

export async function updateStatusMatrix(
  projectRoot: string,
  matrix: StatusMatrix,
  patterns: string[]
): Promise<StatusMatrix> {
  // return getStagingStatus(projectRoot)
  if (patterns.length === 0) {
    return git.statusMatrix({ dir: projectRoot })
  }

  const buffer = [...matrix]
  for (const pattern of patterns) {
    const newMat = await git.statusMatrix({
      dir: projectRoot,
      pattern
    })
    console.log("row for", pattern, newMat)

    for (const newRow of newMat) {
      const [fpath] = newRow
      const bufferIndex = buffer.findIndex(([f]: StatusRow) => {
        return f === fpath
      })

      if (bufferIndex > -1) {
        buffer[bufferIndex] = newRow
      } else {
        buffer.push(newRow)
      }
    }
  }

  return buffer
}
