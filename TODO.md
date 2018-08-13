# TODO

## Current

- [ ] Stop creating on unmount node
- [ ] Fix input overflow on rename file
- [ ] PluginLoader
- [ ] Lazy load
  - [ ] prettier
  - [ ] monaco-editor
- [ ] Show toast after git.push
- [ ] Reload git status
- [ ] Better diff

---

# Milestone

## v1.0.0

- Ready to use for writers (especially markdown editing)
- Stable for Git actions

## v2.0.0

- Stable for GitHub actions
- Ready to use for frontend programmers
  - Run JavaScript test codes
  - Edit React Component

---

## v0.20.0

- [x] Drag and Drop
- [x] Inline rename
- [x] Stop react-contextify => Blueprint's ContextMenu is not useful

## v0.19.0

- [x] Fix Overflow
- [x] View Menu
- [x] Project Menu
- [x] Stop react-tooltip
- [x] Stop absolute on grid
- [x] Login with Modal
- [x] Refactor: organisms
- [x] Help tab

## v0.18.0

- [x] Move to nedi.app

## v0.17.0

- [x] Show login only for tester
- [x] Fix context-menu
- [x] Fix test
  - [x] Jest
  - [x] TypeScript
- [x] Restore mdx
- [x] Create @mizchi/jest-mdx-loader
- [x] Restore react-contextify

## 0.16.0

- [x] UI: Save tab state in reducer
- [x] Refactor: Editors
- [x] UI: Show short filename on toolbar
- [x] UI: Auto focus on file select
- [x] UI: Open editing file dir on open
- [x] UI: Start scratch.md on init
- [x] UI: Show diff on history
- [x] UI: Grayed out ignored files
- [x] UI: Hide .git
- [x] UI: Avoid staging status for .git or ignored files
- [x] UI: Elastic plain textearea
- [x] Prettier for markdown

## 0.4.0

- [x] UI: Redirect to https on production
- [x] UI: Easy Commit all
- [x] UI: Wysiwyg for markdown
- [x] Checkout from file history on editor
- [x] Checkout file on from history
- [x] UI: Toggle auto save
- [x] UI: Update git status at directory remove

## 0.2.0

- [x] UI: Theme
- [x] Dev: redux-dev-tools
- [x] Dev: Supress renovate
- [x] Dev: coveralls
- [x] Dev: docz
- [x] Dev: babel7
- [x] Dev: deploy with netlify
- [x] UI: Reload after clone
- [x] UI: Show changelog in app
- [x] Merge with remote branches
- [x] Regression: remove project does not work
- [x] Regression: remove file does not work

## 0.0.4

- [x] Alert dangerous operation: like checkout
- [x] Reload file content on checkout
- [x] Git: delete branch
- [x] Merge with fast-forward check
- [x] Reload history on change branch
- [x] UI: Fix initial loading about git status
- [x] Prompt to set committer name/email
- [x] Prompt to set github api token
- [x] TypeScript 3.0
- [x] Unload editor on change repository
- [x] Refactor actions

## 0.0.3

- [x] UI: Configurable cors proxy
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
- [x] Support `.gitignore`

## 0.0.1

Proof of Concept

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

---

## Icebox / Ideas

- [ ] UI: Quick file name search: (fuzzy match)
- [ ] UI: Rewrite buffer without file change
- [ ] UI: Inhibit checkout if hash has same content
- [ ] UI: Expand all
- [ ] textlint
- [ ] Research ipfs or webtorrent to share
- [ ] UI: Inline Rename
- [ ] UI: Drag and drop
- [ ] Clone with countdown
- [ ] Git: Cherry pick
- [ ] Git: Rebase
- [ ] Git: Shallow
- [x] Git: Ensure git clone
- [ ] Guidance for github api token on config
- [ ] TypeScript on monaco
- [ ] Pluggable Editor by webcomponents
- [ ] Jest integration
- [ ] Git: Stash
- [ ] Git: Rebase with conflict manager
- [ ] React: Component Preview
- [ ] GitHub: Issue integration
- [ ] Integrate https://mizchi-sandbox.github.io/grid-generator/
- [ ] Create dump
- [x] Recovery mode
- [ ] Recovery status
- [ ] Fix dragging style
