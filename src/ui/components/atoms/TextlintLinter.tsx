import React from "react"

type LinterProps = {
  source: string
  filename: string
  filetype: "text" | "markdown"
}

type LinterState = {
  results: Array<{
    line: number
    column: number
    message: string
  }>
  loading: boolean
}

export class TextlintLinter extends React.Component<LinterProps, LinterState> {
  state = {
    results: [],
    loading: true
  }

  _linter: any

  async _update() {
    if (this._linter == null) {
      const {
        runTextlint
      } = await import(/* webpackChunkName: "textlint" */ "../../../lib/runTextlint")
      this._linter = runTextlint
    }

    const options = {
      filePath: "/path/to/file.md",
      ext: ".md",
      plugins: [
        {
          pluginId: "markdown",
          plugin: require("@textlint/textlint-plugin-markdown")
        }
      ],
      rules: [
        {
          ruleId: "no-todo",
          rule: require("textlint-rule-no-todo")
        }
      ]
    }
    const result = await this._linter(this.props.source, options)

    this.setState(s => ({
      ...s,
      results: result.messages,
      loading: false
    }))
  }
  componentDidMount() {
    this._update()
  }

  componentDidUpdate(prevProps: LinterProps, prevState: LinterState) {
    if (prevProps.source !== this.props.source) {
      this._update()
    }
  }

  render() {
    return (
      <div>
        <h2>Results</h2>
        {this.state.results.length === 0 && <p>No Error</p>}
        {this.state.results.map(
          (
            message: { line: number; column: number; message: string },
            index
          ) => {
            return (
              <p key={index}>
                <span>
                  {message.line}:{message.column}
                </span>
                &nbsp;
                <code>{message.message}</code>
              </p>
            )
          }
        )}
      </div>
    )
  }
}
