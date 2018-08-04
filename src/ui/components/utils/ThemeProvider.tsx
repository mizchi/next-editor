import React from "react"
import { connect } from "react-redux"
import { ThemeProvider as StyledThemeProvider } from "styled-components"
import { RootState } from "../../reducers"
import DarkTheme from "../../themes/dark"
import DefaultTheme from "../../themes/default"

const ThemeMap: any = {
  default: DefaultTheme,
  dark: DarkTheme
}

export const ThemeProvider = connect((state: RootState) => ({
  theme: state.config.theme
}))(function ThemeProviderImpl({
  children,
  theme
}: {
  theme: string
  children: React.ReactNode
}) {
  return (
    <div
      className={theme === "dark" ? "bp3-dark" : "bp3-light"}
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "Inconsolata"
      }}
    >
      <StyledThemeProvider theme={ThemeMap[theme] || DefaultTheme}>
        {children}
      </StyledThemeProvider>
    </div>
  )
})
