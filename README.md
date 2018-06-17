# PWA Editor

Standalone Git Editor on Browser

Work in progress.

[Demo](http://nervous-kilby-73c9b0.netlify.com)

## My Goal

I want to move all my frontend works on chromebook. React, Storybook, Jest, Markdown and so on. I am going to implement visualize tools on this.

And I aim for non-programmer's git introduction.

## How to develop

- `yarn watch`: strat dev server(localhost:8080)
- `yarn storybook`: start storybook(localhost:6006)
- `yarn test`: run jest and typescript checking
- `yarn deploy`: deploy to netlify

In development, you need to wait local service-worker upgrading.

## TODO: Goal to alpha version

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
- [ ] Show async loader on git action
- [ ] Inline File Creator
- [ ] Preview Tab Switcher
- [ ] Toggle preview layout 2 <-> 3 panes
- [ ] Git: push from github
- [ ] Markup: total design

### TODO: Git and filesystem

- [ ] Support `.gitignore`
- [ ] Git: fetch from github
- [ ] Git: Config
- [ ] Git: Rebase
- [ ] Git: Rebase with conflict manager

### TODO: React Enhancement

- [ ] Bundle javasciprt in browser or use jspm.io
- [ ] React Component Preview
- [ ] Config - commit author, GitHub Access Token via .git/config
- [ ] Integrate https://mizchi-sandbox.github.io/grid-generator/

## LICENSE

MIT
