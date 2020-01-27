import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Modal, Alert} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import AnimatedProgressWheel from 'react-native-progress-wheel';

import RobotBlink from "../../../assets/svg/robotBlink.svg";
import banniere from '../../../assets/yourTeam.png';
import YourTeam_SVG from "../../../assets/svg/yourTeam.svg";

import {  
    generalFontColor, 
    blueFLColor,
    headerTabColor,
    selectElementTab,
    progressBarColor,
    subscribeColor,
    FLFontFamily,
    FLFontFamilyBold,
    apeColor,
    backgdColorPricerParameter,
    globalStyle,
    backgdColor,
    setFont,
    setColor
 } from '../../../Styles/globalStyle'

import Dimensions from 'Dimensions';
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../../Session/withAuthentication';
import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import * as TEMPLATE_TYPE from '../../../constants/template'

import * as Progress from 'react-native-progress';

import { searchProducts } from '../../../API/APIAWS';

import { FLPDIDetail } from '../../Pricer/description/FLPDIDetail';
import { FLPhoenixBarrierDetail } from '../../Pricer/description/FLPhoenixBarrierDetail';
import { FLFreqDetail } from '../../Pricer/description/FLFreqDetail';
import { FLUFDetail } from '../../Pricer/description/FLUFDetail';
import { FLAirbagDetail} from '../../Pricer/description/FLAirbagDetail';

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isAndroid } from '../../../Utils';
import { interpolateBestProducts } from '../../../Utils/interpolatePrices';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { CBroadcastTicket } from '../../../Classes/Tickets/CBroadcastTicket';
import { CPPTicket } from '../../../Classes/Tickets/CPPTicket';

import StepIndicator from 'react-native-step-indicator';


const customStyles = {
  stepIndicatorSize: 15,
  currentStepIndicatorSize:20,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: setColor('subscribeticket'),
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: setColor('subscribeticket'),
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: setColor('subscribeticket'),
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: setColor('subscribeticket'),
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 6,
  stepIndicatorLabelCurrentColor: setColor('subscribeticket'),
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 5,
  currentStepLabelColor: setColor('subscribeticket'),
}



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class FLTemplatePP extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      isEditable : typeof this.props.isEditable !== 'undefined' ? this.props.isEditable : false,

      toto : true,
    }

    //ensemble des modal dropdown
    this._dropdown = {};

    //console.log(this.props.object);

    //type de tycket
    this.type = this.props.hasOwnProperty('templateType')  ? this.props.templateType : TEMPLATE_TYPE.TICKET_FULL_TEMPLATE;

    //largeur de la cartouche sur l'ecran
    switch (this.type) {
      case TEMPLATE_TYPE.TICKET_MEDIUM_TEMPLATE : 
        this.screenWidth = 0.8 * DEVICE_WIDTH;
        break;
      default :  
        this.screenWidth = 0.9 * DEVICE_WIDTH;
        break;
    }

          
    //gestion des classes autocall et ticket broadcast
    //console.log(this.props.ticket);
    if (typeof this.props.ticket !== 'undefined' && this.props.ticket !== null) {
       this.ticket = new CPPTicket(this.props.ticket);
       this.autocall = this.ticket.getProduct();
    } else {
      this.ticket = null;
    }
    //this.labels = ["Cart","Delivery Address","Order Summary","Payment Method","Track"];
    //this.labels = Array(this.ticket.getCurrentStepsDepth()).fill().map((_, index) => (""+index));
    this.labels =  ["Cart","Delivery Address","Order Summary","Payment Method","Track","Track","Track","Track"];
    
    console.log(this.labels);
    console.log(this.ticket.getStepPosition() + "   -   ") ;

  
  }



_renderHeaderMediumTemplate() {
  
  return (
            <View style={{flexDirection: 'row'}}>
                <View style={{
                              flex : 0.9,
                              paddingLeft : 20,  
                              paddingTop: 3,
                              paddingBottom: 3,
                              backgroundColor: setColor('vertpomme'), 
                              borderTopLeftRadius: 10, 
                              //borderTopRightRadius: 10, 
                              borderBottomWidth :  0,

                              }}
                >                                                    
                      <View style={{flex : 0.6, flexDirection: 'column', justifyContent: 'center' }}>
                      <View style={{flexDirection: 'row', borderWidth: 0}}>
                        <View style={{ borderWidth: 0}}>
              
                              <Text style={setFont('400', 18, 'white')} numberOfLines={2}>
                                  {this.ticket.getSubject()} 
                              </Text>
              
                            </View>

                        </View>
                        <View style={{flexDirection: 'row'}}>
                                <Text style={setFont('300', 14,  'white')}>
                                  Placement privé : {this.ticket.getType()} 
                                </Text>
                        </View>
                      </View>

                </View>
                <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center', backgroundColor: setColor('subscribeticket'), borderTopRightRadius: 10}}>
                   <Text style={setFont('400', 22, 'white')}>></Text>
                </View>
          </View>

  );
}

