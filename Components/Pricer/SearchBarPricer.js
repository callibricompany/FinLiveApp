import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Button } from 'native-base'
import { ifIphoneX, ifAndroid } from '../../Utils';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Text,
  Platform,
  Modal,
  Dimensions,
  SectionList
} from 'react-native';

import {  globalSyle, 
          generalFontColor, 
          tabBackgroundColor,
          headerTabColor,
          selectElementTab,
          FLFontFamily
} from '../../Styles/globalStyle';




const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class SearchBarPricer extends Component {

  constructor(props) {
    super(props);
 
    this.state = {

    }

    
  }


  blurInputs(stateBar) {
    if (this.inputSearch !== null && this.inputSearch !== undefined) {
      //console.log("BLUR BLUR BLUR : "+ stateBar);
      //console.log("BLUR BLUR BLUR : "+ this.inputSearch);
    }
    //this.inputSearch.blur();
    //this.inputLocation.blur();
   // this.props.changeInputFocus(false);
  }

  render() {
    const { animation, changeInputFocus, renderTabBar } = this.props;

    const transformWrapper = animation.getTransformWrapper();
    const transformSearchBar = animation.getTransformSearchBar(this.blurInputs, animation.stateBar);
    const opacitySearchBar = animation.getOpacitySearchBar();
    const opacityLocationInput = animation.getOpacityLocationInput();
    const arrowMinimizeStyle = animation.getArrowMinimizeStyle();
  
   
    
    return (
      <Animated.View style={[styles.wrapper, transformWrapper]}>
       <Animated.View style={opacitySearchBar}>
          <View style={styles.searchContainer}>
            <Animated.View style={[transformSearchBar]}>
               <View style={[styles.searchInput,  { flexDirection:'row' , borderWidth: 0, borderColor: tabBackgroundColor}]}>     
                  <Text>TOTO</Text>
              </View>
            </Animated.View>

          </View>
        </Animated.View>
        {renderTabBar()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    //backgroundColor: '#fff',
  },
  searchContainer: {
    zIndex: 99,
    backgroundColor: tabBackgroundColor,
    width: '100%',
    overflow: 'hidden',
    paddingBottom: 10,
    ...ifIphoneX({
      paddingTop: 12
    }, {
      paddingTop: 28
    }),
  },
  arrowMinimizeContainer: {
    position: 'relative',
    top: -3
  },
  arrowMinimizeIcon: {
    marginLeft: 12,
  },
  searchInput: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: 3,
    height: 45,
    marginTop: 3,
    width: DEVICE_WIDTH*0.925,
    marginRight : -1,
    marginLeft : Platform.OS === 'ios' ? 0 : -1,
    alignSelf: 'center'
   //marginLeft: DEVICE_WIDTH*0.0375,
   // marginRight:  DEVICE_WIDTH*0.0375,
  },
  locationInput: {
    marginTop: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 13,
    top: 12,
  },
  inputText: {
    display: 'flex',
    ...ifAndroid({
      marginTop: 9
    }, {
      marginTop: 13
    }),
    marginLeft: 43,
    fontSize: 15,
    color: '#999',
  },
});