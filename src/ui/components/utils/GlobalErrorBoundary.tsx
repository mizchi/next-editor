import React from "react"

export class GlobalErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error: Error | null; info: any }
> {
  state = { hasError: false, error: null, info: null }
  componentDidCatch(error: Error, info: any) {
    // TODO: Resume by known bugs
    this.setState({ hasError: true, error, info })
    console.error(error, info)
  }
  render() {
    const { hasError, error, info } = this.state
    if (hasError && error && info) {
      return (
        <div style={{ padding: 10 }}>
          <h1>NextEditor: Recorvery Mode</h1>
          <h2>Error: {(error as any).message}</h2>

          <button
            onClick={() => {
              window.location.reload()
            }}
          >
            Reload
          </button>

          <button
            onClick={() => {
              window.localStorage.clear()
              window.location.reload()
            }}
          >
            Reload with clear localStorage
          </button>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}
