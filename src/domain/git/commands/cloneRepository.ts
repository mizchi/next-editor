import delay from "delay"
import { EventEmitter } from "events"
import * as git from "isomorphic-git"

export async function cloneRepository(
  projectRoot: string,
  cloneDest: string,
  options: {
    corsProxy?: string
    onProgress?: (pe: ProgressEvent) => void
    onMessage?: (message: string) => void
    depth?: number
    singleBranch?: boolean
  } = {}
): Promise<void> {
  const emitter = new EventEmitter()

  if (options.onProgress) {
    emitter.on("progress", options.onProgress)
  }
  if (options.onMessage) {
    emitter.on("message", options.onMessage)
  }

  // not async for test
  const clonePromise = git.clone({
    dir: projectRoot,
    url: cloneDest,
    ref: "master",
    emitter,
    ...options
  })

  while (true) {
    await delay(1000)
    try {
      const list = await git.listFiles({ dir: projectRoot })
      const e = await git.status({ dir: projectRoot, filepath: list[0] })
      console.log("status correct with", e)
      break
    } catch (e) {
      console.log("wait...", e.message)
    }
  }

  await clonePromise
  return clonePromise
}
