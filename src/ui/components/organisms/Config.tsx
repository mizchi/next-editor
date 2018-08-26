import { Button, Card, Slider } from "@blueprintjs/core"
import round from "lodash/round"
import React from "react"
import styled from "styled-components"
import { ConfigState } from "../../reducers/config"

const themes = ["default", "dark"]

export function Config({
  config,
  onClickBack,
  onChangeConfigValue
}: {
  config: ConfigState
  onClickBack: () => void
  onChangeConfigValue: (key: string, value: string | number | boolean) => void
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
        editor:font-size
        <Slider
          min={0}
          max={3}
          stepSize={0.1}
          labelStepSize={0.5}
          vertical={false}
          onChange={value => {
            onChangeConfigValue("editorFontScale", round(value, 1))
          }}
          initialValue={config.editorFontScale}
          value={config.editorFontScale}
        />
      </label>

      <label className="bp3-label .modifier">
        editor:font-family
        <input
          spellCheck={false}
          className="bp3-input"
          defaultValue={config.editorFontFamily}
          style={{ width: 400 }}
          onChange={event => {
            onChangeConfigValue("editorFontFamily", event.target.value)
          }}
        />
      </label>

      <label className="bp3-label .modifier">
        GitHub: CORS Proxy
        <input
          // placeholder="proxy"
          className="bp3-input"
          defaultValue={config.corsProxy}
          style={{ width: 400 }}
          onChange={event => {
            onChangeConfigValue("corsProxy", event.target.value)
          }}
        />
        <br />
        <Card>
          CAUTION!!!: Setting token and using proxy are at your own risk. If we
          have vulnerability to access localStorage, it might be leak.
        </Card>
      </label>

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
