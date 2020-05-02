import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Modal, Alert, Dimensions} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import AnimatedProgressWheel from 'react-native-progress-wheel';

import RobotBlink from "../../../assets/svg/robotBlink.svg";
import banniere from '../../../assets/yourTeam.png';
import YourTeam_SVG from "../../../assets/svg/yourTeam.svg";

import { globalStyle, setFont, setColor } from '../../../Styles/globalStyle';

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

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isAndroid , getConstant } from '../../../Utils';
import { interpolateBestProducts } from '../../../Utils/interpolatePrices';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { CBroadcastTicket } from '../../../Classes/Tickets/CBroadcastTicket';


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








class FLTemplatePP extends React.Component {


  constructor(props) {
    super(props);

    this.state = {

      toto : true,
    }

    //console.log(this.props.object);

    //type de tycket
    this.type = this.props.hasOwnProperty('templateType')  ? this.props.templateType : TEMPLATE_TYPE.TICKET_FULL_TEMPLATE;

    //largeur de la cartouche sur l'ecran
    switch (this.type) {
      case TEMPLATE_TYPE.TICKET_MEDIUM_TEMPLATE : 
        this.screenWidth = 0.8 * getConstant('width');
        break;
      default :  
        this.screenWidth = 0.95 * getConstant('width');
        break;
    }
    this.screenWidth = this.props.hasOwnProperty('screenWidth')  ? this.props.screenWidth * getConstant('width') : this.screenWidth;


          
    //gestion des classes autocall et ticket broadcast
    //console.log(this.props.ticket);
    if (typeof this.props.ticket !== 'undefined' && this.props.ticket !== null) {
       this.ticket = this.props.ticket;
       this.autocall = this.ticket.getProduct();
    } else {
      this.ticket = null;
    }

    //labels de la progression et détermination des boutons a montrer sur le stepde progression
    this.nbOfStepsToShow = Math.min(6, this.ticket.getStepDepth());
    this.labels = Array(this.nbOfStepsToShow).fill().map((_, index) => (""+index));
    /*let currentStep = this.ticket.getCurrentCodeStep();
    console.log(currentStep);
    if (currentStep === 'PPSDSE' || currentStep === 'PPSDRO') {//offre echue ou refusée
      this.nbOfStepsToShow = 5;
      console.log("getStepDepth : " + this.ticket.getStepDepth());
      console.log("getCurrentStepsDepth : "+this.ticket.getCurrentStepsDepth());
    }*/
    this.currentPositionToShow = this.ticket.getCurrentLevel();
    this.show2ndButton = false;
    this.show1stButton = false;
    if (this.ticket.getStepDepth() > this.nbOfStepsToShow) { //il va falloir trogner le début et/ou la fin des steps
      if (this.ticket.getCurrentLevel() + this.nbOfStepsToShow)
      if (this.currentPositionToShow > 2) {
        this.show1stButton = true;
      // caca prout//
      } 
      if (this.ticket.getStepsToGoCount() > 3) {
        this.show2ndButton = true;
        
      } 
      
      if (this.show1stButton) {
        if (this.show2ndButton) {
          this.currentPositionToShow = 2;
        }
        else{
          this.currentPositionToShow = this.nbOfStepsToShow - this.ticket.getStepsToGoCount();
        }
      } 
    }
    console.log("Ticket Id : "+ this.ticket.getId() + " - Level : "+ this.ticket.getCurrentCodeStep() + " ("+ this.ticket.getCurrentLevel()+"/"+this.ticket.getStepDepth() + ") Stpets to go : " + this.ticket.getStepsToGoCount() + " - Level to show : "+ this.currentPositionToShow + " ( Left : "+ this.show1stButton +" || Right : " +this.show2ndButton+")");
    //console.log(this.ticket.getSteps());
    //this.labels =  ["Cart","Delivery Address","Order Summary","Payment Method","Track","Track","Track","Track"];
  }


