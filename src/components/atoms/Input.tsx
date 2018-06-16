import styled from "styled-components"

export const Input = styled.input.attrs(() => ({
  autocomplete: false
}))`
  border: 0;
  font-size: 1.3em;
  font-family: Arial, sans-serif;
  border: solid 1px #ccc;
  outline: none;
  box-shadow: inset 1px 4px 9px -6px rgba(0, 0, 0, 0.5);
`
