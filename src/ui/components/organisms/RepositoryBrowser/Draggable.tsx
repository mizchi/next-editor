import fs from "fs"
import path from "path"
import pify from "pify"
import React from "react"
import { DragSource, DropTarget } from "react-dnd"
import { compose } from "redux"

const DND_GROUP = "browser"

type Item = {
  pathname: string
  type: "file" | "dir"
}

type Result = {
  fromPath: string
  destPath: string
}

type DraggableItemProps = Item & {
  onDrop: (resultPromise: Result | void) => void
  onDropByOther: (resultPromise: Result | void) => void
}

async function moveItem(from: Item, to: Item): Promise<Result | void> {
  if (from.pathname === to.pathname) {
    return
  }
  if (to.type === "dir") {
    const fromPath = from.pathname
    const basename = path.basename(from.pathname)
    const destPath = path.join(to.pathname, basename)

    await pify(fs.rename)(fromPath, destPath)
    return {
      fromPath,
      destPath
    }
  }
}

export const Draggable: React.ComponentType<DraggableItemProps> = compose(
  DropTarget<Item>(
    DND_GROUP,
    {
      drop(dropProps, monitor, otherComponent: any) {
        if (monitor) {
          // debugger
          const dragProps: DraggableItemProps = monitor.getItem() as any // DragSource の props が取り出せる
          if (dropProps.pathname !== dragProps.pathname) {
            console.log("[dnd/draggable/exec]", dragProps, dropProps)
            moveItem(dragProps, dropProps).then(result => {
              otherComponent.props.onDropByOther(result)
              dragProps.onDrop(result)
            })
          }
        }
      }
    },
    connect => {
      return {
        connectDropTarget: connect.dropTarget()
      }
    }
  ),
  DragSource<Item>(
    DND_GROUP,
    {
      beginDrag(props) {
        return props
      }
    },
    (connect, monitor) => {
      return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
      }
    }
  )
)((props: any) => {
  return props.connectDragSource(
    props.connectDropTarget(<div>{props.children}</div>)
  )
}) as any
