import React, {Component} from 'react';


import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Image,
  Alert,
  View,
  Dimensions
} from 'react-native';
//import {Actions, ActionConst} from 'react-native-router-flux';

import spinner from '../../assets/loading.gif';

import { getConstant } from '../../Utils';



//const MARGIN = 0.2*getConstant('width');
const MARGIN = 40;

export default class ButtonSubmit extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
    };

    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
  }

  _onPress() {
      if (this.state.isLoading) return;
      if (!this.props.onCheckEmail()) {
          //Alert.alert('VERIFIER VOTRE EMAIL', 'Adresse mail non valide');
          return;
      } 

      this.setState({isLoading: true});
      Animated.timing(this.buttonAnimated, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
      }).start();

      //setTimeout(() => {
      //  this._onGrow();
      //}, 2000);

      setTimeout(() => {
          
          result = this.props.onPress();
          console.log("RETOUR BUTTON : " + result)
          if (result === false){
            this.buttonAnimated.setValue(0);
            this.growAnimated.setValue(0);
            //this.setState({isLoading: false});
          }
          else {
            this.setState({isLoading: false});
          }
        //Actions.secondScreen();
      // this.setState({isLoading: false});

      }, 2000);
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start();
  }

  render() {
    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9*getConstant('width') , MARGIN],
    });
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });

    return (
      <View style={styles.container}>
        <Animated.View style={{width: changeWidth}}>
          <TouchableOpacity
            style={styles.button}
            onPress={this._onPress}
            activeOpacity={1}>
            {this.state.isLoading ? (
              <Image source={spinner} style={styles.image} />
            ) : (
              <Text style={styles.text}>{this.props.text}</Text>
            )}
          </TouchableOpacity>
          <Animated.View
            style={[styles.circle, {transform: [{scale: changeScale}]}]}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  //  top: -95,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9A9A9A',
    height: MARGIN,
    borderRadius: 2,
    zIndex: 100,
  },
  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: '#9A9A9A',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: '#9A9A9A',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#9A9A9A',
  },
  image: {
    width: 24,
    height: 24,
  },
});