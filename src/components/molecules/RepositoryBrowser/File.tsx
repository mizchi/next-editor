import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenu, ContextMenuProvider, Item } from "react-contexify"
import "react-contexify/dist/ReactContexify.min.css"
import { connect } from "react-redux"
import { EditorConsumer } from "../../../contexts/EditorContext"
import * as RepositoryActions from "../../../reducers/repository"

export class File extends React.Component<{
  depth: number
  filepath: string
}> {
  componentDidCatch(e: Error) {
    console.log("error catched", e)
  }
  render() {
    const { depth, filepath } = this.props
    const basename = path.basename(filepath)
    const prefix = range(depth)
      .map((_: any) => "◽")
      .join("")
    return (
      <EditorConsumer>
        {(context: any) => {
          return (
            <div>
              <ContextMenuProvider id="menu_id" data={{ filepath }}>
                <div
                  onClick={() => context.load(filepath)}
                >{`${prefix}  - ${basename}`}</div>
              </ContextMenuProvider>
              {/* <FileContextMenu filepath={filepath} /> */}
            </div>
          )
        }}
      </EditorConsumer>
    )
  }
}

// type Props = (typeof RepositoryActions) & {
//   filepath: string
// }

// const onClick: any = ({ event, ref, data, dataFromProvider }: any) =>
//   console.log("Hello", ref, data, dataFromProvider)

// const FileContextMenu = connect(
//   (_: any, ownProps: any) => ownProps,
//   RepositoryActions
// )((props: Props) => {
//   return (
//     <ContextMenu id="menu_id">
//       <Item
//         data={{
//           exec: props.deleteFile,
//           filepath: props.filepath
//         }}
//         onClick={onClick}
//         //   console.log("delete file", data)
//         //   // props.deleteFile(props.filepath)
//         // }}
//       >
//         Delete
//       </Item>
//     </ContextMenu>
//   )
// })
