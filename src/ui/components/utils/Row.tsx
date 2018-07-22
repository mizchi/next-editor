import React from "react"
import styled from "styled-components"
import { Flex, FlexItem, FlexProps } from "./Flex"

export const Row: React.ComponentType<FlexProps> = (Flex as any).extend`
  flex-direction: row;
`

export const ScrollableRow: React.ComponentType<FlexProps> = (Flex as any)
  .extend`
  flex-direction: row;
  overflow-y: auto;
`

export const RowItem = (FlexItem as any).extend`
  width: 100%;
  height: auto;
`

export const RowFixedItem: React.ComponentType<{
  height: string
}> = (FlexItem as any).extend`
  width: 100%;
  height: {p => p.height};
`
