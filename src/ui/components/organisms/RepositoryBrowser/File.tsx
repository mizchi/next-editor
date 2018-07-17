import range from "lodash/range"
import path from "path"
import React from "react"
import { ContextMenuProvider } from "react-contexify"
import FaFile from "react-icons/fa/file"
import styled from "styled-components"
import { connector } from "../../../actions"

type OwnProps = {
  depth: number
  filepath: string
  ignoreGit?: boolean
}

type Props = OwnProps & {
  loadFile: any
  editingFilepath: string
}

export const File: React.ComponentType<OwnProps> = connector<OwnProps>(
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
)((props: Props) => {
  const { depth, filepath, editingFilepath } = props
  const basename = path.basename(filepath)
  return (
    <Container selected={editingFilepath === filepath}>
      <ContextMenuProvider id="file" data={{ filepath }}>
        <div onClick={() => props.loadFile({ filepath })}>
          {range(depth).map((_, k) => <span key={k}>&nbsp;&nbsp;</span>)}
          <FaFile />
          &nbsp;
          <span>{basename}</span>
        </div>
      </ContextMenuProvider>
    </Container>
  )
}) as any

const Container: React.ComponentType<{ selected: boolean }> = styled.div`
  cursor: pointer;
  user-select: none;
  padding-left: 2px;
  color: ${p => (p.selected ? "rgb(255, 128, 128)" : "black")};
  &:hover {
    background: black;
    color: white;
    color: ${p => (p.selected ? "rgb(200, 64, 64)" : "white")};
  }
`
