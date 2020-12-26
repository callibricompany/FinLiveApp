import React from 'react'
import { Animated, Dimensions, Easing } from 'react-native'

class FadeInLeft extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      positionLeft: new Animated.Value(Dimensions.get('window').width)
    }
  }

  componentDidMount() {
    this.isAppearing();
  }

  isAppearing() {
    Animated.timing(
      this.state.positionLeft,
      {
        toValue: 0,
        duration : 1000,
        easing: Easing.elastic(),
        speed : 1,
        useNativeDriver: true,
      }
    ).start()
  }

  render() {
    return (
      <Animated.View {...this.props}
        style={{ left: this.state.positionLeft , width : 200, height: 200, backgroundColor: this.props.style.backgroundColor}}>
        {this.props.children}
      </Animated.View>
    )
  }
}

export default FadeInLeft