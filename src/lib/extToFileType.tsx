import path from "path"

const EXT_TO_FILETYPE_MAP: any = {
  ".js": "javascript",
  ".md": "markdown",
  ".txt": "text"
}

export function extToFileType(filePath: string): string {
  const type = path.extname(filePath)
  return EXT_TO_FILETYPE_MAP[type] || "text"
}
