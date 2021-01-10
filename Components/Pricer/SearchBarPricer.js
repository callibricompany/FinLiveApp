import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Button } from 'native-base'
import { ifIphoneX, ifAndroid, sizeByDevice , getConstant } from '../../Utils';
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

import {  globalSyle, setColor, setFont } from '../../Styles/globalStyle';




export default class SearchBarPricer extends React.Component {

  constructor(props) {
    super(props);
 
    this.state = {
      title : this.props.currentTab
    }
  }


  UNSAFE_componentWillReceiveProps(props) {
    this.setState( { title : props.currentTab});
  }

  //retourne le titre du tab
  _getLabelText  ( titleCode ) {
      switch (titleCode) {
        case  'tabPricerResults' : return 'Résultats';
        case  'tabPricerParameters' : return 'Optimisez votre produit';
        case  'tabPricerUF' : return 'Fixez vos conditions';
        default : return titleCode;
      }
  }

  

  render() {
    const { animation, changeInputFocus, renderTabBar } = this.props;

    const transformWrapper = animation.getTransformWrapper(-13, false);
    const transformSearchBar = animation.getTransformSearchBar();
    const opacitySearchBar = animation.getOpacitySearchBar();
    const opacityLocationInput = animation.getOpacityLocationInput();
    const arrowMinimizeStyle = animation.getArrowMinimizeStyle();
  
   
    
    return (
      <Animated.View style={[styles.wrapper, transformWrapper]}>
       <Animated.View style={[opacitySearchBar, {
                  display: 'flex',
                  //backgroundColor: '#45688e',
                  //borderRadius: 3,
                  borderWidth:0,
                  
                  //height: 45,
                  //marginTop: 10,
                  width: getConstant('width'),
                  alignSelf: 'center',
                  justifyContent: 'center',
                  //alignItems: 'center'
                }]}> 
          <View style={styles.searchContainer}>
            <Animated.View style={transformSearchBar} >
               <View style={{flex: 1, height: 40,borderWidth: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>   
                    <View style={{flex:0.9, borderWidth: 0, height: 40,justifyContent: 'center', alignItems: 'flex-start'}}>
                       <TouchableOpacity onPress={() => {
                                console.log("test");
                        }}>
                         <Text style={[setFont('300', 18, 'white'), {paddingLeft : 15}]}>
                          Toto {this._getLabelText(this.state.title)}
                         </Text>    
                        </TouchableOpacity>
                    </View>  
                    <View style={{ flex:0.1,  borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}> 
                      <TouchableOpacity onPress={() => {
                          alert("ouverture aide");
                        }}>  
                          <MaterialIcons
                            name='help' 
                            size={25} 
                            color='white'
                          />
                      </TouchableOpacity>
                    </View> 
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
    //zIndex: 99,
    backgroundColor: setColor(''),
  
    width: '100%',
    //overflow: 'hidden',
    paddingBottom: 0, //10,
    ...sizeByDevice({
      paddingTop: 2, //12
    }, {
      paddingTop: 2, //12
    },
    {
      paddingTop: 2,//27, //37
    }),
  },

});