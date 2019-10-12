import React from 'react';
import { View, ScrollView, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Platform, Switch} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { FLScrollView } from '../SearchBar/searchBarAnimation';

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import botImage from '../../assets/bot.png'

import Numeral from 'numeral'
import 'numeral/locales/fr'

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

import FLTemplateAutocall from './FLTemplateAutocall'



import * as TEMPLATE_TYPE from '../../constants/template'




const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabResults extends React.PureComponent {
  
    constructor(props) {
      super(props);

      this.state = {
        isGoodToShow : this.props.isGoodToShow,
      };


    }
 
    componentWillReceiveProps (props) {
      //console.log("Prop received in tabResult : " + props.isGoodToShow + "  et avant : " + this.state.isGoodToShow);
      typeof props.isGoodToShow !== 'undefined' ? this.setState({ isGoodToShow : props.isGoodToShow }) : null;
    }
    
    _renderPrice = (item , id) => {
      //console.log('id : ' +id);
      return (
  
      <FLTemplateAutocall id={id} item={item} templateType={TEMPLATE_TYPE.LIST} isGoodToShow={this.state.isGoodToShow}/>
      
      );
    }

    render() {
      //console.log("RENDER TAB RESULTS");
      return (
          <ScrollView 
                contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: 10}}
                //style={{borderWidth:0 }}
                tabRoute={this.props.route.key}
          >
    

              <View style={{marginTop: 10, borderWidth: 0}}>
                  <FlatList
                    //style={{alignItems : 'center'}}
                    data={this.props.products}
                    extraData={this.state.isGoodToShow}
                    //renderItem={this._renderRow}
                    keyExtractor={(item) => item.code.toString()}
                    //tabRoute={this.props.route.key}
                    //numColumns={3}
                    renderItem={({item, id}) => (
                      this._renderPrice(item, id)    
              
                    )}
                    ListFooterComponent={() => {
                      return (
                        <View style={{height : 150}}>
                          <Text style={{fontFamily : 'FLFontFamily'}}>F i n L i v e</Text>
                        </View>
                      );
                    }}
                  />
              </View>
        
          </ScrollView>

      );
    }
  }


const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabResults);

