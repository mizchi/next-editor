export type EditorInterface = {
  fontScale: number
  fontFamily: string
  spellCheck: boolean
  initialValue: string
  theme: string
  onChange: (value: string) => void
  options?: any
}
