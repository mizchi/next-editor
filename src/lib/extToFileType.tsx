import path from "path"

const EXT_TO_FILETYPE_MAP: any = {
  ".js": "javascript",
  ".md": "markdown",
  ".txt": "text"
}

export function extToFileType(filepath: string): string {
  const type = path.extname(filepath)
  return EXT_TO_FILETYPE_MAP[type] || "text"
}
