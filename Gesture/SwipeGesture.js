import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder
} from 'react-native';


export default class SwipeGesture extends Component {

  UNSAFE_componentWillMount = () => {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        let x = gestureState.dx;
        let y = gestureState.dy;
   //     console.log(evt);
        if ((Math.abs(x) < 10) && Math.abs(y) < 10) {
          this.props.onSwipePerformed('tap');
          return;
        }
        if (Math.abs(x) > Math.abs(y)) {
          if (x >= 0) {
            this.props.onSwipePerformed('right')
          }
          else {
            this.props.onSwipePerformed('left')
          }
        }
        else {
          if (y >= 0) {
            this.props.onSwipePerformed('down')
          }
          else {
            this.props.onSwipePerformed('up')
          }
        }
      }
    })
  }

  render() {
    return (
      <Animated.View {...this.PanResponder.panHandlers} {...this.props}  >
        {this.props.children}
      </Animated.View>
    )
  }
}
