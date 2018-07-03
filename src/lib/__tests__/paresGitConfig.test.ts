import assert from "power-assert"
import { parseGitConfig } from "../parseGitConfig"

const gitConfigText = `
[core]
	ignorecase = true

[remote "origin"]
	fetch = +refs/heads/*:refs/remotes/origin/*
	url = https://cors-buster-tbgktfqyku.now.sh/github.com/mizchi/next-editor
`

test("can parse gitConfig", () => {
  const ret = parseGitConfig(gitConfigText)
  assert.deepEqual(ret, {
    core: {
      ignorecase: true
    },
    remotes: ["origin"]
  })
})
