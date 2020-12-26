import React from 'react';
import { View, ScrollView, StatusBar, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Dimensions, Switch} from 'react-native'; 


import Ionicons from "react-native-vector-icons/Ionicons";

import { FLScrollView } from '../SearchBar/searchBarAnimation';

import { ifIphoneX, ifAndroid, sizeByDevice, isAndroid, isIphoneX, getConstant } from '../../Utils';
import { getTicket } from '../../API/APIAWS';

import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { withFirebase } from '../../Database';
import { withNotification } from '../../Session/NotificationProvider'; 
import { compose, hoistStatics } from 'recompose';

import { CWorkflowTicket } from '../../Classes/Tickets/CWorkflowTicket';
import { CSouscriptionTicket } from '../../Classes/Tickets/CSouscriptionTicket';


import botImage from '../../assets/bot.png'

import Numeral from 'numeral'
import 'numeral/locales/fr'
import Moment from 'moment';

import {  globalStyle, setFont, setColor } from '../../Styles/globalStyle';

import FLTemplateAutocall from './Autocall/FLTemplateAutocall';



import * as TEMPLATE_TYPE from '../../constants/template'
import { CAutocall } from '../../Classes/Products/CAutocall';
import { MaterialCommunityIcons } from '@expo/vector-icons';





class FLNotifications extends React.PureComponent {
  
    constructor(props) {
      super(props);

      this.state = {
        notificationList : this.props.notificationList,
        isLoading : false,
      };

 
      this.state.notificationList.sort(FLNotifications.orderNotifications);

    }

    

    static navigationOptions = {
      header: null
    }

    UNSAFE_componentWillReceiveProps(props) {
      this.setState({ notificationList : props.notificationList }, () => this.state.notificationList.sort(FLNotifications.orderNotifications));
      
    }

