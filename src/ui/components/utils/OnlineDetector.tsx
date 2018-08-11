import React from "react"
import { connector } from "../../actionCreators"

class OnlineDetectorImpl extends React.PureComponent<{
  networkOnline: boolean
  changeNetworkStatus: (payload: { online: boolean }) => void
}> {
  _onOnline: any = null
  _onOffline: any = null

  componentDidMount() {
    const { networkOnline, changeNetworkStatus } = this.props

    if (networkOnline !== navigator.onLine) {
      changeNetworkStatus({ online: navigator.onLine })
    }
    this._onOffline = () => changeNetworkStatus({ online: false })
    this._onOnline = () => changeNetworkStatus({ online: true })

    window.addEventListener("offline", this._onOffline)
    window.addEventListener("online", this._onOnline)
  }

  componentWillUnmount() {
    window.removeEventListener("offline", this._onOffline)
    window.removeEventListener("online", this._onOnline)
  }

  render() {
    return <></>
  }
}

export const OnlineDetector = connector(
  s => ({ networkOnline: s.app.networkOnline }),
  actions => ({
    changeNetworkStatus: actions.app.changeNetworkStatus
  })
)(function OnlineDetectorImpl_(props) {
  return (
    <OnlineDetectorImpl
      networkOnline={props.networkOnline}
      changeNetworkStatus={props.changeNetworkStatus}
    />
  )
})
