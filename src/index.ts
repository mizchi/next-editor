/// <reference> declarations.d.ts

import git from "isomorphic-git";
import BrowserFS from "browserfs";
console.log(BrowserFS);

BrowserFS.install(window);

BrowserFS.configure({ fs: "IndexedDB", options: {} }, (err: any) => {
  if (err) return console.log(err);
  const fs = BrowserFS.BFSRequire("fs");
  git.listFiles({ fs, dir: "/" });
});
