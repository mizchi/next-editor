import range from "lodash/range"
import path from "path"
import React from "react"
import { EditorConsumer } from "../../../contexts/EditorContext"

export class File extends React.Component<{
  depth: number
  fPath: string
}> {
  render() {
    const { depth, fPath } = this.props
    const basename = path.basename(fPath)
    const prefix = range(depth)
      .map((_: any) => "◽")
      .join("")
    return (
      <EditorConsumer>
        {(context: any) => {
          return (
            <div
              onClick={() => {
                console.log("load start", fPath)
                context.load(fPath)
              }}
            >{`${prefix}  - ${basename}`}</div>
          )
        }}
      </EditorConsumer>
    )
  }
}
