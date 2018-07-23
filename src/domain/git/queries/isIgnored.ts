import { getFileStatus } from "./getFileStatus"

export async function isIgnored(root: string, relpath: string) {
  const status = await getFileStatus(root, relpath)
  return status === "ignored"
}
