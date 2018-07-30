import React from "react"
import styled, { css } from "styled-components"

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
Grid.displayName = "Grid"

export const GridRow: React.ComponentType<{
  areas: string[]
  rows: string[]
  width?: string
  height?: string
}> = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: ${({ rows }) => rows.join(" ")};
  grid-template-areas: ${({ areas }) =>
    areas.map(area => `'${area}'`).join(" ")};
  width: ${p => p.width || "100%"};
  height: ${p => p.height || "100%"};
`
GridRow.displayName = "GridRow"

export const GridColumn: React.ComponentType<{
  columns: string[]
  areas: string[]
  width?: string
  height?: string
}> = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => columns.join(" ")};
  grid-template-rows: 1fr;
  grid-template-areas: ${({ areas }) => `'${areas.join(" ")}'`};
  width: ${p => p.width || "100%"};
  height: ${p => p.height || "100%"};
`
GridColumn.displayName = "GridColumn"

type OverflowRules = "hidden" | "auto" | "visible" | "scroll"

export const GridArea: React.ComponentType<{
  name: string
  overflowX?: OverflowRules
  overflowY?: OverflowRules
  children: React.ReactNode
}> = p => {
  return (
    <div
      style={{
        gridArea: p.name,
        position: "relative",
        width: "100%",
        height: "100%",
        overflowX: p.overflowX || "auto",
        overflowY: p.overflowY || "auto"
      }}
    >
      <div style={{ position: "absolute", width: "100%", height: "100%" }}>
        {p.children}
      </div>
    </div>
  )
}
GridArea.displayName = "GridArea"
