import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Modal, Alert, Dimensions} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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

import { searchProducts, getTicket, getBroadcastAmount} from '../../../API/APIAWS';

import { FLPDIDetail } from '../../Pricer/description/FLPDIDetail';
import { FLPhoenixBarrierDetail } from '../../Pricer/description/FLPhoenixBarrierDetail';
import { FLFreqDetail } from '../../Pricer/description/FLFreqDetail';
import { FLUFDetail } from '../../Pricer/description/FLUFDetail';
import { FLAirbagDetail} from '../../Pricer/description/FLAirbagDetail';

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isAndroid , getConstant } from '../../../Utils';
import { interpolateColor, interpolateColorFromGradient } from '../../../Utils/color';
import { interpolateBestProducts } from '../../../Utils/interpolatePrices';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { CUser } from '../../../Classes/CUser';
import { CBroadcastTicket } from '../../../Classes/Tickets/CBroadcastTicket';
import { CWorkflowTicket } from '../../../Classes/Tickets/CWorkflowTicket';

import { parsePhoneNumberFromString } from 'libphonenumber-js';


import StepIndicator from 'react-native-step-indicator';
import { CSouscriptionTicket } from '../../../Classes/Tickets/CSouscriptionTicket';
import { CTicket } from '../../../Classes/Tickets/CTicket';



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
      timerFirsDueBy : 0,

      //les notifications
      isNotified : false,
      notifications : [],

      //progressbar underterminate
      isProgressbarDeterminated : false,
      subscripters : [],
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

    //recuperation du ticket
    this.requester = null;
    this.requesterOrg  = null;
    if (typeof this.props.ticket !== 'undefined' && this.props.ticket !== null) {
        this.ticket = this.props.ticket;
        this.autocall = this.ticket.getProduct();
        if (this.ticket.isShared()) {
          this.requester = new CUser(this.ticket.getRequester());
          this.requesterOrg = this.ticket.getRequesterOrg();
        } 
        this._updateStepIndicator();
   
    } else {
      this.ticket = null;
    }
    //console.log(this.props.ticket);
    

    //timer
    this.intervalTimerFirstDueBy = null;
    //console.log("Ticket Id : "+ this.ticket.getId() + " - Level : "+ this.ticket.getCurrentCodeStep() + " ("+ this.ticket.getCurrentLevel()+"/"+this.ticket.getStepDepth() + ") Stpets to go : " + this.ticket.getStepsToGoCount() + " - Level to show : "+ this.currentPositionToShow + " ( Left : "+ this.show1stButton +" || Right : " +this.show2ndButton+")");

    this.amount = 0;
  }

    //component rcceved props
    UNSAFE_componentWillReceiveProps(props) {
      //console.log("RCOIT UNE PROPS : " + this.ticket.isShared() ? this.ticket.getSouscriptionId() : this.ticket.getId());
      if (this.ticket.isShared()) {
          let id = this.ticket.getSouscriptionId();
          getTicket(this.props.firebase, id)
          .then((ticket) => {
              //console.log(ticket);
              this.ticket = new CSouscriptionTicket(ticket);
              this._updateAmountSubscription();
              //check if notified
              this._updateNotifications();

          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        getTicket(this.props.firebase, this.ticket.getId())
        .then((ticket) => {
            this.ticket = new CWorkflowTicket(ticket);
            this._updateStepIndicator();
     
            //check if notified
            this._updateNotifications();

        })
        .catch((error) => {
          console.log(error);
        });
      }

      
    }

   // compopnentdidmount
   _updateAmountSubscription() {

      //retreive broadcast amount
      if (this.ticket.isShared()) {
        getBroadcastAmount(this.props.firebase, this.ticket.getBroadcastId())
        .then((subscripters) => {

          if (subscripters.hasOwnProperty('subscription')) {
      
            this.amount = subscripters.subscription.reduce((a, b) => a + b, 0);
          }
          this.setState({ isProgressbarDeterminated : true , subscripters});
        })
        .catch((error) => {
          console.log(error);
        });
      }
  }

  componentDidMount() {

      //check if notified
      this._updateNotifications();
      this.ticket.isShared() ? this._updateAmountSubscription() : null;
  }


  //on update  les timers et on agit en consequence
  componentDidUpdate(){
    this.firstDealineTicket = Moment(this.ticket.getFrDueBy()).fromNow();
    this.dealineTicket = Moment(this.ticket.getDueBy()).fromNow();
    
  }
  componentWillUnmount() {
    this.intervalTimerFirstDueBy != null ? clearInterval(this.intervalTimerFirstDueBy) : null;
    //this.intervalTimerFirstDueBy = null;

  }

  //gere les notifications
  _updateNotifications() {
    //remets a jour les compteurs due dates
    this.intervalTimerFirstDueBy = null;
    this.firstDealineTicket = Moment(this.ticket.getFrDueBy()).fromNow();
    this.dealineTicket = Moment(this.ticket.getDueBy()).fromNow();
    this.intervalTimerFirstDueBy = setInterval( 
      () => {
        this.setState({ timerFirsDueBy: this.state.timerFirsDueBy + 1 });
      },
      60000
    );

    //console.log("EST NOTIFIE : " + this.ticket.getId());
    this.setState({ isNotified : this.props.isNotified('TICKET', this.ticket.isShared() ? this.props.ticket.getSouscriptionId() : this.props.ticket.getId()) }, () => {
        //console.log(this.state.isNotified);
        if (this.state.isNotified) {
          this.setState({ notifications : this.props.getNotifications('TICKET', this.ticket.isShared() ? this.ticket.getSouscriptionId() : this.ticket.getId()) });
        }
    });
  }

  //remets a jour les steps
  _updateStepIndicator() {


        // //labels de la progression et détermination des boutons a montrer sur le stepde progression
        // this.nbOfStepsToShow = Math.min(6, this.ticket.getStepDepth());
        this.labels = Array(this.ticket.getStepDepth()+1).fill().map((_, index) => (""+index));
        // console.log("STEP DEPTH : " + this.ticket.getStepDepth()+ "   : " + this.ticket.getStepsToGoCount());
        // /*let currentStep = this.ticket.getCurrentCodeStep();
        // console.log(currentStep);
        // if (currentStep === 'PPSDSE' || currentStep === 'PPSDRO') {//offre echue ou refusée
        //   this.nbOfStepsToShow = 5;
        //   console.log("getStepDepth : " + this.ticket.getStepDepth());
        //   console.log("getCurrentStepsDepth : "+this.ticket.getCurrentStepsDepth());
        // }*/
        // this.currentPositionToShow = this.ticket.getCurrentLevel();
        // this.show2ndButton = false;
        // this.show1stButton = false;
        // if (this.ticket.getStepDepth() > this.nbOfStepsToShow) { //il va falloir trogner le début et/ou la fin des steps
        
        //   if (this.currentPositionToShow > 2) {
        //     this.show1stButton = true;
        //   // caca prout//
        //   } 
        //   if (this.ticket.getStepsToGoCount() > 3) {
        //     this.show2ndButton = true;
            
        //   } 
          
        //   if (this.show1stButton) {
        //     if (this.show2ndButton) {
        //       this.currentPositionToShow = 2;
        //     }
        //     else{
        //       this.currentPositionToShow = this.nbOfStepsToShow - this.ticket.getStepsToGoCount();
        //     }
        //   } 
        // }
  }

  _renderStepIndicator() {
    
    return (
          // <StepIndicator
          //       customStyles={customStyles}
          //       currentPosition={this.currentPositionToShow}
          //       labels={this.labels.slice(0,this.nbOfStepsToShow)}
          //       stepCount={this.nbOfStepsToShow}
          //       renderLabel={({position, label}) => {
          //         switch(position) {
          //           case this.currentPositionToShow :
          //             let duedate = this.ticket.getFrDueBy();
          //             //console.log(duedate);
          //             if (duedate > Date.now()) {
          //                 return (
          //                   <View style={{ padding : 2, alignItems: 'center', justifyContent: 'center', borderWidth: 0}}>
          //                       <Text style={[setFont('200', 9),{textAlign: 'center'}]}>{this.firstDealineTicket}</Text>
          //                   </View>
          //                 );
          //             } else {
          //               return (
          //                   <View style={{backgroundColor: 'red', width : 50, padding : 2,alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderRadius: 2, borderWith : 1, borderColor : 'red'}}>
          //                       <Text style={[setFont('300', 10, 'white', 'Bold'), {textAlign: 'center'}]}>En retard</Text>
          //                   </View>
          //               );
          //             }
          //           case 0 :
          //             return (
          //               <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2}}>
          //                   <Text style={setFont('200', 9)}>{Moment(this.ticket.getCreationDate()).format('lll')}</Text>
          //               </View>
          //             );
          //             case Math.min(this.labels.length, 6) - 1 :  //dernier
          //               return (
          //                 <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 2}}>
          //                     <Text style={setFont('200', 8, setColor('lightBlue'))}>Traité</Text>
                              
          //                 </View>
          //               );
          //           default : 
          //             return null;
          //         }
          //       }}
          //       renderStepIndicator={({position}) => {
          //         //console.log("POSITION : "+position +" / " +this.labels.length);

          //         switch (position) {
          //           case 1 :
          //             if (this.show1stButton){
          //               return (
          //                 <View style={{backgroundColor: 'white', width: 15, height: 15, alignItems: 'center', justifyContent: 'center'}} >
          //                     <View style={{backgroundColor: '#aaaaaa', width: 5, height: 5, borderRadius: 5}} />
          //                 </View>  
          //               );  
          //             }
          //             break;    
          //           case 4 :
          //               if (this.show2ndButton){
          //                 return (
          //                   <View style={{backgroundColor: 'white', width: 15, height: 15, alignItems: 'center', justifyContent: 'center'}} >
          //                       <View style={{backgroundColor: '#aaaaaa', width: 5, height: 5, borderRadius: 5}} />
          //                   </View>  
          //                 );  
          //               }
          //               break;
          //           case this.nbOfStepsToShow -1 :
          //                 //if (this.show2ndButton){
          //                   return (
          //                     <View style={{backgroundColor: '#aaaaaa', width: 15, height: 15, borderWidth: 2, borderColor : '#aaaaaa'}} />
          //                   );  
          //                 //}
          //                 break;
          //           default :
          //             return null;
          //             break;
          //         }
          //         return null;
          //       }}
          //   />


            <StepIndicator
            customStyles={customStyles}
            currentPosition={this.ticket.getCurrentLevel()+1}
            labels={this.labels}
            stepCount={this.ticket.getStepDepth()+1}
            renderLabel={({position, label}) => {
              // console.log(position +" : " + Moment(this.ticket.getCreationDate()).format('lll'));
              switch(position) {
                case this.ticket.getCurrentLevel()+1 :
                  let duedate = this.ticket.getFrDueBy();
                  
                  if (duedate > Date.now()) {
                      return (
                        <View style={{ padding : 2, alignItems: 'center', justifyContent: 'center', borderWidth: 0}}>
                            <Text style={[setFont('200', 9),{textAlign: 'center'}]}>{this.firstDealineTicket}</Text>
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
                case this.labels.length - 1 :  //dernier
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

                case this.ticket.getStepDepth() :
                      //if (this.show2ndButton){
                        return (
                          <View style={{backgroundColor: '#aaaaaa', width: 15, height: 15, borderWidth: 2, borderColor : '#aaaaaa'}} />
                        );  
                      //}
                      break;
                default :
                  return null;
                  break;
              }
              return null;
            }}
        />
    );
  }



  _renderProgressBroadcast() {

    return (
       
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 0.025*getConstant('width'), paddingRight : 0.025*getConstant('width'), marginTop : 15}}>
              <View style={{flex : 0.6}}>
                  <Text style={setFont('300', 14, 'black', 'Regular')}>
                    Objectif : {currencyFormatDE(this.ticket.getBroadcastAmount())} {this.ticket.getCurrency()}
                  </Text>
                  <Text style={setFont('300', 10, 'gray')}>
                    encore {currencyFormatDE(Math.max(0, this.ticket.getBroadcastAmount()- this.amount))} {this.ticket.getCurrency()}
                  </Text>
                  <View style={{flex : 0.6,  justifyContent: 'center', alignItems: 'flex-start'}}>
                      <Progress.Bar progress={this.amount/this.ticket.getBroadcastAmount()} 
                                    color={this.state.isProgressbarDeterminated ? setColor('') : setColor('lightBlue')} 
                                    indeterminate={!this.state.isProgressbarDeterminated} 
                                    indeterminateAnimationDuration={2000}
                                    width={this.screenWidth/2}
                      />
                  </View>
              </View>

              <View style={{flex : 0.4, justifyContent: 'center', alignItems: 'flex-end', borderWidth : 0}}>
                  <View>
                      <Text style={setFont('300', 10)}>
                          Fin {Moment(this.ticket.getEndDate()).fromNow()}
                      </Text>
                  </View>
                  <View style={{borderWidth: 1, borderColor : this.ticket.getFrDueBy() < Date.now() ? 'lightgray' : setColor('subscribeBlue'), borderRadius : 10, backgroundColor: this.ticket.getFrDueBy() < Date.now() ? 'lightgray' : setColor('subscribeBlue'), padding : 3, marginTop : 5}}>
                      <Text style={[setFont('400',14,'white', 'Bold'), {margin : 5}]}>
                        {this.ticket.getFrDueBy() < Date.now() ? 'ECHUE' : 'SOUSCRIRE'}
                      </Text>
                  </View>

              </View>
              {/* <View style={{padding: 5, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Text style={setFont('400', 12, 'black',)}>{this.ticket.getMessage()}</Text>
              </View> */}
            
              
          </View>
 
    );
  }
  _renderFullTemplate() {
    return (
            <TouchableOpacity style={{}}
                              onPress={() => {
                                this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLTicketDetailHome' : 'FLTicketDetailTicket', {
                                  ticket: this.ticket,
                                  //ticketType: TICKET_TYPE.PSCREATION
                                })
                              }}
            >

              {  this.state.isNotified
                    ?
                      <View style={{position : 'absolute', top : 5, right : -5, justifyContent : 'center', alignItems : 'center',  zIndex : 10, width: 30, height: 30, borderWidth : 0}} >
                              <Ionicons name={'ios-notifications'} size={30} style={{color : 'red'}} />
                              <View style={{position : 'relative', top : -25, left : 0, width : 16, height : 16, backgroundColor : 'transparent',  alignItems : 'center', justifyContent : 'center'}}>
                                  <Text style={setFont('300', 12, 'white', 'Bold')}>{this.state.notifications.length}</Text> 
                              </View>
                      </View>  
                                                               
                    : null 
              }
              {  this.ticket.isShared() && this.ticket.isMine(this.props.user)
                    ?
                      <View style={{position : 'absolute', top : 85, right : 10, justifyContent : 'center', alignItems : 'center',  zIndex : 10, backgroundColor: setColor('subscribeticket'), width: 40, height: 40, borderRadius : 20, borderWidth : 1, borderColor : setColor('subscribeticket')}} >
                            
                            <MaterialCommunityIcons name={'radio-tower'} size={40} color={'white'}/>
                      </View>                                            
                    : null 
                }

  
                <View style={{ flexDirection : 'row', paddingLeft : 10, paddingTop: 3, width : this.screenWidth, borderWidth : 0}} >   
                    <View style={{flex :  0.8, borderWidth : 0}}>
                          <Text style={setFont('400', 16, 'black', this.state.isNotified ? 'Bold' : 'Regular')} numberOfLines={1}>
                                      {this.ticket.getSubject()} 
                          </Text>
                          <Text style={setFont('300', 14, 'black', this.state.isNotified ? 'Regular' : 'Light')}>
                                      {this.ticket.getWorkflowName()} : {this.ticket.getType()} 
                          </Text>
                    </View>
                    <View style={{flex : 0.25, justifyContent : 'center', alignItems : 'center', borderWidth : 0}}>
                          <Text style={setFont('200', 18, setColor('subscribeticket'), 'Bold')}>{Numeral(this.autocall.getCoupon()).format("0.00%")}</Text>
                          <Text style={setFont('200', 12, setColor('subscribeticket'))}> p.a.
                          </Text>
                    </View>   

                </View>
  
               <View style={{flexDirection : 'row', marginLeft : 10, marginRight : 10, marginTop : 10}}>
                  <View style={{flex : 0.33}}>
                      <Text style={setFont('200', 10, 'gray')}>Nominal :</Text>
                              <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                                    <View style={{justifyContent : 'flex-start', alignItems : 'flex-start', padding : 0}}>  
                                        <Text style={setFont('200', 12, setColor('subscribeticket'), 'Bold')}>{currencyFormatDE(this.ticket.getNominal())}  </Text>
                                    </View>
                                    <View style={{justifyContent : 'center', alignItems : 'center', paddingRight : 3}}>  
                                        <Text style={setFont('200', 12, setColor('subscribeticket'), 'Regular')}>{this.ticket.getCurrency()}</Text>
                                    </View>
                              </View>
                  </View>  

                  <View style={{flex : 0.33}}>
                      <Text style={setFont('200', 10, 'gray')}>Commission :</Text>
                              <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                                    <View style={{justifyContent : 'center', alignItems : 'center'}}>  
                                        <MaterialCommunityIcons name={'margin'} size={15} color={setColor('subscribeticket')}/>
                                    </View>
                                    <View style={{justifyContent : 'center', alignItems : 'flex-start',  paddingLeft : 3}}>  
                                        <Text style={setFont('200', 12, setColor('granny'), 'Bold')}>{currencyFormatDE(this.ticket.getUFInCurrency())}  </Text>
                                    </View>
                                    <View style={{justifyContent : 'center', alignItems : 'center', paddingRight : 3}}>  
                                        <Text style={setFont('200', 12, setColor('granny'), 'Regular')}>{this.ticket.getCurrency()}</Text>
                                    </View>
                              </View>
                  </View>    
                  
                  <View style={{flex : 0.33}}>
                      <Text style={setFont('200', 10, 'gray')}>Mon association :</Text>
                              <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                                     <View style={{justifyContent : 'center', alignItems : 'center'}}>  
                                        <FontAwesome5 name={'donate'} size={15} color={setColor('subscribeticket')}/>
                                    </View>
                                    <View style={{justifyContent : 'center', alignItems : 'flex-start', paddingLeft : 3}}>  
                                        <Text style={setFont('200', 12, setColor('granny'), 'Bold')}>{currencyFormatDE(this.ticket.getUFAssocInCurrency())}  </Text>
                                    </View>
                                    <View style={{justifyContent : 'center', alignItems : 'center', paddingRight : 3}}>  
                                        <Text style={setFont('200', 12, setColor('granny'), 'Regular')}>{this.ticket.getCurrency()}</Text>
                                    </View>
                              </View>
                  </View>                    
               </View>

               <View style={{flex: 1, justifyContent: 'center',borderWidth: 0,  marginTop : 25, marginLeft : 10, marginRight : 10, marginBottom : 5 }}>
                    <Text style={setFont('400', 16, 'black', 'Regular')}>
                      {this.ticket.getUnsolvedStep()}
                    </Text>
               </View>

               {this._renderStepIndicator()}
               {this.state.isNotified
                ?
                    <View style={{lex: 1, justifyContent: 'center',borderWidth: 0,  marginTop : 20, marginLeft : 10, marginRight : 10, marginBottom : 10 }}>
                        {this.state.notifications.map((notif, index) => {
                                  let percent = Math.round(100*index/(this.state.notifications.length));
                                  let color = interpolateColorFromGradient("Jonquil", percent);
                                  return (
                                      <View style={{flex : 1, borderWidth : 0, flexDirection : 'row'}} key={index}>
                                          <View style={{flex : 0.6, marginTop : 2, marginRight : 5,  padding : 3, justifyContent: 'center', alignItems : 'flex-start', borderRadius : 5, borderWidth : 1, borderColor : color, backgroundColor : color}}>
                             
                                                  <Text style={setFont('300', 14, 'black', 'Regular')} numberOfLines={1}>
                                                   {notif.eventText}
                                                  </Text>
                                   
                                          </View>
                                          <View style={{flex : 0.4, marginTop : 2, marginRight : 5 , padding : 3, borderWidth : 0, justifyContent: 'center', alignItems : 'flex-start'}}>
                                              <Text style={setFont('200', 12, 'gray', 'Regular')} numberOfLines={1}>{Moment(new Date(notif.timestamp)).fromNow()}</Text>
                                          </View>
                                      </View>
                                  );
                                })
                        }
                    </View>
                : null
                }

               {/* <View style={{flexDirection : 'row', paddingRight : 15, justifyContent:'space-between',  alignItems: 'center',   marginTop : 15, marginLeft : 10, marginRight : 10,}}>
                    <View style={{}}>
                    
                        <Text style={setFont('200', 9)}>
                          Agt: 
                        </Text>
                        <Text style={setFont('200', 10)}>
                          {this.ticket.getAgentName()}
                        </Text>
                    </View>   

                      <View style={[globalStyle.templateIcon, {paddingRight: 15}]}>
                              <Text style={setFont('200', 12)}>{this.ticket.getStatus().name}{'\n'}
                              <Text style={setFont('200', 9)}>#{this.ticket.getId()}</Text> </Text>
                      </View>    
                      <View style={{flexDirection : 'row', alignItems: 'center', justifyContent: 'center'}}>
                          <View style={{height : 10, width: 10, borderRadius: 5, backgroundColor: this.ticket.getPriority().color, margin : 5}} />
                          <View style={{alignItems: 'center', justifyContent: 'center', padding : 5}}>
                            <Text style={setFont('200', 12)}>
                              {this.ticket.getPriority().name}
                            </Text>
                          </View>
                      </View>             
              </View> */}

            </TouchableOpacity>
    );
  }


  _renderMediumTemplate() {
    return (
            <TouchableOpacity style={{}}
                              onPress={() => {
                                
                                this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLTicketDetailHome' : 'FLTicketDetailTicket', {
                                  ticket: this.ticket,
                                  //ticketType: TICKET_TYPE.PSCREATION
                                })
                              }}
            >

                {  this.state.isNotified
                    ?
                      <View style={{position : 'absolute', top : 5, right : -5, justifyContent : 'center', alignItems : 'center',  zIndex : 10, width: 30, height: 30, borderWidth : 0}} >
                              <Ionicons name={'ios-notifications'} size={30} style={{color : 'red'}} />
                              <View style={{position : 'relative', top : -25, left : 0, width : 16, height : 16, backgroundColor : 'transparent',  alignItems : 'center', justifyContent : 'center'}}>
                                  <Text style={setFont('300', 12, 'white', 'Bold')}>{this.state.notifications.length}</Text> 
                              </View>
                      </View>  
                                                               
                    : null 
                }
                { this.ticket.isShared() && this.ticket.isMine(this.props.user)
                    ?
                      <View style={{position : 'absolute', top : 50, right : 10, justifyContent : 'center', alignItems : 'center',  zIndex : 10, backgroundColor: setColor('subscribeticket'), width: 40, height: 40, borderRadius : 20, borderWidth : 1, borderColor : setColor('subscribeticket')}} >
                            <MaterialCommunityIcons name={'radio-tower'} size={40} color={'white'}/>
                      </View>                                            
                    : null 
                }


                <View style={{ flexDirection : 'row', paddingLeft : 10, paddingTop: 3, width : this.screenWidth, borderWidth : 0}} >   
                    <View style={{flex :  0.8, borderWidth : 0}}>
                          <Text style={setFont('400', 16, 'black', this.state.isNotified ? 'Bold' : 'Regular')} numberOfLines={1}>
                                      {this.ticket.getSubject()} 
                          </Text>
                          <Text style={setFont('300', 14, 'black', this.state.isNotified ? 'Regular' : 'Light')}>
                                      {this.ticket.getWorkflowName()} : {this.ticket.getType()} 
                          </Text>
                    </View>
                    <View style={{flex : 0.25, justifyContent : 'center', alignItems : 'center', borderWidth : 0}}>
                          <Text style={setFont('200', 18, setColor('subscribeticket'), 'Bold')}>{Numeral(this.autocall.getCoupon()).format("0.00%")}</Text>
                          <Text style={setFont('200', 12, setColor('subscribeticket'))}> p.a.
                          </Text>
                    </View>   

                </View>
                {this.ticket.isShared() && !this.ticket.isMine(this.props.user)
                ? <View>
                  <View style={{ flexDirection : 'row', paddingLeft : 0, paddingRight : 10, paddingVertical:  3, borderRadius : 10, }} >   
                                    <View style={{flexDirection : 'row', width : '70%', marginTop : 5, marginBottom : 2, padding : 1, justifyContent : 'space-between'}}>
                                            <View style={{height : 40, width : 40, borderWith : 0, borderColor : 'white', borderRadius : 20, backgroundColor : setColor(''), marginLeft : 10,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                                            {this.requester.getAvatar() == null 
                                              ?
                                                <Text style={setFont('400', 16, 'white', 'Regular')}>{this.requester.getFirstName().charAt(0)}.{this.requester.getLastName().charAt(0)}.</Text>
                                                : 
                                                <Image style={{width: 40, height: 40, borderWidth : 0, borderRadius : 20, borderColor : 'white'}} source={{uri : this.requester.getAvatar() }} />
                                            }
                                            </View>
                                            <View style={{flex : 1, borderWidth : 0, marginLeft : 10, marginTop : 3, marginRight : 5}}>
                                                <Text style={setFont('300', 14, 'black', 'Regular')}>
                                                  {this.requester.getName()} 
                                                </Text>
                                                <Text style={setFont('300', 12, 'gray', 'Regular')}>
                                                  {this.requester.getCompany()}
                                                </Text>
                                            </View>
                                    </View>

                                    <View style={{width : '30%', justifyContent : 'center', alignItems : 'flex-end'}}>
                                            <Image style={{ borderWidth : 0, height : 50, width : 50}} source={{uri : this.requesterOrg.logoUrl}} resizeMode={'cover'} />
                                    </View>
                  </View>
                  {/* <View style={{marginLeft : 10, paddingBottom : 10 , backgroundColor : setColor('background') }}>
                          <Text style={setFont('400', 14, 'black')}>
                                    vous propose : 
                          </Text>     
                  </View> */}
                  </View>

                : null
                }

                <View style={{ marginLeft : 10, marginRight : 10}}>
                {
                    this.ticket.isShared()
                    ?
                        this.ticket.isMine(this.props.user)
                        ?
                              <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'flex-start', height : 19}}>
                                    <View style={{justifyContent : 'flex-start', alignItems : 'flex-start', padding : 0}}>  
                                          <Text style={setFont('200', 12, setColor('subscribeticket'), 'Bold')}>
                                              {currencyFormatDE(this.amount)}  {this.ticket.getCurrency()} collecté sur {currencyFormatDE(this.ticket.getBroadcastAmount())} {this.ticket.getCurrency()}
                                          </Text>
                                      </View>
                              </View>  
                        : null
 
                    :
                      <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                            <View style={{justifyContent : 'flex-start', alignItems : 'flex-start', padding : 0}}>  
                                <Text style={setFont('200', 12, setColor('subscribeticket'), 'Bold')}>{currencyFormatDE(this.ticket.getNominal())}  </Text>
                            </View>
                            <View style={{justifyContent : 'center', alignItems : 'center', paddingRight : 3}}>  
                                <Text style={setFont('200', 12, setColor('subscribeticket'), 'Regular')}>{this.ticket.getCurrency()}</Text>
                            </View>
                      </View>
         
                  }
                  </View>
          
              { !this.ticket.isShared() || this.ticket.isMine(this.props.user)
                ?
               <View style={{flex: 1, justifyContent: 'flex-start', alignItems : 'flex-start', borderWidth: 0,  marginTop : 10, marginLeft : 10, marginRight : 10, marginBottom : 5 , height : 35}}>
                    <Text style={setFont('400', 12, 'black', 'Regular')}>
                      {this.ticket.getUnsolvedStep()}
                    </Text>
               </View>
               : null
              }

               {this.ticket.isShared() && !this.ticket.isMine(this.props.user) ? this._renderProgressBroadcast() : this._renderStepIndicator()}
 
              <View style={{height : 10, justifyContent:'center',  alignItems: 'center',   marginTop : 2}} />
               {/* <View style={{flexDirection : 'row', justifyContent:'center',  alignItems: 'center',   marginTop : 15}}>
                    <View style={{flex : 0.33, alignItems: 'flex-start', justifyContent: 'center', paddingLeft : 5}}>
                    
                        <Text style={setFont('200', 9)}>
                          Agt: 
                        </Text>
                        <Text style={setFont('200', 10)}>
                          {this.ticket.getAgentName()}
                        </Text>
                    </View>   

                      {!this.ticket.isShared() || this.ticket.isMine(this.props.user)
                      ?
                        <View style={{flex : 0.33, alignItems: 'center', justifyContent: 'center', paddingRight: 15}}>
                                <Text style={setFont('200', 12)}>{this.ticket.getStatus().name}{'\n'}
                                <Text style={setFont('200', 9)}>#{this.ticket.getId()}</Text> </Text>
                        </View>  
                      : null
                      }  
                      <View style={{flex : 0.33, flexDirection : 'row', alignItems: 'center', justifyContent: 'center'}}>
                          <View style={{height : 10, width: 10, borderRadius: 5, backgroundColor: this.ticket.getPriority().color, margin : 5}} />
                          <View style={{alignItems: 'flex-start', justifyContent: 'center', padding : 5}}>
                            <Text style={setFont('200', 10,'gray')}>
                              Priorité
                            </Text>
                            <Text style={setFont('200', 12)}>
                              {this.ticket.getPriority().name}
                            </Text>
                          </View>
                      </View>  

                      {
                        this.ticket.isShared() && !this.ticket.isMine(this.props.user)
                        ?
                            <View style={{flex : 0.33, backgroundColor : setColor(''), borderBottomRightRadius: 10,justifyContent : 'center', alignItems: 'center'}}>
                              <MaterialCommunityIcons name="fast-forward" size={25} color={'white'}/>
                            </View>
                        : null
                      }           
              </View> */}

            </TouchableOpacity>
    );
  }



render () {

      if (this.ticket == null) {
        
        return null;
      }

      //check de l'instance
      if (this.ticket.isShared() && !(this.ticket instanceof CSouscriptionTicket)) {
        return null;
      }
      //check if it is in favorites
      let isFavorite = false;
      isFavorite = this.ticket.isFavorite(this.props.favorite);
       
      let render = <View></View>;

      switch (this.type) {
        case TEMPLATE_TYPE.TICKET_MEDIUM_TEMPLATE : 
            render = this._renderMediumTemplate();
            break;
        case TEMPLATE_TYPE.TICKET_FULL_TEMPLATE :
            render = this._renderFullTemplate();
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
                          borderWidth :   1,
                          borderColor : isAndroid() ? 'black' : 'white',
                          //borderTopLeftRadius: 15,
                          borderRadius: 10,
                          //overflow: "hidden",
                          backgroundColor: 'white',
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