import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Text, Platform, Alert} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { FLFlatList } from '../SearchBar/searchBarAnimation';

import { withUser } from '../../Session/withAuthentication';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';


import Dimensions from 'Dimensions';

import {  globalStyle, 
  generalFontColor, 
  tabBackgroundColor,
  headerTabColor,
  selectElementTab,
  progressBarColor,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';

import FLTemplateAutocall from '../Pricer/FLTemplateAutocall';

import * as TEMPLATE_TYPE from '../../constants/template';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabHome extends React.PureComponent {
  
    constructor(props) {
      super(props);
  
      this.state = {
        scrollTo : this.props.marginSearch,
        refreshing : false,
        
      };

      
    }
  
    componentWillReceiveProps (props) {
      console.log("RECEIVE PROPS HOME : "+ props.marginSearch);
      this.setState({ scrollTo: props.marginSearch, refreshing : false });
    }

    _renderTicket = ( item , id) => {

          return (
            
              <FLTemplateAutocall id={id} 
                        item={item} 
                        userOrg={this.props.userOrg} 
                        filters={this.props.filtersHomePage}
                        categories={this.props.categories}
                        templateType={item.template}
              />
          )
    }


    render() {
      //console.log(JSON.stringify(this.props.filtersHomePage));
      return (
          <View style={{marginTop :  Platform.OS === 'android' ? -25 : 0}}>
            <View>
              <FLFlatList
                //style={styles.wrapper}
                scrollTo={this.state.scrollTo}
                contentContainerStyle={globalStyle.wrapperFlatList}
                data={this.props.filtersHomePage["category"] === 'PSFAVORITES' ? this.props.favorites : this.props.homePage}
                //data={this.props.homePage}
                //renderItem={this._renderRow}
                keyExtractor={(item) => {
                  let key = typeof item.data['id'] === 'undefined' ? item.data['code'] : item.data['id'];
                  return key.toString();
                }}
                tabRoute={this.props.route.key}
                renderItem={({item, id}) => (
                  this._renderTicket(item, id)     
                )}
                ListFooterComponent={() => {
                  return (
                    <TouchableOpacity onPress={() => {
                             Alert.alert("FinLive SAS","Copyright ©")
                        }}
                        style={{height : 150}}>
                      <Text style={{fontFamily : 'FLFontFamily'}}>F i n L i v e</Text>
                    </TouchableOpacity>
                  );
                }}
                /*ListHeaderComponent={() => {
                  
                  return (
                    this.state.refreshing ?
                      <ActivityIndicator style={{height: 80}} size={"small"} /> : <View/>
              
                  );
                }}*/

                //refreshing={this.state.refreshing}
                /*onRefresh={() => {
                  console.log("Est rafraichi");
                  
                  //this.setState({ refreshing: true }, () => this.props.getUserAllInfo());
                  this.setState({ refreshing: true });
                }}*/
                
              />
            </View>
    
  
  
          </View>

      );
    }
  }


const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabHome);
