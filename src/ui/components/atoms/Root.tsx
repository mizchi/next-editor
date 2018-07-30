import styled from "styled-components"

export const Root = styled.div`
  width: 100vw;
  height: 100vw;
  background: ${p => p.theme.main};
  color: ${p => p.theme.textColor};
  padding: 0;
  margin: 0;
`
Root.displayName = "Root"
