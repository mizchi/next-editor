# Next Editor

[![CircleCI](https://circleci.com/gh/mizchi/next-editor.svg?style=svg)](https://circleci.com/gh/mizchi/next-editor)

Standalone Git Editor on Browser

See [next-editor.app](https://next-editor.app)

## My Goal

I want to move all my frontend works on chromebook. React, Storybook, Jest, Markdown and so on. I am going to implement react visualize tools on this.

And I aim for non-programmer's git introduction.

## How to develop

- `yarn watch`: start dev server(localhost:8080)
- `yarn storybook`: start storybook(localhost:6006)
- `yarn test`: run jest and typescript checking
- `yarn deploy`: deploy to netlify

In development, you need to wait local service-worker upgrading.

## TODO: Current to 0.1.0

Load to 0.1.0

- [ ] Prompt to set committer name
- [ ] Alert dangerous operation
- [ ] TypeScript on monaco
- [ ] UI: Inline Rename
- [ ] UI: Reload after clone
- [ ] UI: Fix initial loading about update
- [ ] UI: Drag and drop
- [ ] UI: Toggle auto save
- [ ] UI: Configurable cors proxy
- [x] UI: Load history after checkout
- [x] UI: Switch layout button
- [x] UI: Folding github tools
- [x] UI: Lazy git status loading
- [x] UI: Show commit date
- [x] redux-persist
- [x] Restore last commited state
- [x] CircleCI
- [x] Renovate
- [x] GitHub markdown css

### Icebox

- [ ] Pluggable Editor by webcomponents
- [ ] Jest integration
- [ ] Support `.gitignore` for UI
- [ ] Easy Commit UI
- [ ] Git: Stash
- [ ] Git: Rebase
- [ ] Git: Rebase with conflict manager
- [ ] React: Component Preview
- [ ] Integrate https://mizchi-sandbox.github.io/grid-generator/

Some features depend on isomorphic-git.

### Just Idea

- Simple Terminal by xterm.js / browserfs / busybox?
- P2P Realtime editing by y.js
- P2P Sync to other local git
- WebTorrent integration
- Dropbox backend via browserfs
- Check CI Progress from Editor
- Firebase backend

---

# DONE

## TODO: 0.0.1 - Goal to alpha version

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
- [x] Toggle preview layout 1 <-> 2 panes
- [x] Editor: Update git status on git add
- [x] Git: merge / fast forward only
- [x] Git: push to github better UI
- [x] Git: fetch
- [x] PWA's manifest.json for chrome playstore / Windows store
- [x] Show push / fetch / merge result with modal
- [x] Markup: first design

## LICENSE

MIT
