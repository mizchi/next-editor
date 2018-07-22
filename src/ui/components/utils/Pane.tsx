import styled from "styled-components"

export const Pane: React.ComponentType<{
  background?: string
}> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${p => p.background || "transparend"};
`

export const Content: React.ComponentType<{}> = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`
