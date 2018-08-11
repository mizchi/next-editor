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
              {Entry && <Entry />}
            </Card>
          )
        })}
      </>
    )
  }
}
