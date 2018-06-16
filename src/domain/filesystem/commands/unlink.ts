import fs from "fs"
import pify from "pify"
export async function unlink(aPath: string): Promise<void> {
  await pify(fs.unlink)(aPath)
}
