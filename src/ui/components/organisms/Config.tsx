import { Button, Card } from "@blueprintjs/core"
import React from "react"
import styled from "styled-components"
import { ConfigState } from "../../reducers/config"

const themes = ["default", "dark"]

export function Config({
  config,
  onClickBack,
  onClickEnterPlayground,
  onChangeConfigValue
}: {
  config: ConfigState
  onClickBack: () => void
  onClickEnterPlayground: () => void
  onChangeConfigValue: (key: string, value: string) => void
}) {
  return (
    <Container>
      <h1>Config</h1>
      <label className="bp3-label .modifier">
        Theme
        <select
          className="bp3-select"
          defaultValue={config.theme}
          onChange={event => {
            onChangeConfigValue("theme", event.target.value)
          }}
        >
          {themes.map(theme => (
            <option value={theme} key={theme}>
              {theme}
            </option>
          ))}
        </select>
      </label>
      <label className="bp3-label .modifier">
        Git: Committer Name
        <input
          placeholder="Your committer name"
          className="bp3-input"
          defaultValue={config.committerName}
          onChange={event => {
            onChangeConfigValue("committerName", event.target.value)
          }}
        />
      </label>
      <label className="bp3-label .modifier">
        Git: Committer Email
        <input
          placeholder="Your email"
          className="bp3-input"
          defaultValue={config.committerEmail}
          onChange={event => {
            onChangeConfigValue("committerEmail", event.target.value)
          }}
        />
      </label>
      <label className="bp3-label .modifier">
        GitHub: Private Access Token
        <input
          className="bp3-input"
          defaultValue={config.githubApiToken}
          style={{ width: 400 }}
          onChange={event => {
            onChangeConfigValue("githubApiToken", event.target.value)
          }}
        />
      </label>
      <label className="bp3-label .modifier">
        GitHub: CORS Proxy
        <input
          // placeholder="proxy"
          className="bp3-input"
          defaultValue={config.githubProxy}
          style={{ width: 400 }}
          onChange={event => {
            onChangeConfigValue("githubProxy", event.target.value)
          }}
        />
        <Card>
          CAUTION!!!: Setting token and using proxy are at your own risk. If we
          have vulnerability to access localStorage, it might be leak.
        </Card>
      </label>

      {process.env.NODE_ENV === "development" && (
        <div>
          <Button onClick={onClickEnterPlayground} text="Enter Playground" />
        </div>
      )}
      <div>
        <Button onClick={onClickBack} text="Back" />
      </div>
    </Container>
  )
}

const Container = styled.div`
  padding: 10px;
  margin: 0 auto;
  width: 800px;
`
