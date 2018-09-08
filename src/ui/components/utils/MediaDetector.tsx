import React from "react"
import { connector } from "../../actionCreators"

export const MediaDetector = connector(
  state => {
    return {
      isMobile: state.app.isMobile
    }
  },
  actions => {
    return {
      setIsMobile: actions.app.setIsMobile
    }
  }
)(props => (
  <MediaDetectorImpl
    isMobile={props.isMobile}
    onChangeIsMobile={isMobile => {
      if (props.isMobile !== isMobile) {
        props.setIsMobile({ isMobile })
        setOverflow(isMobile)
      }
    }}
  />
))

class MediaDetectorImpl extends React.Component<{
  isMobile: boolean
  onChangeIsMobile: (next: boolean) => void
}> {
  _f: any

  _update() {
    const w = window.innerWidth
    // this.props.onChangeIsMobile(w < 768)
  }

  componentDidMount() {
    this._update()
    this._f = this._update.bind(this)
    window.addEventListener("resize", this._f)

    const w = window.innerWidth
    setOverflow(w < 768)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._f)
  }
  render() {
    return <></>
  }
}

function setOverflow(isMobile: boolean) {
  const html: any = document.querySelector("html")
  if (isMobile) {
    document.body.style.overflow = "visible"
    html.style.overflow = "visible"
  } else {
    document.body.style.overflow = "hidden"
    html.style.overflow = "hidden"
  }
}