    componentDidMount() {
      if (!isAndroid()) {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
          StatusBar.setBarStyle(Platform.OS === 'Android' ? 'light-content' : 'dark-content');
        });
      }
    }
    componentWillUnmount() {
      if (!isAndroid()) {
       this._navListener.remove();
      }
    }
 

    static orderNotifications(a, b) {
      let comparison = -1;
    
      if (a.timestamp < b.timestamp) {
        comparison = 1;
      } 
      return comparison;
    }

    _renderNotification(item, id) {
      // Object {
      //   "event": Object {
      //     "ticket_id": 410,
      //     "ticket_ticket_type": "Souscription",
      //     "triggered_event": "Partage. d'un nouveau produit avec vous",
      //   },
      //   "eventText": "Partage. d'un nouveau produit avec vous",
      //   "id": 410,
      //   "read": false,
      //   "subTitle": "Athéna 8 ans sur Cac 40 / annuel",
      //   "subType": "NEW SUBSCRIPTION",
      //   "timestamp": 1599649297834,
      //   "title": "Athéna 8 ans sur Cac 40 / annuel",
      //   "type": "NEW_SOUSCRIPTION",
      //   "uid": "xjoRccvRXBVo5Tqe3iaWuGBe0aX2",
      // }
      let nameIcon = "";
      switch(item.type) {
        case 'CANCEL' : 
          nameIcon =  "cancel";
          break;
        case 'NEW_SOUSCRIPTION' :
          nameIcon = "radio-tower";
          break;
        case 'TICKET' :
          if (item.subType === 'MESSAGE') {
            nameIcon = "message-text";
            break;
          }
        default : 
          nameIcon = "ticket-outline";
          break;
      }

      //console.log(item.type);
      return (
        <TouchableOpacity style={{flexDirection : 'row', width : getConstant('width'), height : 60, backgroundColor: 'white', justifyContent :'space-between', marginTop : 10}}
                          onPress={() => {
                            this.setState({ isLoading : true });
                            getTicket(this.props.firebase, item.id)
                            .then((t) => {
                              let ticket = null;
                              switch(t.type) {
                                case "Produit structuré" :
                                  console.log("Workflow : "+t.id);
                                  //console.log(t);
                                  ticket = new CWorkflowTicket(t);
                                  break;
                                case "Souscription" :
                                  console.log("Souscription : "+t.id);
                                  ticket = new CSouscriptionTicket(t);
                                  break;
                                default :
                                  break;
                              }
                              if (ticket != null) {
                                this.setState({ isLoading : false });
                                  this.props.navigation.navigate('FLTicketDetailHome', {
                                    ticket: ticket,
                                    //ticketType: TICKET_TYPE.PSCREATION
                                  })
                              }
                            })
                            .catch((error) => {
                              alert(error);
                              this.setState({ isLoading : true });
                            });
                 
                          }}
        >
            <View style={{flex : 0.2, justifyContent : 'center', alignItems : 'center'}}>
              <MaterialCommunityIcons name={nameIcon} size={30} color={setColor('')}/>
              <View style={{marginTop : 5}}>
                    <Text style={setFont('300', 10, 'gray')}>{Moment(new Date(item.timestamp)).fromNow()}</Text>
              </View>
            </View>
            <View style={{flex : 0.65, paddingLeft : 10}}>
                <View style={{justifyContent : 'center', alignItems : 'flex-start', paddingTop : 5}}>
                    <Text style={setFont('300', 12)}>{item.title}</Text>
                </View>
                <View style={{flex: 1, justifyContent : 'center', alignItems: 'flex-start', justifyContent : 'flex-start', marginTop : 5}}>
                    <Text style={setFont('300', 15, setColor(''), 'Regular')}>{item.eventText}</Text>
                </View>
       
            </View>
            <TouchableOpacity style={{flex : 0.15, justifyContent : 'center', alignItems: 'center'}}
                              onPress={() => {
                                this.props.removeNotification('TICKET', item.id);
                              }}
            >
              <MaterialCommunityIcons name={"delete-circle"} size={25} color={setColor('')} />
            
            </TouchableOpacity>
            
        </TouchableOpacity>
      );
    }


    render() {
      //console.log("RENDER TAB RESULTS");
      return (

        <View style={{width: getConstant('width'), height: getConstant('height'), backgroundColor : setColor('background')}}> 
            <View style={{height: 0+ (isAndroid() ? 45 :40+getConstant('statusBar')) , paddingLeft : 5, paddingRight: 10, backgroundColor: 'white', flexDirection : 'row', borderWidth: 0, backgroundColor: 'white', alignItems: 'center', borderBottomWidth : 1, borderBottomColor : 'lightgray'}}>
                  <TouchableOpacity style={{flex : 0.25,flexDirection : 'row',  marginTop : isAndroid() ? 0 : 30, justifyContent: 'flex-start', alignItems: 'center', borderWidth: 0}}
                                    onPress={() => this.props.navigation.goBack()}
                  >
                          <View style={{justifyContent: 'center', alignItems: 'flex-start', borderWidth: 0, paddingLeft : 10}}>
                              <Ionicons name={'md-arrow-back'}  size={25} style={{color: setColor('')}}/>
                          </View>
                  </TouchableOpacity>

                  <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center', paddingLeft : 5, paddingRight: 5, marginTop : isAndroid() ? 0 : isIphoneX() ? 40 : 25}}>
                        <Text style={setFont('300', 18, setColor(''), 'Regular')}>Notification{this.props.notificationList.length > 1 ? 's' :''} {this.props.notificationList.length > 0 ? '('+this.props.notificationList.length+')' : ''}</Text>
                  </View>
            </View>

           
    

              
                  <FlatList
                    style={{marginTop : 10, opacity : this.state.isLoading ? 0.2 : 1}}
                    data={this.props.notificationList}
                    //extraData={this.state.isGoodToShow}
                    //renderItem={this._renderRow}
                    keyExtractor={(item) => ""+item.timestamp}
                    //tabRoute={this.props.route.key}
                    //numColumns={3}
                    renderItem={({item, id}) => (
  
                      this._renderNotification(item, id)
                      //this._renderPrice(item, id)    

                    )}
                    horizontal={false}
                    ListFooterComponent={() => {
                      return (
                        <View style={{height : 150, justifyContent: 'center', alignItems: 'center'}} />
                      );
                    }}
                  />
            
       
        </View>

      );
    }
  }


const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
     withUser,
     withNotification,
     withFirebase
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(FLNotifications);

