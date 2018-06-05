import React from "react"

export class DataLoader<T> extends React.Component<
  { loader: () => Promise<T>, children: any },
  { loading: boolean, loaded: boolean, data: T | null, error: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = {
      data: null,
      error: false,
      loaded: false,
      loading: true
    }
  }

  async componentDidMount() {
    const { loader } = this.props
    const data = await loader()
    this.setState({ data, loaded: true, loading: false })
  }

  render() {
    const { loading, loaded, data } = this.state
    if (!loaded) {
      return <span>...</span>
    } else {
      return <this.props.children {...this.state} />
    }
  }
}