_renderMediumTemplate() {
  return (
    <View style={{flexDirection: 'column', backgroundColor: 'white', }}>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.6, flexDirection: 'column', justifyContent: 'center', paddingLeft : 20, paddingTop: 5, paddingBottom: 3 }}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                      {this.ticket.getUnsolvedCodeStep()}
                    </Text>
            </View>
            <TouchableOpacity style={{flex : 0.4,  borderWidth: 0, justifyContent: 'center', alignItems: 'center', backgroundColor : 'white'}}
                                            onPress={() => {
                                            if (this.ticket.isUserTrigger()) {
        
                                              this.props.navigation.navigate('FLTicketDetail', {
                                                  ticket: this.ticket,
                                                  showModalResponse : true
                                                });
                                            } else {
                                                Alert.alert(
                                                  'Vous attendez actuellement une réponse',
                                                  'Souhaitez-vous envoyer un message concernant ce ticket ?',
                                                  [
                                                    
                                                    {
                                                      text: 'Attendre',
                                                      onPress: () => console.log('Cancel Pressed'),
                                                      style: 'cancel',
                                                    },
                                                    {text: 'OUI', onPress: () => console.log('OK Pressed')},
                                                  ],
                                                  {cancelable: false},
                                                );
                                            }
                                        
                                          }}>
                <View style={{backgroundColor : this.ticket.isUserTrigger() ? 'red' : 'white', borderColor: this.ticket.isUserTrigger()? 'red' : 'gray', borderWidth: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center', margin: 10}}>
                    <Text style={[setFont('500',15, 'gray', 'Bold'), {textAlign: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5}]} numberOfLines={this.ticket.isUserTrigger() ? 1 : 2}>
                      {this.ticket.isUserTrigger() ? 'Répondre' : 'Demande\nen cours'}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={{marginTop: 5, borderWidth: 0, justifyContent:'center', alignItems: 'stretch'}}>
              <StepIndicator
                  customStyles={customStyles}
                  currentPosition={this.ticket.getStepPosition()}
                  labels={this.labels}
                  stepCount={this.labels.length}
                  renderLabel={({position, label}) => {
                    switch(position) {
                      case this.ticket.getStepPosition() :
                        let duedate = this.ticket.getDueBy();
                        //console.log(duedate);
                        if (duedate > Date.now()) {
                            return (
                              <View style={{backgroundColor: 'red', padding : 2, width: 80, alignItems: 'center', justifyContent: 'center'}}>
                                  <Text style={setFont('200', 9)}>{Moment(duedate).fromNow()}</Text>
                              </View>
                            );
                        } else {
                          return (
                              <View style={{backgroundColor: 'red', padding : 2, width: 50, alignItems: 'center', justifyContent: 'center'}}>
                                  <Text style={setFont('300', 10, 'white', 'Bold')}>En retard</Text>
                              </View>
                          );
                        }
                      case 0 :
                        return (
                          <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                              <Text style={setFont('200', 9)} >{Moment(this.ticket.getCreationDate()).format('lll')}</Text>
                          </View>
                        );
                      default : 
                        return null;
                    }
                  
            
                  }}
                  renderStepIndicator={() => {
                    return null;
                  }}
              />
        </View>
    </View>
  );
}

_renderFooterMediumTemplate(isFavorite) {

  return (
        <View style={{flex : 0.10, flexDirection : 'row', justifyContent:'space-between',  alignItems: 'center', borderTopWidth : 1, borderTopColor: 'lightgray', paddingTop : 5, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <View style={{paddingLeft : 15}}>
                 
                 <Text style={setFont('200', 12)}>
                   {this.ticket.getAgentName()}
                 </Text>
                 <Text style={setFont('200', 9)}>
                   #{this.ticket.getId()}
                 </Text>
               </View>   
               <TouchableOpacity style={{flexDirection : 'row', alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => {
                                  }}
                >
                    <View style={{height : 10, width: 10, borderRadius: 5, backgroundColor: this.ticket.getPriority().color, margin : 5}} />
                    <View style={{alignItems: 'center', justifyContent: 'center', padding : 5}}>
                      <Text style={setFont('200', 12)}>
                        {this.ticket.getPriority().name}
                      </Text>
                    </View>
                </TouchableOpacity> 
                <TouchableOpacity style={[globalStyle.templateIcon, {paddingRight: 15}]} 
                                  onPress={() => {
             
                                    
                                    this.props.setFavorite(this.ticket.getObject())
                                    .then((fav) => {    
                                      console.log("=================================");
                                      console.log(fav);                             
                                      this.ticket.setFavorite(fav);
                                      this.setState({ toto: !this.state.toto })
                                    })
                                    .catch((error) => console.log("Erreur de mise en favori : " + error));
                                  }}
                >
                  <MaterialCommunityIconsIcon name={!isFavorite ? "heart-outline" : "heart"} size={20} color={'black'}/>
                </TouchableOpacity>                
        </View>

  );
}



render () {
      if (this.ticket == null) {
        return null;
      }
      //check if it is in favorites
      let isFavorite = false;
      isFavorite = this.ticket.isFavorite(this.props.favorite);
      
    
      let render = <View></View>;
      switch (this.type) {
        case TEMPLATE_TYPE.TICKET_MEDIUM_TEMPLATE : 
            render = <View>
                          {this._renderHeaderMediumTemplate()}
                          {this._renderMediumTemplate()}
                          {this._renderFooterMediumTemplate(isFavorite)}
                      </View>;
            break;
        default :  
            render = <View></View>;
            break;
      }


      return (
            <View style={{flexDirection : 'column', 
                          width: this.screenWidth, 
                          //marginLeft : 0.025*DEVICE_WIDTH,
                          shadowColor: 'rgb(75, 89, 101)',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.9,
                          borderWidth :  isAndroid() ? 0 : 1,
                          borderColor : 'white',
                          //borderTopLeftRadius: 15,
                          borderRadius: 10,
                          //overflow: "hidden",
                          backgroundColor: 'gray',
                          //elevation: 3
                        }}
            >
                {render}
               
            </View>
        );
    }
}



  const condition = authUser => !!authUser;

  const composedWithNav = compose(
    withAuthorization(condition),
     withNavigation,
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(FLTemplatePP);

//export default FLTemplateAutocall;