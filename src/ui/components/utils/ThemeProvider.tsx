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
}))(({ children, theme }: any) => {
  return (
    <StyledThemeProvider theme={ThemeMap[theme] || DefaultTheme}>
      {children}
    </StyledThemeProvider>
  )
})
