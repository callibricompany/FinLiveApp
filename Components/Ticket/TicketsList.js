import React from 'react'
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList, StatusBar } from 'react-native'
import { FLButton } from '../commons';
import { Badge, Item, Label, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withFirebase } from '../../Database';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';


import { globalStyle } from '../../Styles/globalStyle'

import Dimensions from 'Dimensions';
import Moment from 'moment';
import localization from 'moment/locale/fr';

import PRIORITY from '../../Data/priority.json'
import STATUSFD from '../../Data/statusFD.json'


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TicketsList extends React.Component {


    constructor(props) {
      super(props)
      this.state = { 
          ticketsList : []
      }

    }


    static navigationOptions = ({ navigation }) => {
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          <View style={globalStyle.header_left_view} />
          <View style={globalStyle.header_center_view} >
            <Title style={globalStyle.header_center_text_medium}>Tickets</Title>
          </View>
          <View style={globalStyle.header_right_view} >
            <Icon name='ios-help' style={globalStyle.header_icon} />
          </View>
        </SafeAreaView>
      ),
      tabBarVisible: false,
      }
    }


    componentDidMount () {
      this.props.getAllTickets();
    }
  

    _renderTicket = ({item, index}) => {
      
      let priority = PRIORITY.filter(({id}) => id === item.priority);
      let statutFD = STATUSFD.filter(({id}) => id === item.status);
      
      return (
        <TouchableOpacity onPress={() => {
                  this.props.navigation.navigate("TicketDetail", {
                                            ticket: item,
                                          });
              }}
        >
            <View style={{flex:1,
                              borderBottomWidth:0.3,
                              borderBottomColor:'lightgrey',
                              flexDirection:'column',
                              width: DEVICE_WIDTH, 
                              height: 100,  
                              paddingLeft: DEVICE_WIDTH*0.02,
                              paddingRight : DEVICE_WIDTH*0.02,
                              marginRight: 0, 
                              marginLeft:0,
                              backgroundColor : index === 2 ? 'whitesmoke' : 'white'}}>
                    <View style={{flex:0.75, borderWidth:0}}>
                      <View style={{flex:1, flexDirection:'row'}}>
                      <View style={{flex:0.8}}>
                      <Text style={{fontSize:16, fontWeight:'bold'}}> {item.type}</Text>
                      <Text style={{fontSize:14, marginTop:3}}>{item.subject}</Text>
                      <Text style={{fontSize:14, }}> {item.description_text}</Text>
                      </View>
                      <View style={{flex:0.2,}}>
                      <View style={{flex:1, flexDirection:'column',  justifyContent:'center'}}>
                        <View style={{flex:0.3, backgroundColor : '#85B3D3', justifyContent:'center', alignItems:'center', marginTop:3, marginRight:3}}>
                          <Text style={{fontWeight:16, color:'white', fontWeight:'bold'}}>{item.id}</Text>
                        </View>
                        <View style={{flex:0.7,  justifyContent:'center', alignItems:'center'}}>
                          <Text style={{fontSize:18, fontWeight:'bold'}}>%</Text>
                        </View>
                      </View>
                      </View>
                      </View>
                      </View>
                      <View style={{flex:0.25, borderWidth:0, borderTopWidth:0,borderTopColor:'lightgrey',borderTopStyle: 'dashed',}}>
                      <View style={{flex:1, flexDirection:'row'}}>
                      <View style={{flex:0.2,backgroundColor : 'mistyrose', justifyContent:'center', alignItems:'center', marginTop:3, marginLeft:3, marginBottom:3 }}>
                        <Text>{Moment(item.created_at).locale('fr',localization).format('DD-MMM-YY')}</Text>
                      </View>
                      <View style={{flex:0.2,backgroundColor : 'indigo', justifyContent:'center', alignItems:'center', marginTop:3, marginLeft:3, marginBottom:3 }}>
                        <Text style={{color: 'white'}}>{Moment(item.updated_at).locale('fr',localization).format('DD-MMM-YY')}</Text>
                      </View>
                      <View style={{flex:0.2}}>
                        <Text></Text>
                      </View>
                      <View style={{flex:0.2,backgroundColor : statutFD[0].color, justifyContent:'center', alignItems:'center', marginTop:3, marginLeft:3, marginBottom:3 }}>
                        <Text style={{color: 'white'}}>{statutFD[0].name}</Text>
                      </View>
                      <View style={{flex:0.2,backgroundColor : priority[0].color, justifyContent:'center', alignItems:'center', marginTop:3, marginLeft:3, marginBottom:3 }}>
                        <Text style={{color: 'white'}}>{priority[0].name}</Text>
                      </View>

                      </View>
                      </View>
                  </View>
              </TouchableOpacity>

      );
    }


    render() {

        return(

              <View>
 
                <FlatList
                    data={this.props.tickets}
                    //extraData={this.state}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={this._renderTicket}
                />
              </View>

        );
      }
}


const condition = authUser => !!authUser;
const composedPricerScreen = compose(
 withAuthorization(condition),
  withFirebase,
  withUser,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(TicketsList);
