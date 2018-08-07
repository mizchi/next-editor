import { Button, Card, Classes, Overlay } from "@blueprintjs/core"
import React from "react"

export class ButtonWithModal extends React.Component<
  {
    text: string
    icon: any
    disabled?: boolean
    renderModal: (props: { onClose: any }) => React.ReactNode
    onClick?: (event: any) => void
  },
  { opened: boolean }
> {
  state = {
    opened: false
  }
  render() {
    const { renderModal, onClick, ...otherProps } = this.props
    const onClose = () => this.setState({ opened: false })
    return (
      <>
        <Button
          {...otherProps}
          onClick={(ev: any) => {
            this.setState({ opened: true })
            onClick && onClick(ev)
          }}
        />
        <Overlay
          isOpen={this.state.opened}
          onClose={onClose}
          className={Classes.OVERLAY_SCROLL_CONTAINER}
        >
          <Card
            elevation={Classes.ELEVATION_4 as any}
            style={{
              width: "50%",
              height: "50%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            {this.props.renderModal({ onClose })}
          </Card>
        </Overlay>
      </>
    )
  }
}
