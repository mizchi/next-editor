import styled from "styled-components"

type PaneType = {
  background?: string
}
export const Pane: React.ComponentType<PaneType> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${(p: PaneType) => p.background || "transparend"};
`

export const Content: React.ComponentType<{}> = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`
