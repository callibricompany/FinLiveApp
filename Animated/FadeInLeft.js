import React from 'react'
import { Animated, Dimensions } from 'react-native'

class FadeInLeft extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      positionLeft: new Animated.Value(Dimensions.get('window').width)
    }
  }

  componentDidMount() {
    Animated.spring(
      this.state.positionLeft,
      {
        toValue: 0,
        duration : 3000,
        speed : 5
      }
    ).start()
  }

  render() {
    return (
      <Animated.View
        style={{ left: this.state.positionLeft }}>
        {this.props.children}
      </Animated.View>
    )
  }
}

export default FadeInLeft