import styled from "styled-components"

export const Pathname: React.ComponentType<{
  ignoreGit: boolean
}> = styled.span`
  color: ${p => (p.ignoreGit ? "#aaa" : "inherit")};
`
