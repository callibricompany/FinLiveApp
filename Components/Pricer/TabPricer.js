import React from 'react';
import { View, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Text, Platform} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { FlatList } from '../SearchBar/searchBarAnimation';


import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import Dimensions from 'Dimensions';

import {  globalSyle, 
  generalFontColor, 
  tabBackgroundColor,
  headerTabColor,
  selectElementTab,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';

import fullStarImage from '../../assets/star.png'
import emptyStarImage from '../../assets/emptystar.png'
import couponImage from '../../assets/ticket_carre.png'
import couponProtectionImage from '../../assets/couponPhoenix.png'
import pdiImage from '../../assets/iconPDI.png'
import podiumImage from '../../assets/podium.png'


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabPricer extends React.PureComponent {
  
    constructor(props) {
      super(props);
  
      this.state = {
        dataSource: Array(12).fill().map((_, index) => ({id: index}))
      };
    }
  
    _renderTicket = ({ item , id}) => {
      //console.log("item : " +id)
      if (id < 0) {
        
        return (<View style={{height: 200, width:200, backgroundColor:'magenta'}}>
        <Text>AHAH</Text></View>);
      } else {
        return (
            <Text>alouette</Text>
        );
      }
    }

    render() {
      return (
          <ScrollView style={{width: DEVICE_WIDTH*0.925, flexDirection: 'column',marginTop: Platform.OS === 'ios' ? -60+45 : -25+45,}}>
            <View style={{flexDirection: 'colomn', height : 60, borderWidth: 1, justifyContent: 'center'}}>
              <View style={{flex: 0.4}}>
                <Text style={{fontFamily: FLFontFamily, fontWeight: '600'}}>
                  PRODUITS STRUTURES
                </Text>
              </View>
              <View style={{flex: 0.3}}>
                <Image  style={{resizeMode: 'contain', width: DEVICE_WIDTH*0.6*0.3, height: (DEVICE_WIDTH*0.6*0.3)}} source={couponImage} />
              </View>
              <View style={{flex: 0.3}}>
                <Button><Text>TOTO</Text></Button>
              </View>
            </View>
            <FlatList
              style={{alignItems: 'center'}}
              data={this.state.dataSource}
              numColumns={3}
              //renderItem={this._renderRow}
              keyExtractor={(item) => item.id.toString()}
              tabRoute={this.props.route.key}
              renderItem={({item}) => (
                this._renderTicket(item)      
              )}
           />
          </ScrollView>

      );
    }
  }

const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabPricer);
