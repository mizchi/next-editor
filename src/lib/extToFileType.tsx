import path from "path"

const EXT_TO_FILETYPE_MAP: any = {
  ".md": "markdown",
  ".mdx": "markdown",
  ".css": "css",
  ".js": "javascript",
  ".json": "json",
  ".ts": "typescript"
}

export function extToFileType(filepath: string): string {
  const ext = path.extname(filepath)
  return EXT_TO_FILETYPE_MAP[ext] || "text"
}
