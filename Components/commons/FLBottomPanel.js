import React from 'react'
import { TouchableOpacity, SafeAreaView ,Animated, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import { globalStyle, backgdColor, blueFLColor, backgdColorPricerParameter } from '../../Styles/globalStyle'






const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;



const HEADER_HEIGHT = 20;
//export const SNAP_POINTS_FROM_TOP = [30, DEVICE_HEIGHT * 0.3, sizeByDevice(DEVICE_HEIGHT -260 , DEVICE_HEIGHT - 200 , DEVICE_HEIGHT - 215) ];
export const SNAP_POINTS_FROM_TOP = [30, DEVICE_HEIGHT * 0.3, DEVICE_HEIGHT - 10 ];

class FLBottomPanel extends React.Component {
 
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

    componentWillReceiveProps (props) {
      //console.log("RECOIT LES PROPS : " + props.position);
      Animated.spring(this._translateYOffset, {
        //velocity: velocityY,
        tension: 68,
        friction: 12,
        toValue: props.position,
        useNativeDriver: true,
      }).start();
      this.setState({ lastSnap : props.position });
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
        this.setState({ lastSnap: destSnapPoint }, () => this.props.snapChange(destSnapPoint));

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



    render() {
      return(
        <TapGestureHandler
        maxDurationMs={100000}
        ref={this.masterdrawer}
        maxDeltaY={this.state.lastSnap - SNAP_POINTS_FROM_TOP[0]}>
        <View style={[StyleSheet.absoluteFillObject, {zIndex: 99, }]} pointerEvents="box-none">
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
              <Animated.View style={styles.header} >
               <View style={{width: DEVICE_WIDTH/3, height : HEADER_HEIGHT/5, backgroundColor: blueFLColor, borderRadius: 5}}><Text></Text></View>
              </Animated.View>
            </PanGestureHandler>
            <PanGestureHandler
              ref={this.drawer}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHandlerStateChange}>
              <Animated.View style={[styles.container, {backgroundColor : this.props.isActivated ? backgdColorPricerParameter : backgdColorPricerParameter}]} clickable={this.props.isActivated}>
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
  
                        <View style={{flex:0.1 , flexDirection: 'row',justifyContent: 'center',alignItems: 'flex-start', borderWidth: 0}}>
                            <TouchableOpacity  style={{flex : 0.15, justifyContent: 'center',alignItems: 'flex-end', borderWidth: 0, paddingTop : 10}}
                                onPress={() => {
                                  this.props.activateParameter(!this.props.isActivated);
                              }}>
                              <FontAwesome name={this.props.isActivated ? "toggle-on" :  "toggle-off"}  size={30} style={{color : "#85B3D3"}}/> 
                            </TouchableOpacity>
                            <View style={{flex : 0.7, justifyContent: 'center', alignItems: 'center', borderWidth: 0}}>
                                  <Text style={{fontSize: 20, fontWeight: '600', fontFamily : 'FLFontFamily', textAlign: 'center'}}>
                                      {this.props.renderTitle}
                                  </Text>
                            </View>
                            <TouchableOpacity  style={{flex : 0.15, justifyContent: 'flex-start',alignItems: 'center', borderWidth: 0, paddingTop: 10, paddingBottom: 10}}
                                onPress={() => {
                                       Animated.spring(this._translateYOffset, {
                                        //velocity: velocityY,
                                        tension: 68,
                                        friction: 12,
                                        toValue: SNAP_POINTS_FROM_TOP[2],
                                        useNativeDriver: true,
                                      }).start();
                                      this.setState({ lastSnap : SNAP_POINTS_FROM_TOP[2] }, () => this.props.snapChange(this.state.lastSnap))
                                    }}>
                                  <Icon name="md-close"  style={{color : "#85B3D3"}}/>
                              </TouchableOpacity>
                        </View>

                        {this.props.isActivated ? this.props.renderFLBottomPanel : null}
                  </Animated.ScrollView>
                </NativeViewGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </View>
      </TapGestureHandler>
      );
      }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor : backgdColorPricerParameter,
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: backgdColorPricerParameter,
    justifyContent : 'center',
    alignItems : 'center',
    borderTopRightRadius : 10,
    borderTopLeftRadius : 10,
  },
});



//export default HomeScreen;
export default FLBottomPanel;
