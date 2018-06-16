import pify from "pify"
import fs from "fs"
export async function readFile(filepath: string): Promise<string> {
  const file = await pify(fs.readFile)(filepath)
  return file.toString()
}