  _renderHeaderFullTemplate() {
  
    return (
      <View style={{flexDirection: 'row'}}>
                 
                  <View style={{flex: 0.8, 
                                paddingLeft : 20,  
                                paddingTop: 3,
                                paddingBottom: 3,
                                backgroundColor: setColor('granny'), 
                                borderTopLeftRadius: 10, 
                                borderBottomWidth :  0,
  
                                }}
                  >                                                    
                
                                <Text style={setFont('400', 18, 'white')}>
                                    {this.ticket.getSubject()} 
                                </Text>
                  </View>
                  <TouchableOpacity style={{flex: 0.2, alignItems: 'center', justifyContent: 'center', backgroundColor: setColor('subscribeticket'), borderTopRightRadius: 10}}
                                  onPress={() => {
                                    this.autocall.setFinalNominal(this.ticket.getNominal());
                                    this.autocall.setEditable(false);
                                    this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailHome', {
                                      autocall: this.autocall,
                                      //ticketType: TICKET_TYPE.PSCREATION
                                    })
                                  }}
                >
                   <Text style={setFont('400', 12, 'white')}>PRODUIT ></Text>
                </TouchableOpacity>
        </View>
    );
  }
_renderHeaderMediumTemplate() {
  let isNotified = this.props.isNotified('TICKET', this.props.ticket.getId());
  return (
            <TouchableOpacity style={{flexDirection: 'row', height : 70}}
                              onPress={() => {
                                this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLTicketDetailHome' : 'FLTicketDetailTicket', {
                                  ticket: this.ticket,
                                  //ticketType: TICKET_TYPE.PSCREATION
                                })
                              }}
            >
                <View style={{
                              flex : 0.9,
                              paddingLeft : 20,  
                              paddingRight : 3,
                              paddingTop:  3,
                              paddingBottom: 5,
                              backgroundColor: setColor('granny'), 
                              borderTopLeftRadius: 10, 
                              //borderTopRightRadius: 10, 
                              borderBottomWidth :  0,
                              }}
                >         
                {  isNotified
                    ?
                      <View style={{position: 'relative', top : 25, left : -15, backgroundColor: 'white', width: 8, height: 8, borderRadius : 4, borderWidth : 1, borderColor: 'white', zIndex : 1}} />                                            
                    : null 
                }
                      <View style={{justifyContent: 'center' , marginTop : isNotified ? -8 : 0}}>

              
                              <Text style={setFont('400', isAndroid() ? 16 : 18, 'white')} numberOfLines={2}>
                                  {this.ticket.getSubject()} 
                              </Text>
                        </View>
                        <View style={{borderWidth: 0, justifyContent : 'flex-end', paddingTop : 3}}>
                                <Text style={setFont('300', 14,  'white')}>
                                  Placement privé : {this.ticket.getType()} 
                                </Text>

                        </View>

                </View>
                <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center', backgroundColor: setColor('subscribeticket'), borderTopRightRadius: 10}}>
                   <Text style={setFont('400', 22, 'white')}>></Text>
                </View>
          </TouchableOpacity>

  );
}
_renderFullTemplate() {
  return (
            <View style={{flexDirection : 'column', backgroundColor: 'white', justifyContent: 'center',  paddingBottom: 10 }}>
              <View style={{backgroundColor: 'snow', paddingLeft : 20, paddingTop: 5,paddingBottom : 5,justifyContent : 'center'}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                      {this.ticket.getDescription()}
                    </Text>
              </View>
              <View style={{ paddingLeft : 20, paddingTop: 5,justifyContent : 'center', alignItems: 'center'}}>
                    <Text style={[setFont('600', 14, 'black', 'Bold'), {textAlign: 'center'}]}>
                      {this.ticket.getUnsolvedStep()}
                    </Text>
              </View>
              <View style={{ paddingLeft : 20, paddingTop: 5,justifyContent : 'center', alignItems: 'flex-start'}}>
                   <Text style={setFont('400', 12, 'black', 'Regular')}>
                      Nominal {currencyFormatDE(this.ticket.getNominal())} {this.ticket.getCurrency()} | Rétro : {currencyFormatDE(this.ticket.getNominal()*this.ticket.getUF()/100)} {this.ticket.getCurrency()} 
                    </Text>
              </View>
            </View>
  );
}
_renderMediumTemplate() {
  return (
    <View style={{flexDirection: 'column', backgroundColor: 'white', justifyContent: 'space-between',height : 140}}>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.6, flexDirection: 'column', justifyContent: 'center', paddingLeft : 20, paddingTop: 5, paddingBottom: 3 }}>
                    <Text style={setFont('400', isAndroid() ? 16 : 18, 'black', 'Regular')}>
                      {this.ticket.getUnsolvedStep()}
                    </Text>
            </View>
            <View style={{flex : 0.4,  flexDirection : 'column', borderWidth: 0, justifyContent: 'center', alignItems: 'center', backgroundColor : 'white'}}>
                <TouchableOpacity style={{backgroundColor : this.ticket.isUserTrigger() ? 'red' : 'white', borderColor: this.ticket.isUserTrigger()? 'red' : 'gray', borderWidth: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center', margin: 10}}
                                  onPress={() => {
                                    if (this.ticket.isUserTrigger()) {
                                      
                                      this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLTicketDetailHome' : 'FLTicketDetailTicket', {
                                        ticket: this.ticket,
                                        showModalResponse : true
                                      })
        
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
                                
                                  }}
                >
                    <Text style={[setFont('500',14, this.ticket.isUserTrigger() ? 'white' : 'gray', 'Bold'), {textAlign: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5}]} numberOfLines={this.ticket.isUserTrigger() ? 1 : 2}>
                      {this.ticket.isUserTrigger() ? 'Répondre' : 'Demande\nen cours'}
                    </Text>
                </TouchableOpacity>
                <View style={{marginLeft: 0, marginTop : -5, alignItems: 'center', justifyContent: 'space-evenly', borderWidth: 0}}>
                    <Text style={setFont('400', 10,  'black', 'Regular')}>
                          {currencyFormatDE(this.ticket.getNominal())} {this.ticket.getCurrency()} 
                    </Text>
                </View>
            </View>
        </View>

        <View style={{marginTop: 0,  borderWidth: 0, justifyContent: 'center', alignItems: 'stretch'}}>

              <StepIndicator
                  customStyles={customStyles}
                  currentPosition={this.currentPositionToShow}
                  labels={this.labels.slice(0,this.nbOfStepsToShow)}
                  stepCount={this.nbOfStepsToShow}
                  renderLabel={({position, label}) => {
                    switch(position) {
                      case this.currentPositionToShow :
                        let duedate = this.ticket.getDueBy();
                        //console.log(duedate);
                        if (duedate > Date.now()) {
                            return (
                              <View style={{ padding : 2, alignItems: 'center', justifyContent: 'center', borderWidth: 0}}>
                                  <Text style={[setFont('200', 9),{textAlign: 'center'}]}>{Moment(duedate).fromNow()}</Text>
                              </View>
                            );
                        } else {
                          return (
                              <View style={{backgroundColor: 'red', width : 50, padding : 2,alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderRadius: 2, borderWith : 1, borderColor : 'red'}}>
                                  <Text style={[setFont('300', 10, 'white', 'Bold'), {textAlign: 'center'}]}>En retard</Text>
                              </View>
                          );
                        }
                      case 0 :
                        return (
                          <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2}}>
                              <Text style={setFont('200', 9)}>{Moment(this.ticket.getCreationDate()).format('lll')}</Text>
                          </View>
                        );
                        case Math.min(this.labels.length, 6) - 1 :  //dernier
                          return (
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2}}>
                                <Text style={setFont('200', 8, setColor('lightBlue'))}>Traité</Text>
                            </View>
                          );
                      default : 
                        return null;
                    }
                  }}
                  renderStepIndicator={({position}) => {
                    //console.log("POSITION : "+position +" / " +this.labels.length);
 
                    switch (position) {
                      case 1 :
                        if (this.show1stButton){
                          return (
                            <View style={{backgroundColor: 'white', width: 15, height: 15, alignItems: 'center', justifyContent: 'center'}} >
                                <View style={{backgroundColor: '#aaaaaa', width: 5, height: 5, borderRadius: 5}} />
                            </View>  
                          );  
                        }
                        break;    
                      case 4 :
                          if (this.show2ndButton){
                            return (
                              <View style={{backgroundColor: 'white', width: 15, height: 15, alignItems: 'center', justifyContent: 'center'}} >
                                  <View style={{backgroundColor: '#aaaaaa', width: 5, height: 5, borderRadius: 5}} />
                              </View>  
                            );  
                          }
                          break;
                      case this.nbOfStepsToShow -1 :
                            if (this.show2ndButton){
                              return (
                                <View style={{backgroundColor: 'white', width: 15, height: 15, borderWidth: 2, borderColor : '#aaaaaa'}} />
                              );  
                            }
                            break;
                      default :
                        return null;
                        break;
                    }
                    return null;
                  }}
              />

        </View>

    </View>
  );
}


