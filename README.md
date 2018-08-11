<h1><img src="assets/Logotype-primary.png" width="65%" height="65%" alt="Next Editor" /></h1>

[![CircleCI](https://circleci.com/gh/mizchi/next-editor.svg?style=svg)](https://circleci.com/gh/mizchi/next-editor)

[![Coverage Status](https://coveralls.io/repos/github/mizchi/next-editor/badge.svg?branch=release)](https://coveralls.io/github/mizchi/next-editor?branch=release)

Standalone git integrated editor (for chromebook)

![](https://i.gyazo.com/4819943cb09b3c69e183eae9a5dae748.png)

Play here [next-editor.app](https://nedi.app)

**Unstable**: Data may be wiped by update

I am checking only Chrome and Chrome Canary.

## How to develop

- `yarn watch`: start dev server(localhost:8099)
- `yarn test`: run jest and typescript checking

In development, you need to wait local service-worker upgrading.

## Recommened dev tools

- react-dev-tools: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
- redux-dev-tools: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

## How to create your own next-editor

### Deploy your own apllication

Register https://www.netlify.com

- `yarn deploy`: deploy to netlify
- (Complete netlify authentication flow)

or

- `yarn build:prod`
- Deploy `public` directory to your host.

### Optional: CORS-PROXY

Register https://now.sh to deploy cors-buster
You need proxy to push GitHub

- `npm i -g now-cli`
- `now wmhilton/cors-buster` (using https://github.com/wmhilton/cors-buster)
- Set your default proxy on [src/ui/reducers/config.ts](src/ui/reducers/config.ts): `githubProxy: "<your-proxy>/github.com/"`

### Optional: Custom entry

```
mkdir src-custom
touch src-custom/index.js
SRC="src-custom" yarn build:prod
```

```js
// src-custom/index.js

import { setupInitialRepository } from "../src/domain/git/commands/setupInitialRepository"
import { run } from "../src/init"

// Write your own bootstrap
async function main() {
  try {
    await setupInitialRepository("/playground")
  } catch (e) {
    // Skip
    console.error("init error", e)
  }
  run()
}

main()
```

This feature is for private custom build to release [next-editor.app](next-editor.app).

## How to contribute

- Fork this repository on GitHub
- Write your code to modify
- Write test under `__tests__/*.ts`
- Pass `yarn test`
- Create Pull-Request to this repository

See what @mizchi plan on [TODO.md](TODO.md)

PR is welcome!

---

## LICENSE

MIT
