import React from "react"
import styled from "styled-components"

export const Config = ({ onClickBack }: { onClickBack: () => void }) => {
  return (
    <Container>
      <h1>Config</h1>
      <div>
        <span>Git: Committer Name</span>
        &nbsp;
        <input
          defaultValue={localStorage.getItem("committer-name") || ""}
          onChange={event => {
            localStorage.setItem("committer-name", event.target.value)
          }}
        />
      </div>
      <div>
        <span>Git: Commiter Email</span>
        &nbsp;
        <input
          defaultValue={localStorage.getItem("committer-email") || ""}
          onChange={event => {
            localStorage.setItem("committer-email", event.target.value)
          }}
        />
      </div>
      <div>
        <span>GitHub: Private Access Token</span>
        &nbsp;
        <input
          defaultValue={localStorage.getItem("github-token") || ""}
          onChange={event => {
            localStorage.setItem("github-token", event.target.value)
          }}
        />
        <p>
          CAUTION!!!: Setting token is at your own risk. If we have
          vulnerability to access localStorage, it might be leak.
        </p>
      </div>
      <div>
        <button onClick={onClickBack}>Back</button>
      </div>
    </Container>
  )
}

const Container = styled.div`
  padding: 10px;
`
