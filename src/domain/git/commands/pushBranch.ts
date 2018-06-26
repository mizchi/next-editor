import fs from "fs"
import * as git from "isomorphic-git"

export async function pushBranch(
  projectRoot: string,
  remote: string,
  ref: string,
  token: string
) {
  const ret = await (git.push as any)({
    fs,
    dir: projectRoot,
    remote,
    ref,
    authUsername: token,
    authPassword: token
  })
  return !!ret.ok
}
