# Next Editor

Standalone Git Editor on Browser

Work in progress.

[Demo](https://nervous-kilby-73c9b0.netlify.com)

## My Goal

I want to move all my frontend works on chromebook. React, Storybook, Jest, Markdown and so on. I am going to implement react visualize tools on this.

And I aim for non-programmer's git introduction.

## How to develop

- `yarn watch`: strat dev server(localhost:8080)
- `yarn storybook`: start storybook(localhost:6006)
- `yarn test`: run jest and typescript checking
- `yarn deploy`: deploy to netlify

In development, you need to wait local service-worker upgrading.

## TODO: Goal to alpha version

Concept implementation

- [x] Create directory
- [x] Create file
- [x] Edit file
- [x] Git add / commit
- [x] Preview markdown
- [x] Preview Babel
- [x] Git: status Preview
- [x] Switch branch
- [x] Remove directory by right click menu
- [x] Remove deleted files on git
- [x] Create new project
- [x] Multi project switcher
- [x] Git: clone from github
- [x] Remove project
- [x] Git: push to github
- [x] Project Config: github token
- [x] Show async loading on git action
- [x] FileBrowser: Inline File / Dir Creator
- [x] Editor: Update git status of editing file only
- [x] Define app name
- [x] Commit with config name/email
- [x] Preview Tab Switcher / GitManager - MarkdownPreview
- [ ] Git: push to github better UI
- [ ] Git: merge / fast forward only
- [ ] Git: fetch
- [ ] Toggle preview layout 2 <-> 3 panes
- [ ] FileBrowser: Inline Renamer
- [ ] Editor: Update git status on git add
- [ ] Markup: total design
- [ ] PWA's manifest.json for chrome playstore / Windows store
- [ ] Purchase domain(.app?)

### TODO: Git and filesystem

- [ ] Support `.gitignore` for UI
- [ ] Git: Stash
- [ ] Git: Rebase
- [ ] Git: Rebase with conflict manager

Some features depend on isomorphic-git.

### TODO: React Enhancement

- [ ] Bundle javasciprt in browser or import from jspm.io
- [ ] React Component Preview
- [ ] Integrate https://mizchi-sandbox.github.io/grid-generator/

### TODO: Just Idea

- Simple Terminal by xterm.js / browserfs / busybox?
- P2P Realtime editing
- P2P Sync to other local git
- WebTorrent integration
- Dropbox backend via browserfs
- Check CI Progress from Editor

## LICENSE

MIT
