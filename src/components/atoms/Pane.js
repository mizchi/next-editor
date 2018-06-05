import styled from "styled-components"

export const Pane = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-right: ${props =>
    props.noBorder ? "none" : "1px solid rgba(0, 0, 0, 0.2)"};
  border-bottom: ${props =>
    props.noBorder ? "none" : "1px solid rgba(0, 0, 0, 0.2)"};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.backgroundColor || "transparent"};
`
