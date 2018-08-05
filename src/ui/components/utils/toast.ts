import { IToastProps, Position, Toaster } from "@blueprintjs/core"

export const AppToaster = Toaster.create({
  position: Position.RIGHT_BOTTOM as any
})

export const toast = (data: IToastProps) => AppToaster.show(data)
