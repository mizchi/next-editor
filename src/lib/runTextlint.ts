import { TextlintKernel } from "@textlint/kernel"
import TextlintMarkdown from "@textlint/textlint-plugin-markdown"
import NoTodo from "textlint-rule-no-todo"

const kernel = new TextlintKernel()

export function runTextlint(source: string, _options: any) {
  // TODO: Load modules by option
  const options = {
    filePath: "/path/to/file.md",
    ext: ".md",
    plugins: [
      {
        pluginId: "markdown",
        plugin: TextlintMarkdown
      }
    ],
    rules: [
      {
        ruleId: "no-todo",
        rule: NoTodo
      }
      // TODO: Use prh
    ]
  }
  return kernel.lintText(source, options)
}
