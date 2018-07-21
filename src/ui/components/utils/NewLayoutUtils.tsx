import React from "react"
import styled, { css } from "styled-components"

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

type PaddingProps =
  | { value: number }
  | { left: number; top: number; right: number; bottom: number }

export const Padding: React.ComponentType<PaddingProps> = styled.div`
  width: 100%;
  height: 100%;

  ${({ value, left, top, right, bottom }: any) => {
    if (value) {
      return css`
        padding: ${value}px;
      `
    } else {
      return css`
        padding-left: ${left}px;
        padding-top: ${top}px;
        padding-right: ${right}px;
        padding-bottom: ${bottom}px;
      `
    }
  }};
` as any

type BorderProps = {
  color?: string
  style?: number
  radius?: number
  width?: number
}
export const Boader: React.ComponentType<BorderProps> = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-width: ${(p: BorderProps) => p.width || 0}px;
  border-radius: ${(p: BorderProps) => p.radius || 0}px;
  border-style: ${(p: BorderProps) => p.style || "solid"};
  border-color: ${(p: BorderProps) => p.style || "black"};
` as any

export const Fixed: React.ComponentType<{
  width?: number | string
  height?: number | string
  overflow?: string
}> = styled.div`
  width: ${({ width }) =>
    typeof width === "number" ? `${width}px` : width || "100%"};
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height || "100%"};
  overflow: ${({ overflow }) => overflow || "auto"};
`

export const Grid: React.ComponentType<{
  columns: string[]
  areas: string[][]
  rows: string[]
  width?: string
  height?: string
}> = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => columns.join(" ")};
  grid-template-rows: ${({ rows }) => rows.join(" ")};
  grid-template-areas: ${({ areas }) =>
    areas.map(r => `'${r.join(" ")}'`).join(" ")};
  width: ${p => p.width || "100%"};
  height: ${p => p.height || "100%"};
`

export const GridArea: React.ComponentType<{
  name: string
  width?: string
  height?: string
}> = styled.div`
  grid-area: ${p => p.name};
  width: ${p => p.width || "100%"};
  height: ${p => p.height || "100%"};
`

type FlexProps = {
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

export const View = Flex

export const Row: React.ComponentType<FlexProps> = (Flex as any).extend`
  flex-direction: row;
`

export const Column: React.ComponentType<FlexProps> = (Flex as any).extend`
  flex-direction: column;
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

export const Root = styled.div`
  width: 100vw;
  height: 100vw;
  background: #eee;
  padding: 0;
  margin: 0;
`

export const Text: React.ComponentType<{
  children: string
  color?: string
  fontFamily?: string
}> = ({ children, color, fontFamily }) => {
  return (
    <Center>
      <span style={{ color, fontFamily }}>{children}</span>
    </Center>
  )
}

export const Button = styled.a`
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  background: #668ad8;
  color: #fff;

  &:hover {
    background: #4488a5;
  }
`
