import { Icon, Position, Tooltip } from "@blueprintjs/core"
import React from "react"

export function NavigatorTitle(props: { networkOnline: boolean }) {
  return (
    <>
      Next Editor &nbsp;
      <Tooltip
        content={props.networkOnline ? "online mode" : "offline mode"}
        lazy={false}
        position={Position.BOTTOM}
      >
        <Icon
          icon="offline"
          iconSize={16}
          style={{
            paddingTop: 3,
            color: props.networkOnline ? "#9f9" : "#f99"
          }}
        />
      </Tooltip>
    </>
  )
}
