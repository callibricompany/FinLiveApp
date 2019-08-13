import React from 'react'
import { SafeAreaView ,Animated, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Title, Icon, Button } from 'native-base'
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';


import { globalStyle } from '../../Styles/globalStyle'
  
import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withFirebase } from '../../Database';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';



const HEADER_HEIGHT = 20;
const windowHeight = Dimensions.get('window').height;
const SNAP_POINTS_FROM_TOP = [50, windowHeight * 0.4, windowHeight * 0.85];

class BroadcastingScreen extends React.Component {
 
  masterdrawer = React.createRef();
  drawer = React.createRef();
  drawerheader = React.createRef();
  scroll = React.createRef();
  constructor(props) {
    super(props);
    const START = SNAP_POINTS_FROM_TOP[0];
    const END = SNAP_POINTS_FROM_TOP[SNAP_POINTS_FROM_TOP.length - 1];

    this.state = {
      lastSnap: END,
    };

    this._lastScrollYValue = 0;
    this._lastScrollY = new Animated.Value(0);
    this._onRegisterLastScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: this._lastScrollY } } }],
      { useNativeDriver: true }
    );
    this._lastScrollY.addListener(({ value }) => {
      this._lastScrollYValue = value;
    });

    this._dragY = new Animated.Value(0);
    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this._dragY } }],
      { useNativeDriver: true }
    );

    this._reverseLastScrollY = Animated.multiply(
      new Animated.Value(-1),
      this._lastScrollY
    );

    this._translateYOffset = new Animated.Value(END);
    this._translateY = Animated.add(
      this._translateYOffset,
      Animated.add(this._dragY, this._reverseLastScrollY)
    ).interpolate({
      inputRange: [START, END],
      outputRange: [START, END],
      extrapolate: 'clamp',
    });
  }
  _onHeaderHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.BEGAN) {
      this._lastScrollY.setValue(0);
    }
    this._onHandlerStateChange({ nativeEvent });
  };
  _onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let { velocityY, translationY } = nativeEvent;
      translationY -= this._lastScrollYValue;
      const dragToss = 0.05;
      const endOffsetY =
        this.state.lastSnap + translationY + dragToss * velocityY;

      let destSnapPoint = SNAP_POINTS_FROM_TOP[0];
      for (let i = 0; i < SNAP_POINTS_FROM_TOP.length; i++) {
        const snapPoint = SNAP_POINTS_FROM_TOP[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetY);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
          destSnapPoint = snapPoint;
        }
      }
      this.setState({ lastSnap: destSnapPoint });
      this._translateYOffset.extractOffset();
      this._translateYOffset.setValue(translationY);
      this._translateYOffset.flattenOffset();
      this._dragY.setValue(0);
      Animated.spring(this._translateYOffset, {
        velocity: velocityY,
        tension: 68,
        friction: 12,
        toValue: destSnapPoint,
        useNativeDriver: true,
      }).start();
    }
  };

  static navigationOptions = {
    header: null
  } 



    render() {
      return(
        <View style={styles.main_container}>
          <Text style={{fontSize: 30}}>Bonjour</Text>
          <Button onPress={() => {
                  Animated.spring(this._translateYOffset, {
                    //velocity: velocityY,
                    tension: 68,
                    friction: 12,
                    toValue: SNAP_POINTS_FROM_TOP[1],
                    useNativeDriver: true,
                  }).start();
            this.setState({lastSnap : SNAP_POINTS_FROM_TOP[1]})
          }
          }>
            <Text>GGGGGGGGGG</Text>
          </Button>
        <TapGestureHandler
        maxDurationMs={100000}
        ref={this.masterdrawer}
        maxDeltaY={this.state.lastSnap - SNAP_POINTS_FROM_TOP[0]}>
        <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateY: this._translateY }],
              },
            ]}>
            <PanGestureHandler
              ref={this.drawerheader}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHeaderHandlerStateChange}>
              <Animated.View style={styles.header} />
            </PanGestureHandler>
            <PanGestureHandler
              ref={this.drawer}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHandlerStateChange}>
              <Animated.View style={styles.container}>
                <NativeViewGestureHandler
                  ref={this.scroll}
                  waitFor={this.masterdrawer}
                  simultaneousHandlers={this.drawer}>
                  <Animated.ScrollView
                    style={[
                      styles.scrollView,
                      { marginBottom: SNAP_POINTS_FROM_TOP[0] },
                    ]}
                    bounces={false}
                    onScrollBeginDrag={this._onRegisterLastScroll}
                    scrollEventThrottle={1}>
                    <View>
                      <Text>GGGGGGGGGG</Text>
                      
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                      <Text>GGGGGGGGGG</Text>
                    </View>
                  </Animated.ScrollView>
                </NativeViewGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </View>
      </TapGestureHandler>
        </View>
      );
      }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    
    paddingTop : 200,
    paddingLeft : 40
  },
  container: {
    backgroundColor : 'lightgray',
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: 'red',
  },
});


const condition = authUser => !!authUser;
const composedPricerScreen = compose(
 withAuthorization(condition),
  withFirebase,
  withUser,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(BroadcastingScreen);
