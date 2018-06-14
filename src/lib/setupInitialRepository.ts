import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import {
  existsPath,
  mkdirInRepository,
  Repository,
  writeFileInRepository
} from "./repository"

const j = path.join

const Introduction = `# PWA Editor

Standalone Git Editor by isomophic-git

## Goal

My goal is to conclude my frontend works on Chromebook.

- 1st: Markdown friendly for writers
- 2nd: Wise react component preview

Stretch goal

- Push, pull and clone from GitHub
- P2P git communication

I do *NOT* think this can replace vscode and atom. Only for specific usecase(markdown or react) or non-programars who can not install git.

## Features

- GitHub

## TODO

- [x] Create directory
- [x] Create file
- [x] Edit file
- [x] Git add / commit
- [x] Preview markdown
- [x] Preview Babel
- [x] Git: status Preview
- [ ] Toggle preview layout 2 <-> 3 panes
- [x] Switch branch
- [ ] Remove directory by right click menu
- [ ] Remove deleted files on git
- [ ] Handle .gitignore
- [ ] Multi project switcher
- [ ] Bundle javasciprt in browser or use jspm.io
- [ ] React Component Preview
- [ ] Git: push from github
- [ ] Git: fetch from github
- [ ] Git: clone from github
- [ ] Config - commit author, GitHub Access Token via .git/config
- [ ] Integrate https://mizchi-sandbox.github.io/grid-generator/
`

/* WRITE */
export async function setupInitialRepository(repo: Repository) {
  // ensure directory
  if (await existsPath(repo.dir)) {
    console.log("Project: already exists")
  } else {
    console.log("Project: creating...")
    await mkdirInRepository(repo, "")
    await writeFileInRepository(repo, "README.md", Introduction)
    // await writeFileInRepository(repo, "src/index.js", "export default {}")
    console.log("Project: creating done")
  }

  // ensure git
  if (await existsPath(j(repo.dir, ".git"))) {
    console.log(".git: already exists")
  } else {
    await git.init(repo)
    await git.add({
      dir: "/playground",
      filepath: "README.md",
      fs
    })
    await git.commit({
      author: {
        email: "dummy",
        name: "system"
      },
      dir: "/playground",
      fs,
      message: "Init"
    })
    console.log("Ensure initial commit")
  }
}
