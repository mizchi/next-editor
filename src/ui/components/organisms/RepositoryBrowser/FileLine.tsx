import { Icon } from "@blueprintjs/core"
import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import styled from "styled-components"
import { connector } from "../../../actionCreators"
import { Pathname } from "../../atoms/Pathname"

type OwnProps = {
  depth: number
  filepath: string
  ignoreGit: boolean
}

type Props = OwnProps & {
  loadFile: any
  editingFilepath: string
}

export const FileLine: React.ComponentType<OwnProps> = connector<OwnProps>(
  (state, ownProps) => {
    return {
      ...ownProps,
      editingFilepath: state.buffer.filepath
    }
  },
  actions => {
    return {
      loadFile: actions.editor.loadFile
    }
  }
)(function FileLineImpl(props: Props) {
  const { depth, filepath, editingFilepath } = props
  const basename = path.basename(filepath)
  return (
    <ContextMenuProvider id="file" data={{ filepath }}>
      <Container selected={editingFilepath === filepath}>
        <div onClick={() => props.loadFile({ filepath })}>
          {range(depth).map((_, k) => (
            <span key={k}>&nbsp;&nbsp;</span>
          ))}
          <Icon icon="document" />
          &nbsp;
          <Pathname ignoreGit={props.ignoreGit}>{basename}</Pathname>
        </div>
      </Container>
    </ContextMenuProvider>
  )
}) as any

const Container: React.ComponentType<{ selected: boolean }> = styled.div`
  cursor: pointer;
  user-select: none;
  padding-left: 2px;
  /* color: ${p => (p.selected ? "rgb(255, 128, 128)" : "black")}; */
  &:hover {
    background: black;
    color: white;
    color: ${p => (p.selected ? "rgb(200, 64, 64)" : "white")};
  }
`
Container.displayName = "FileLine:Container"
