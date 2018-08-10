import { setupInitialRepository } from "./domain/git/commands/setupInitialRepository"
import { run } from "./init"

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
