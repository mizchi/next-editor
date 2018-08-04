import React from "react"
import RichTextEditor from "react-rte"

export class WysiwygEditor extends React.Component<
  {
    onChange: (value: string) => void
    initialValue?: string | null
  },
  {
    value: any
  }
> {
  toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      "LINK_BUTTONS",
      "BLOCK_TYPE_DROPDOWN"
      // "HISTORY_BUTTONS"
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" }
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "--", style: "unstyled" },
      { label: "H1", style: "header-one" },
      { label: "H2", style: "header-two" },
      { label: "H3", style: "header-three" }
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" }
    ]
  }

  constructor(props: any) {
    super(props)
    this.state = {
      value: RichTextEditor.createValueFromString(
        props.initialValue || "",
        "markdown"
      )
    }
  }

  render() {
    return (
      <RichTextEditor
        spellCheck={false}
        toolbarConfig={this.toolbarConfig}
        value={this.state.value}
        onChange={(value: any) => {
          this.setState({ value })
          this.props.onChange(value.toString("markdown"))
        }}
        rootStyle={{
          height: "99%",
          overflow: "auto",
          backgroundColor: "rgb(252, 252, 252)",
          color: "#111"
        }}
      />
    )
  }
}
