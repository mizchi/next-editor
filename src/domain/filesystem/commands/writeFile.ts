import fs from "fs"
import pify from "pify"

/* Write content to file */
export async function writeFile(
  filepath: string,
  content: string
): Promise<void> {
  await pify(fs.writeFile)(filepath, content)
}
