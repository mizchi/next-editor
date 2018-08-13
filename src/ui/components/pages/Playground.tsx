import { Position, Toaster } from "@blueprintjs/core"
import React from "react"
import { DragDropContext, DragSource, DropTarget } from "react-dnd"
import ReactDnDHTML5Backend from "react-dnd-html5-backend"
import { compose } from "redux"
import { Root } from "../atoms/Root"

export const AppToaster = Toaster.create({
  position: Position.RIGHT_BOTTOM as any
})

export function Playground() {
  return (
    <Root>
      <SortableList />
    </Root>
  )
}

const DND_GROUP = "sortable"
type Item = { id: string; name: string }

const SortableList = DragDropContext(ReactDnDHTML5Backend)(
  class SortableListImpl extends React.Component<any, { items: Item[] }> {
    constructor(props: any) {
      super(props)
      this.state = {
        items: [
          { id: "1", name: "aaa" },
          { id: "2", name: "bbb" },
          { id: "3", name: "ccc" }
        ]
      }
    }
    render() {
      return (
        <div>
          {this.state.items.map(item => {
            return (
              <DraggableItem
                key={item.id}
                id={item.id}
                onDrop={(toId: string, fromId: string) => {
                  // ここで入れ替える処理をする
                  const items = this.state.items.slice()
                  const toIndex = items.findIndex(i => i.id === toId)
                  const fromIndex = items.findIndex(i => i.id === fromId)
                  const toItem = items[toIndex]
                  const fromItem = items[fromIndex]
                  items[toIndex] = fromItem
                  items[fromIndex] = toItem
                  this.setState({ items })
                }}
              >
                {item.name}
              </DraggableItem>
            )
          })}
        </div>
      )
    }
  }
)

const DraggableItem: React.ComponentType<{ id: string; onDrop: any }> = compose(
  DropTarget<Item>(
    DND_GROUP,
    {
      // drop 時のコールバック
      drop(dropProps, monitor, _dropComponent) {
        if (monitor) {
          const dragProps: {
            key: string
            id: string
            onDrop: (from: string, to: string) => void
          } = monitor.getItem() as any // DragSource の props が取り出せる
          if (dropProps.id !== dragProps.id) {
            dragProps.onDrop(dragProps.id, dropProps.id)
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
