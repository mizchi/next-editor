import { Icon } from "@blueprintjs/core"
import fs from "fs"
import range from "lodash/range"
import path from "path"
import pify from "pify"
import React from "react"
import {
  ContextMenu,
  ContextMenuProvider,
  Item,
  Separator
} from "react-contexify"
import { lifecycle } from "recompose"
import styled from "styled-components"
import { connector } from "../../../actionCreators"
import { Input } from "../../atoms/Input"
import { Pathname } from "../../atoms/Pathname"
import { Draggable } from "./Draggable"

type OwnProps = {
  depth: number
  filepath: string
  ignoreGit: boolean
}

export const FileLine: React.ComponentType<OwnProps> = connector(
  (state, ownProps: OwnProps) => {
    return {
      ...ownProps,
      isMobile: state.app.isMobile,
      editingFilepath: state.buffer.filepath,
      renamingPathname: state.repository.renamingPathname
    }
  },
  actions => {
    return {
      loadFile: actions.editor.loadFile,
      fileMoved: actions.editor.fileMoved,
      endRenaming: actions.repository.endRenaming,
      pushScene: actions.app.pushScene
    }
  },
  lifecycle({
    componentWillUnmount() {
      const p: {
        renamingPathname: string
        filepath: string
        endRenaming: any
      } = this.props as any
      if (p.renamingPathname === p.filepath) {
        p.endRenaming({})
      }
    }
  })
)(function FileLineImpl(props) {
  const { depth, filepath, editingFilepath, fileMoved } = props
  const basename = path.basename(filepath)

  if (props.renamingPathname === filepath) {
    return (
      <div>
        <Input
          focus
          initialValue={basename}
          onCancel={() => {
            props.endRenaming({})
          }}
          onConfirm={async (value: string) => {
            // TODO: Move them in action
            const dirname = path.dirname(filepath)
            const destPath = path.join(dirname, value)
            await pify(fs.rename)(filepath, destPath)
            props.endRenaming({})
            props.fileMoved({ fromPath: filepath, destPath })
          }}
        />
      </div>
    )
  }
  return (
    <ContextMenuProvider id="file" data={{ filepath }}>
      <Draggable
        pathname={filepath}
        type="file"
        onDrop={async result => {
          if (result) {
            fileMoved(result)
          }
        }}
        onDropByOther={_result => {
          // Do nothing yet
        }}
      >
        <Container selected={editingFilepath === filepath}>
          <div
            onClick={() => {
              props.loadFile({ filepath })
              if (props.isMobile) {
                props.pushScene({ nextScene: "edit" })
              }
            }}
          >
            {range(depth).map((_, k) => (
              <span key={k}>&nbsp;&nbsp;</span>
            ))}
            <Icon icon="document" />
            &nbsp;
            <Pathname ignoreGit={props.ignoreGit}>{basename}</Pathname>
          </div>
        </Container>
      </Draggable>
    </ContextMenuProvider>
  )
}) as any

const Container: React.ComponentType<{ selected: boolean }> = styled.div`
  cursor: pointer;
  user-select: none;
  padding-left: 2px;

  &:hover {
    background: black;
    color: white;
    color: ${(p: { selected: boolean }) =>
      p.selected ? "rgb(200, 64, 64)" : "white"};
  }
`
Container.displayName = "FileLine:Container"

export const FileContextMenu: any = connector(
  state => ({
    root: state.repository.currentProjectRoot
  }),
  actions => ({
    addToStage: actions.editor.addToStage,
    deleteFile: actions.editor.deleteFile,
    startRenaming: actions.repository.startRenaming
  })
)(function FileContextMenuImpl(props) {
  return (
    <ContextMenu id="file">
      <Item
        onClick={({ dataFromProvider }: any) => {
          props.startRenaming({ pathname: dataFromProvider.filepath })
        }}
      >
        Rename
      </Item>
      <Item
        onClick={({ dataFromProvider }: any) => {
          props.deleteFile({ filename: dataFromProvider.filepath })
        }}
      >
        Delete
      </Item>
      <Separator />
      <Item
        onClick={({ dataFromProvider }: any) => {
          const relpath = path.relative(props.root, dataFromProvider.filepath)
          props.addToStage({ projectRoot: props.root, relpath })
        }}
      >
        Add to stage
      </Item>
    </ContextMenu>
  )
})
