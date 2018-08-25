import React from "react"
import styled, { css } from "styled-components"

type GridType = {
  columns: string[]
  areas: string[][]
  rows: string[]
  width?: string
  height?: string
}
export const Grid: React.ComponentType<GridType> = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }: GridType) => columns.join(" ")};
  grid-template-rows: ${({ rows }: GridType) => rows.join(" ")};
  grid-template-areas: ${({ areas }) =>
    areas.map(r => `'${r.join(" ")}'`).join(" ")};
  width: ${p => p.width || "100%"};
  height: ${p => p.height || "100%"};
`
Grid.displayName = "Grid"

type GridRowType = {
  areas: string[]
  rows: string[]
  width?: string
  height?: string
}
export const GridRow: React.ComponentType<GridRowType> = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: ${({ rows }: GridRowType) => rows.join(" ")};
  grid-template-areas: ${({ areas }: GridRowType) =>
    areas.map(area => `'${area}'`).join(" ")};
  width: ${p => p.width || "100%"};
  height: ${p => p.height || "100%"};
`
GridRow.displayName = "GridRow"

type GridColumnType = {
  columns: string[]
  areas: string[]
  width?: string
  height?: string
}
export const GridColumn: React.ComponentType<GridColumnType> = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }: GridColumnType) => columns.join(" ")};
  grid-template-rows: 1fr;
  grid-template-areas: ${({ areas }: GridColumnType) => `'${areas.join(" ")}'`};
  width: ${p => p.width || "100%"};
  height: ${p => p.height || "100%"};
`
GridColumn.displayName = "GridColumn"

type OverflowRules = "hidden" | "auto" | "visible" | "scroll"

export const GridArea: React.ComponentType<{
  name: string
  absolute?: boolean
  overflowX?: OverflowRules
  overflowY?: OverflowRules
  children: React.ReactNode
}> = p => {
  return p.absolute ? (
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
  ) : (
    <div
      style={{
        gridArea: p.name,
        width: "100%",
        height: "100%"
      }}
    >
      {p.children}
    </div>
  )
}
GridArea.displayName = "GridArea"
