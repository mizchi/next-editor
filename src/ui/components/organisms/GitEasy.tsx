import { Button, Intent } from "@blueprintjs/core"
import fs from "fs"
import * as git from "isomorphic-git"
import path from "path"
import pify from "pify"
import React from "react"
import * as Parser from "../../../domain/git/queries/parseStatusMatrix"
import { connector } from "../../actionCreators"
import { toast } from "../utils/toast"
import { GitBriefHistory } from "./GitBriefHistory"
import Octokit from "@octokit/rest"

// This is example reference
export const GitEasy = connector(
  state => {
    return {
      projectRoot: state.repository.currentProjectRoot,
      githubApiToken: state.config.githubApiToken,
      currentBranch: state.git.currentBranch,
      statusMatrix: state.git.statusMatrix,
      corsProxy: state.config.corsProxy,
      remotes: state.git.remotes
    }
  },
  actions => {
    return {
      commitAll: actions.git.commitAll,
      initializeGitStatus: actions.editor.initializeGitStatus,
      updateRemotes: actions.git.updateRemotes
    }
  }
)(props => {
  if (props.statusMatrix == null) {
    return <span>Loading</span>
  } else {
    const removable = Parser.getRemovableFilenames(props.statusMatrix)
    const modified = Parser.getModifiedFilenames(props.statusMatrix).filter(
      a => !removable.includes(a)
    )

    const hasChanges = modified.length > 0 || removable.length > 0

    const showCreateRepo = props.githubApiToken && props.remotes.length === 0

    return (
      <div>
        {showCreateRepo && (
          <Button
            text="Create GitHub Repository"
            onClick={async () => {
              // Start
              const sp = props.projectRoot.split("/")
              const repo = sp[sp.length - 1]
              console.log(process.env)
              process.browser = true
              // debugger

              const octokit = require("@octokit/rest")()

              octokit.authenticate({
                type: "oauth",
                token: props.githubApiToken
              })

              const result = await octokit.repos.create({
                name: repo
              })

              const url = result.data.html_url

              toast({
                intent: Intent.SUCCESS,
                message: `Create repo: ${url}`
              })

              const configPath = path.join(props.projectRoot, ".git/config")
              let config = (await pify(fs.readFile)(configPath)).toString()
              config += `\n[remote "origin"]\n`
              config += `\turl = ${url}\n`
              config += `\tfetch = +refs/heads/*:refs/remotes/origin/*\n`

              await pify(fs.writeFile)(configPath, config)

              toast({
                intent: Intent.SUCCESS,
                message: `Write .git/config`
              })

              try {
                const pushResult = await git.push({
                  dir: props.projectRoot,
                  remote: "origin",
                  ref: "master",
                  force: true,
                  username: props.githubApiToken,
                  password: props.githubApiToken,
                  corsProxy: props.corsProxy
                })
                if (pushResult.ok) {
                  toast({
                    intent: Intent.SUCCESS,
                    message: `git push success`
                  })
                  window.open(url, "_blank")
                  props.updateRemotes({ projectRoot: props.projectRoot })
                } else {
                  toast({
                    intent: Intent.DANGER,
                    message: `Push failed`
                  })
                }
              } catch (e) {
                toast({
                  intent: Intent.DANGER,
                  message: `Push failed: something wrong`
                })
              }
            }}
          />
        )}

        <hr />
        <h1>Changes</h1>
        <Button
          text="Commit All"
          disabled={!hasChanges}
          onClick={() => {
            props.commitAll({ message: "Update" })
          }}
          data-testid="commit-all-button"
        />
        <Button
          text="Reload git"
          onClick={() => {
            props.initializeGitStatus(props.projectRoot)
          }}
        />

        {!hasChanges && <p>No Changes</p>}
        {hasChanges && (
          <>
            <div>
              {modified.map(filepath => {
                return (
                  <div key={filepath}>
                    {filepath}
                    (modified)
                  </div>
                )
              })}
            </div>
            <div>
              {removable.map(filepath => {
                return (
                  <div key={filepath}>
                    {filepath}
                    (deleted)
                  </div>
                )
              })}
            </div>
          </>
        )}

        <GitBriefHistory />
      </div>
    )
  }
})
