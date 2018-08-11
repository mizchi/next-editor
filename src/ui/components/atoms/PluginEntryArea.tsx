import { Card } from "@blueprintjs/core"
import React from "react"

export class PluginEntryArea extends React.Component<any> {
  render() {
    return (
      <>
        {Object.keys(NEPlugins).map(pluginName => {
          const plugin = NEPlugins[pluginName]
          const Entry = plugin.EntryPageComponent
          return (
            <Card key={pluginName}>
              <h3>
                Plugin:
                {pluginName}
              </h3>
              <PluginErrorBoundary>{Entry && <Entry />}</PluginErrorBoundary>
            </Card>
          )
        })}
      </>
    )
  }
}

class PluginErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error: Error | null; info: any }
> {
  state = { hasError: false, error: null, info: null }
  componentDidCatch(error: Error, info: any) {
    this.setState({ hasError: true, error, info })
    console.error(error, info)
  }
  render() {
    const { hasError, error, info } = this.state
    if (hasError && error && info) {
      return (
        <div style={{ padding: 10 }}>
          <p>Plugin Loading Error: {error && (error as any).message}</p>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}
