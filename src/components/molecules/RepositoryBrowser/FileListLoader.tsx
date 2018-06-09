import React from "react"
import { connect } from "react-redux"
import { FileInfo, readFileStats } from "../../../lib/repository"
import { RootState } from "../../../reducers"

type OwnProps = {
  aPath: string
  children: any
}

type ConnectedProps = {
  lastChangedPath: string
  touchCounter: number
}

type Props = OwnProps & ConnectedProps

type State = {
  loading: boolean
  loaded: boolean
  data: { fileList: FileInfo[] } | null
  error: Error | null
}

export const FileListLoader = connect(
  (state: RootState, ownProps: OwnProps): Props => {
    return {
      ...ownProps,
      lastChangedPath: state.repository.lastChangedPath,
      touchCounter: state.repository.touchCounter
    }
  }
)(
  class DataLoader<T> extends React.Component<Props, State> {
    constructor(props: any) {
      super(props)
      this.state = {
        data: null,
        error: null,
        loaded: false,
        loading: true
      }
    }

    async componentDidMount() {
      try {
        const fileList = await readFileStats(this.props.aPath)
        this.setState({ data: { fileList }, loaded: true, loading: false })
      } catch (error) {
        this.setState({ loaded: true, loading: false, error })
      }
    }

    async componentDidUpdate(prevProps: Props) {
      const { aPath, lastChangedPath, touchCounter } = this.props
      if (
        prevProps.touchCounter !== touchCounter &&
        lastChangedPath === aPath
      ) {
        await new Promise(resolve => {
          this.setState({ loaded: false, loading: true }, resolve)
        })
        try {
          const fileList = await readFileStats(aPath)
          this.setState({ data: { fileList }, loaded: true, loading: false })
        } catch (error) {
          this.setState({ loaded: true, loading: false, error, data: null })
        }
      }
    }

    render() {
      const { loading, loaded, data } = this.state
      return <this.props.children {...this.state} />
    }
  }
)
