import React from 'react'
import { TouchableOpacity, SafeAreaView ,Animated, StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  PanGestureHandler,
  NativeViewGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';

import { ifIphoneX, ifAndroid, sizeByDevice, isIphoneX, getConstant } from '../../Utils';

import { globalStyle , setFont, setColor } from '../../Styles/globalStyle'

import logo from '../../assets/LogoWithoutText.png';
import logo_gray from '../../assets/LogoWithoutTex_gray.png';



const HEADER_HEIGHT = 20;
//export const SNAP_POINTS_FROM_TOP = [30, getConstant('height') * 0.3, sizeByDevice(getConstant('height') -260 , getConstant('height') - 200 , getConstant('height') - 215) ];
export const SNAP_POINTS_FROM_TOP = [isIphoneX() ? 80 : 50, getConstant('height') * 0.4, getConstant('height') - 10 ];

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

    UNSAFE_componentWillReceiveProps (props) {
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
          //console.log(distFromSnap + " : " + snapPoint + " : " +endOffsetY);
          if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
            destSnapPoint = snapPoint;
          }
        }
        //console.log("DESTINATION SNAP : " + destSnapPoint);
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
        <View style={[StyleSheet.absoluteFillObject, {zIndex: 99,}]} 
        pointerEvents={'box-none'}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateY: this._translateY }],
                opacity: 1
              },
            ]}>
            <PanGestureHandler
              ref={this.drawerheader}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHeaderHandlerStateChange}>
              <Animated.View style={styles.header} >
               <View style={{width: getConstant('width')/3, height : HEADER_HEIGHT/5, backgroundColor: setColor(''), borderRadius: 5}}><Text></Text></View>
              </Animated.View>
            </PanGestureHandler>
            <PanGestureHandler
              ref={this.drawer}
              simultaneousHandlers={[this.scroll, this.masterdrawer]}
              shouldCancelWhenOutside={false}
              minDeltaY={100}
              onGestureEvent={this._onGestureEvent}
              onHandlerStateChange={this._onHandlerStateChange}>
              <Animated.View style={[styles.container, {backgroundColor : this.props.isActivated ? 'white' : 'white'}]} clickable={this.props.isActivated}>
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
                    useNativeDriver={true}
                    onScrollBeginDrag={this._onRegisterLastScroll}
                    scrollEventThrottle={1}>
  
                        <View style={{flex:0.1 , flexDirection: 'row', justifyContent: 'space-evenly',alignItems: 'flex-start', borderWidth: 0}}>
                            {!this.props.isMandatory  ?
                                  <TouchableOpacity style ={{ height: 80, width: 80, flexDirection: 'column',  borderWidth : 1, borderColor: this.props.isActivated ? setColor('gray') : setColor('subscribeBlue'), borderRadius: 40,  backgroundColor: this.props.isActivated ? 'lightgray' : 'white'}}
                                                    onPress={() => {
                                                      this.props.activateParameter(!this.props.isActivated);
                                                    }}  
                                  >
                              
                                      <View style={{marginTop: 5, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image style={{width: 50, height: 50}} source={this.props.isActivated ? logo_gray : logo} blurRadius={0}/>
                                      </View>
                                      
                                      <View style={{marginTop: 2, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={setFont('400', isIphoneX() ? 10 : 12, this.props.isActivated ? 'gray' : setColor(''), 'Regular')}>{String('auto').toUpperCase()}</Text>
                                      </View>
                                  </TouchableOpacity>
                                :  <View style ={{ flex: 0.2}}></View>
                            }
                            <View style={{flex : 0.6, justifyContent: 'center', alignItems: 'center', borderWidth: 0}}>
                                  <Text style={[setFont('600', 20), {textAlign: 'center'}]}>
                                     {this.props.renderTitle}
                                  </Text>
                            </View>
                            <TouchableOpacity  style={{flex : 0.2, justifyContent: 'flex-start',alignItems: 'center', borderWidth: 0, paddingTop: 10, paddingBottom: 10}}
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
                                  <Ionicons name="md-close"  style={{color : setColor('')}} size={40}/>
                            </TouchableOpacity>
                        </View>

                        {this.props.isActivated 
                          ? this.props.renderFLBottomPanel 
                          : 
                          <View style={{flex : 1, marginLeft : 0.1*getConstant('width'), width : getConstant('width')*0.8,  justifyContent : 'center', alignItems : 'center', marginTop : 15}}>
                              <Text style={[setFont('300', 14, 'black', 'Regular'), {textAlign : 'center'}]}>Cette caractéristique sera automatiquement calculée et optimisée par le moteur FinLive</Text>
                          </View>}
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
    backgroundColor : 'white',
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    justifyContent : 'center',
    alignItems : 'center',
    borderTopRightRadius : 10,
    borderTopLeftRadius : 10,
  },
});



//export default HomeScreen;
export default FLBottomPanel;
