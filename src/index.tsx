import { run } from "./init"

async function main() {
  await new Promise(resolve => {
    const BrowserFS = require("browserfs")
    BrowserFS.install(window)
    BrowserFS.configure({ fs: "IndexedDB", options: {} }, (err: Error) => {
      if (err) {
        throw err
      }

      resolve()
    })
  })

  try {
    const {
      setupInitialRepository
    } = await import("./domain/git/commands/setupInitialRepository")
    await setupInitialRepository("/playground")
  } catch (e) {
    // Skip
    console.error("init error", e)
  }
  run()
}

main()
