import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Text, Platform} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { FLFlatList } from '../SearchBar/searchBarAnimation';


import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import Dimensions from 'Dimensions';

import {  globalSyle, 
  generalFontColor, 
  tabBackgroundColor,
  headerTabColor,
  selectElementTab,
  progressBarColor,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';

import FLTicket from '../commons/FLTicket'

import * as TICKET_TYPE from '../../constants/ticket'




const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabHome extends React.PureComponent {
  
    constructor(props) {
      super(props);
  
      this.state = {
        scrollTo : this.props.marginSearch,
        dataSource: Array(12).fill().map((_, index) => ({id: index}))
      };
    }
  
    componentWillReceiveProps (props) {
      console.log("NEW MARGIN SEARCH : "+props.marginSearch+ "     ANCIEN : "+this.state.scrollTo);
      this.setState({ scrollTo: props.marginSearch});
    }

    _renderTicket = ({ item , id}) => {
        //console.log("item : " +id)
        if (id < 0) {
          
          return (<View style={{height: 100, width:200, backgroundColor:'magenta'}}>
          <Text>AHAH</Text></View>);
        } else {
          return (
              <FLTicket id={id} item={item} ticketType={TICKET_TYPE.BROADCAST}/>
          )
        }
    }


    render() {
      return (
          <View style={{flex: 1, marginTop :  Platform.OS === 'android' ? -25 : 0}}>
            <FLFlatList
              //style={styles.wrapper}
              scrollTo={this.state.scrollTo}
              contentContainerStyle={styles.wrapper}
              data={this.state.dataSource}
              //renderItem={this._renderRow}
              keyExtractor={(item) => item.id.toString()}
              tabRoute={this.props.route.key}
              renderItem={({item}) => (
                this._renderTicket(item)      
              )}
            />
          </View>
      );
    }
  }

  const styles = StyleSheet.create({
    wrapper: {
      //paddingLeft: 15,
      //paddingRight: 15,
      //justifyContent : 'center',
      alignItems: 'center',
      marginTop: Platform.OS === 'ios' ? -60+45 : -25+45,
      
    }
  })
const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabHome);
