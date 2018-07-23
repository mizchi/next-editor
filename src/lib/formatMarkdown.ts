import markdown from "prettier/parser-markdown"
import prettier from "prettier/standalone"

export function formatMarkdown(md: string) {
  return prettier.format(md, { parser: "markdown", plugins: [markdown] })
}
