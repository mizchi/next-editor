import fs from "fs"
import pify from "pify"
export async function writeFile(aPath: string, content: string): Promise<void> {
  await pify(fs.writeFile)(aPath, content)
}
