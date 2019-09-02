import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Text, Platform} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { FLFlatList } from '../SearchBar/searchBarAnimation';

import { withUser } from '../../Session/withAuthentication';
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
        
      };

      
    }
  
    componentWillReceiveProps (props) {

      this.setState({ scrollTo: props.marginSearch});
    }

    _renderTicket = ( item , id) => {

          return (
            
              <FLTicket id={id} 
                        item={item} 
                        userOrg={this.props.userOrg} 
                        filters={this.props.filtersHomePage}
                        categories={this.props.allInfo.categories}
              />
          )
    }


    render() {
      console.log(JSON.stringify(this.props.filtersHomePage));
      return (
          <View style={{marginTop :  Platform.OS === 'android' ? -25 : 0}}>
            <View>
              <FLFlatList
                //style={styles.wrapper}
                scrollTo={this.state.scrollTo}
                contentContainerStyle={styles.wrapper}
                data={this.props.homePage}
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
                    <View style={{height : 150}}>
                      <Text style={{fontFamily : 'FLFontFamily'}}>F i n L i v e</Text>
                    </View>
                  );
                }}

              />
            </View>
     
  
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
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabHome);
