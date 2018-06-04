export function setupBrowserFS(): Promise<any> {
  return new Promise(resolve => {
    BrowserFS.configure({ fs: "IndexedDB", options: {} }, (err: any) => {
      if (err) {
        throw err
      }
      window.fs = BrowserFS.BFSRequire("fs")
      resolve(window.fs)
    })
  })
}
