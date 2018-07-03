import ini from "ini"

type GitConfig = {
  core: any
  remotes: string[]
}

export function parseGitConfig(text: string): GitConfig {
  const parsed = ini.parse(text)
  const remotes: any = Object.keys(parsed)
    .filter(t => t.startsWith("remote "))
    .map(t => {
      const m = t.match(/remote \"(.*)\"/)
      return m && m[1]
    })
  return { remotes, core: parsed.core }
}
