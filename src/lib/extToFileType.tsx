import path from "path"

export function extToFileType(filePath: string) {
  const type = path.extname(filePath)
  switch (type) {
    case ".md":
      return "markdown"
    case ".js":
      return "javascript"
    default:
      return "text"
  }
}
