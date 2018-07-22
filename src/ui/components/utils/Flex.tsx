import styled from "styled-components"

export type FlexProps = {
  wrap?: boolean
  inline?: boolean
  direction?: "row" | "column"
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-arround"
  alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline"
  width?: string
  height?: string
  style?: any
}

export const Flex: React.ComponentType<FlexProps> = styled.div`
  display: ${p =>
    p.inline == null ? "flex" : p.inline ? "inline-flex" : "flex"};
  justify-content: ${p => p.justifyContent || "flex-start"};
  align-items: ${p => p.alignItems || "flex-start"};
  flex-direction: ${p => p.direction || "row"};
  width: ${p => p.width || "100%"};
  height: ${p => p.height || "100%"};
  flex-wrap: ${p => (p.wrap == null ? "wrap" : p.wrap ? "wrap" : "nowrap")};
  width: 100%;
  height: 100%;
`

export const FlexItem: React.ComponentType<{
  grow?: number
  shrink?: number
  order?: number
  width?: string
  height?: string
  style?: any
}> = styled.div`
  flex-grow: ${p => p.grow || 0};
  flex-shrink: ${p => p.shrink || 0};
  order: ${p => p.order || 0};
  width: ${p => p.width || "auto"};
  height: ${p => p.height || "auto"};
`
