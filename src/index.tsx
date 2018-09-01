import { run } from "./runApp"

async function main() {
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