_renderFooterFullTemplate() {

  return (
        <View style={{flexDirection : 'row', justifyContent:'space-between',  alignItems: 'center', borderTopWidth : 1, borderTopColor: 'lightgray', paddingTop : 2, paddingBottom : 2, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <View style={{paddingLeft : 15}}>
                    <Text style={setFont('200', 12)}>
                      Agt : {this.ticket.getAgentName()}
                    </Text>
                    <Text style={setFont('200', 9)}>
                      #{this.ticket.getId()}
                    </Text>
               </View>   
               <View style={{flexDirection : 'row', alignItems: 'center', justifyContent: 'center'}}>
                          <View style={{height : 10, width: 10, borderRadius: 5, backgroundColor: this.ticket.getStatus().color, margin : 5}} />
                          <View style={{alignItems: 'center', justifyContent: 'center', padding : 5}}>
                              <Text style={setFont('200', 12)}>
                                {this.ticket.getStatus().name}
                              </Text>
                          </View>
               </View>   
               <TouchableOpacity style={{flexDirection : 'row', alignItems: 'center', justifyContent: 'center'}}
                                  onPress={() => {
                                    //ajouter le changement de priorité
                                  }}
                >
                    <View style={{height : 10, width: 10, borderRadius: 5, backgroundColor: this.ticket.getPriority().color, margin : 5}} />
                    <View style={{alignItems: 'center', justifyContent: 'center', padding : 5}}>
                      <Text style={setFont('200', 12)}>
                        {this.ticket.getPriority().name}
                      </Text>
                    </View>
                </TouchableOpacity>            
        </View>

  );
}
_renderFooterMediumTemplate(isFavorite) {
 
  return (
        <View style={{flexDirection : 'row', justifyContent:'space-between',  alignItems: 'center', borderTopWidth : 1, borderTopColor: 'lightgray', paddingTop : 2, paddingBottom : 2, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <View style={{paddingLeft : 15}}>
                 
                 <Text style={setFont('200', 12)}>
                   Agt: {this.ticket.getAgentName()}
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
                  <MaterialCommunityIconsIcon name={!isFavorite ? "heart-outline" : "heart"} size={20} color={'gray'}/>
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
            render = <View style={{flexDirection : 'column'}}>
                          {this._renderHeaderMediumTemplate()}
                          {this._renderMediumTemplate()}
                          {this._renderFooterMediumTemplate(isFavorite)}
                      </View>;
            break;
        case TEMPLATE_TYPE.TICKET_FULL_TEMPLATE : 
            render = <View>
                          {this._renderHeaderFullTemplate()}
                          {this._renderFullTemplate()}
                          {this._renderFooterFullTemplate()}
                      </View>;
            break;
        default :  
            render = <View></View>;
            break;
      }


      return (
            <View style={{ 
                          //flex: 1,
                          
                          width: this.screenWidth, 
                          //marginLeft : 0.025*getConstant('width'),
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
     withUser,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(FLTemplatePP);

//export default FLTemplateAutocall;