# Next Editor

Standalone Git Editor on Browser

See working demo [next-editor.app](next-editor.app)

## My Goal

I want to move all my frontend works on chromebook. React, Storybook, Jest, Markdown and so on. I am going to implement react visualize tools on this.

And I aim for non-programmer's git introduction.

## How to develop

- `yarn watch`: strat dev server(localhost:8080)
- `yarn storybook`: start storybook(localhost:6006)
- `yarn test`: run jest and typescript checking
- `yarn deploy`: deploy to netlify

In development, you need to wait local service-worker upgrading.

## TODO: Current

- [ ] FileBrowser: Inline Renamer
- [ ] Restore last commited state
- [ ] Alert dangerous operation
- [ ] Pluggable Editor
- [ ] Jest integration
- [ ] TypeScript
- [ ] Research isomorphic-git
- [ ] Support `.gitignore` for UI
- [ ] Lazy git status loading

### TODO: Git and filesystem

- [ ] Git: Stash
- [ ] Git: Rebase
- [ ] Git: Rebase with conflict manager

Some features depend on isomorphic-git.

### TODO: React Enhancement

- [ ] React Component Preview
- [ ] Integrate https://mizchi-sandbox.github.io/grid-generator/

### TODO: Just Idea

- Simple Terminal by xterm.js / browserfs / busybox?
- P2P Realtime editing by y.js
- P2P Sync to other local git
- WebTorrent integration
- Dropbox backend via browserfs
- Check CI Progress from Editor

---

# DONE

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
