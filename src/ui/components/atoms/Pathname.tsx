import styled from "styled-components"

export const Pathname: React.ComponentType<{
  ignoreGit: boolean
}> = styled.span`
  color: ${(p: { ignoreGit: boolean }) => (p.ignoreGit ? "#aaa" : "inherit")};
`

Pathname.displayName = "Pathname"
