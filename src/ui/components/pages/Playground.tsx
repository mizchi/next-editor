import { Button, Menu, MenuItem, Popover, Position } from "@blueprintjs/core"
import * as React from "react"
import { Root } from "../atoms/Root"

export function Playground() {
  return (
    <Root className="bp3-dark">
      <div style={{ width: 500 }}>
        <Popover
          content={
            <Menu>
              <MenuItem text="Submenu">
                <MenuItem text="Child one" />
                <MenuItem text="Child two" />
                <MenuItem text="Child three" />
              </MenuItem>
            </Menu>
          }
          position={Position.RIGHT_TOP}
        >
          <Button icon="share" text="Open in..." />
        </Popover>
      </div>
    </Root>
  )
}
