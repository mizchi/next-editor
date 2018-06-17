import fs from "fs"
import pify from "pify"
export async function rmdir(aPath: string): Promise<void> {
  await pify(fs.rmdir)(aPath)
}
