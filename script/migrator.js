#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")
const prettier = require("prettier")

try {
  execSync("yarn jest __tests__/checkWeNeedMigration.test.ts", {
    cwd: path.resolve(__dirname, "..")
  })
} catch (e) {
  if (e.status === 1) {
    const migratorPath = path.join(__dirname, "../src/migrator.json")
    const jsonStr = fs.readFileSync(migratorPath).toString()
    const migrator = JSON.parse(jsonStr)
    const versions = Object.keys(migrator.migrations).map(n => Number(n))
    const latest = Math.max(...versions)
    const nextVersion = latest + 1

    const newMigrator = {
      version: nextVersion,
      migrations: {
        ...migrator.migrations,
        [nextVersion]: ["reuseConfigInState"]
      }
    }
    fs.writeFileSync(
      migratorPath,
      prettier.format(JSON.stringify(newMigrator), { parser: "json" })
    )
    console.log("----")
    console.log("created new migrator:", nextVersion, ["reuseConfigInState"])
    console.log("----")
    execSync("yarn jest __tests__/checkWeNeedMigration.test.ts -u", {
      cwd: path.resolve(__dirname, "..")
    })
  }
}
