import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet, 
      Platform, TextInput, Alert, Modal, ActivityIndicator, Keyboard} from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import FLPanel from '../commons/FLPanel';

import Timeline from 'react-native-timeline-flatlist';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import {  
  generalFontColor, 
  blueFLColor,
  headerTabColor,
  selectElementTab,
  progressBarColor,
  subscribeColor,
  FLFontFamily,
  setFont,
  globalStyle } from '../../Styles/globalStyle'

import { FontAwesome } from '@expo/vector-icons';

import Accordion from 'react-native-collapsible/Accordion';

import { ssModifyTicket, getConversation } from '../../API/APIAWS';
import Svg, { Polyline } from 'react-native-svg';

import FLTemplateAutocall  from '../commons/Autocall/FLTemplateAutocall';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'



import {  CWorkflowTicket } from '../../Classes/Tickets/CWorkflowTicket';

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE} from '../../Utils';
import { convertFresh } from '../../Utils/convertFresh';
import Dimensions from 'Dimensions';


import * as TEMPLATE_TYPE from '../../constants/template';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;



class FLTicketDetail extends React.Component {
    
    constructor(props) {
      super(props);
  
      this.ticket = this.props.navigation.getParam('ticket', '...');
      
      

      this.state = {
          isLoading: false,
          showModalResponse : this.props.navigation.getParam('showModalResponse', false),
          //remarque avant envoie ticket
          instruction : '',


          activeSections: [],
          activeSectionsUnderlying : [],
      }

     

      this.createObjectTicket(this.ticket);
      


      this.data = [
        {time: '09:00', title: 'Event 1', description: 'Event 1 Description'},
        {time: '10:45', title: 'Event 2', description: 'Event 2 Description'},
        {time: '12:00', title: 'Event 3', description: 'Event 3 Description'},
        {time: '14:00', title: 'Event 4', description: 'Event 4 Description'},
        {time: '16:30', title: 'Event 5', description: 'Event 5 Description'}
      ]
    }

  componentDidMount () {
    //recuperation des conversations du ticket
    this.setState({ isLoading : true });

    getConversation(this.props.firebase, this.ticketObj.getId())
    .then((data) => {

      console.log(data.data);

      this.setState({ isLoading : false});
    })
    .catch(error => {
      console.log("ERREUR recupération conversations : " + error);
      alert('Erreur : ' + error);
      this.setState({ isLoading : false });
      
    }) 
 

  }


    createObjectTicket(ticket) {
      this.ticketObj = new CWorkflowTicket(ticket);
    }

    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      let ticket = navigation.getParam('ticket', '...');

 
      const { params } = navigation.state;
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          {/*<View style={[globalStyle.header_left_view, {flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}]} >*/}
          <View style={globalStyle.header_left_view} >
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.goBack()}>
                <Ionicons name='ios-arrow-round-back' size={40} style={[globalStyle.header_icon, {paddingLeft : 10}]} />
              </TouchableOpacity>
          </View>
          <View style={globalStyle.header_center_view} >
            <Text style={setFont('600', 22, headerTabColor)}>{ticket.currentStep[0].operation}</Text>
          </View>
          <View style={globalStyle.header_right_view} >
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.goBack()}>
             <Ionicons name='ios-notifications-outline' size={40} style={[globalStyle.header_icon, {paddingRight : 10}]}/>
             </TouchableOpacity>

          </View>
        </SafeAreaView>
      )
      }
    }

  _renderHeaderUnderlying = (section, _, isActive) => {
    //console.log("EST ACTIF : " + isActive);
    return (
      <View style={{flexDirection : 'row', borderTopLeftRadius: 15, marginTop: 20, backgroundColor:  blueFLColor, width: DEVICE_WIDTH*0.975, marginLeft: DEVICE_WIDTH*0.0125}}>
        <View style={{flex : 0.85, paddingLeft : 20,   justifyContent: 'center', alignItems : 'flex-start', borderWidth: 0}}>
            <Text style={[setFont('400', 18, 'white'), {paddingTop: 5, paddingLeft :5}]}>
            {this.ticketObj.getProductType().toUpperCase()} 
         
            </Text>
            <Text style={[setFont('200', 14, 'white'), {padding: 5}]}>
              {currencyFormatDE(this.ticketObj.getProduct().getNominal())} {this.ticketObj.getProduct().getCurrency()} | CC : {Numeral(this.ticketObj.getProduct().getUF()).format('0.00%')} 
            </Text>
        </View>
        <View style={{flex: 0.15,  justifyContent: 'center', alignItems: 'center'}}>
          <Ionicons name={isActive ?'ios-arrow-up' : 'ios-arrow-down'} size={30} style={{color: 'white'}}/>
        </View>
      </View>
    );
  };

  _renderContentUnderlying = section => {
    let underLyingDescription = null;
    let underLyingAction = null;
    switch(this.ticketObj.getType()) {
      case "Produit Structuré" :
         underLyingDescription = <FLTemplateAutocall object={this.ticket} templateType={TEMPLATE_TYPE.AUTOCALL_BODY_FULL_TEMPLATE} />
         underLyingAction =  <View style={{flex : 0.10, flexDirection : 'row',  backgroundColor: 'white'}}>
                                  <TouchableOpacity style={[{flex : 0.25}, globalStyle.templateIcon]}>
                                    
                                  </TouchableOpacity>
                                  <TouchableOpacity style={[{flex : 0.25}, globalStyle.templateIcon]} >
                                   
                                  </TouchableOpacity>
                                  <TouchableOpacity style={[{flex : 0.25}, globalStyle.templateIcon]} 
                                                    onPress={() => {
                                                      //envoi du produit
                                                      alert("En développement : ouverture de la fiche produit généré automatiquement");
                                                    }}
                                    >
                           
                                  </TouchableOpacity>      
                                  <TouchableOpacity style={{flex : 0.25, backgroundColor: subscribeColor, justifyContent: 'center', alignItems: 'center'}} >
                                    <Text style={setFont('400', 16, 'white')}>VOIR > </Text>
                                  </TouchableOpacity>
                                </View>
         break;
       default : 
          underLyingDescription = <Text>Sous-jacent ticket inconnu</Text>;
          underLyingAction = <Text>Sous-jacent ticket inconnu</Text>;
          break;   
    }

    return (
      <View style={{marginLeft: DEVICE_WIDTH*0.0125,  width: DEVICE_WIDTH*0.975, borderBottomWidth : 1,justifyContent: 'center', alignItems : 'flex-start'}}>
            <View style={{ width: DEVICE_WIDTH*0.975,backgroundColor: 'white'}}>
              <Text style={[setFont('bold', 16), {paddingTop: 5, paddingLeft :5}]}>
              {this.ticketObj.getSubject()}
            
              </Text>
            </View>
            {underLyingDescription}
            {underLyingAction}
      </View>
    );
  };

   renderStepPPACO () {
    //console.log("PAssee e ici : "+this.ticketObj.getCurrentCodeStep());
    if (this.ticketObj.getCurrentCodeStep() !== 'PPACO') {
      return null;
    }
    let resultAuctionArray = this.ticketObj.getResultAuction();
    //console.log(resultAuctionArray);
    return (
      <View style={{ flexDirection: 'column', width : DEVICE_WIDTH*0.975, justifyContent : 'center', alignItems : 'center', marginTop : 10}}>
          {
            resultAuctionArray.map((res, i) => {
  
            return (
              <TouchableOpacity  key={i} style={{flexDirection: 'row', width: DEVICE_WIDTH*0.6, backgroundColor: 'mintcream', justifyContent : 'center', alignItems : 'center', paddinLeft : 10,  borderRadius :4, marginTop: 5}}>
               <View style={{flex: 0.6, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={setFont('400', 18, 'black')}>
                    {res.emetteur}
                  </Text>
                </View>
                <View style={{flex : 0.4, flexDirection: 'column',borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                  <View style={{flex: 0.3, ustifyContent: 'center', alignItems: 'center'}}>
                    <Text style={setFont('500', 16)}>
                      COUPON
                    </Text>
                  </View>
                  <View style={{flex: 0.3, ustifyContent: 'center', alignItems: 'center'}}>
                    <Text style={setFont('500', 16)}>
                      {Numeral(res.couponAutocall).format('0.00%')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
            })
          }
      </View>
    );
   }

   renderModal () {
     return (
              <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.showModalResponse}
              onRequestClose={() => {
                console.log('Modal has been closed');
              }
              }>
              <View 
                style={{flex:1, backgroundColor:'transparent'}} 
                onStartShouldSetResponder={() => true}
                //onStartShouldSetResponderCapture={() => true}
                //onMoveShouldSetResponderCapture={() => true}
                //onMoveShouldSetResponder={() => true}
                onResponderRelease={(evt) =>{
                  let x = evt.nativeEvent.pageX;
                  let y = evt.nativeEvent.pageY;
                  //si on a clické en dehors du module view cidessous on ferme le modal
                  let verifX = x < DEVICE_WIDTH*0.1  || x > DEVICE_WIDTH*0.9 ? true : false;
                  let verifY = y < DEVICE_HEIGHT*0.2  || y > DEVICE_HEIGHT*0.5 ?true : false;
                  if (verifX || verifY) {
                    this.setState({showModalResponse : false})
                  }
                }}

              >
                <View 
                  //directionalLockEnabled={true} 
                  //contentContainerStyle={{
                    style={{
                      flexDirection: 'column',
                      backgroundColor: 'white',
                      borderWidth :1,
                      borderColor : headerTabColor,
                      borderRadius:10,
                      width: DEVICE_WIDTH*0.8,
                      //height: DEVICE_HEIGHT*0.3,
                      top:  DEVICE_HEIGHT*0.2,
                      left : DEVICE_WIDTH*0.1,
                      overflow: 'hidden'
                  }}
                >


                  <View style={{backgroundColor: headerTabColor, alignItems:'center', justifyContent: 'center', padding: 5}}>
                      <Text style={setFont('500', 14, 'white')}>{String('votre réponse').toUpperCase()}</Text>
                  </View>
                  <View style={{backgroundColor: globalStyle.bgColor, alignItems:'flex-start', justifyContent: 'flex-start'}}>
        
                      <View style={{backgroundColor: globalStyle.bgColor, borderWidth :0}}>
                        <TextInput  style={{color: 'black', textAlignVertical:'top', backgroundColor: 'white' , margin : 10, padding: 5, borderWidth :1, borderRadius: 2,width: DEVICE_WIDTH*0.8-20}}
                                  multiline={false}
                                  //numberOfLines={1}
                                  placeholder={'Instruction particulière...'}
                                  onChangeText={(e) => {
                                    this.setState({ instruction : e});
                                  }}
                                  value={this.state.instruction}
                                  returnKeyType={'done'}
                                  onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>
                  </View>
                  <View style={{alignItems:'center', justifyContent: 'center', marginTop : 5, marginBottom: 10}}>
                    {
                      this.ticketObj.getSteps().map((step, i) => {
                        return (
                          <TouchableOpacity style={{width: DEVICE_WIDTH/2, backgroundColor: subscribeColor, justifyContent: 'center', alignItems: 'center', margin : 5, borderRadius: 4}}
                                            key={i}
                                            onPress={() => {
                                              this.setState({ isLoading : true });
                                              this.props.firebase.doGetIdToken()
                                              .then(token => {
                                              
                                                //let productToSend = JSON.parse(JSON.stringify(this.item['data']));
                                                //let productToSend = JSON.parse(JSON.stringify(this.ticket));
                                                let productToSend = {};
                                                productToSend['idTicket'] = this.ticketObj.getId();
                                                productToSend['type'] = this.ticketObj.getType();
                                                productToSend['cf_cpg_choice'] = step.operation;
                                                productToSend['cf_step_pp'] = step.nextCodeStep;
                                                if (step.nextCodeStep === 'PPFPI') { //on donne le gagnant de l'auction
                                                  step.couponPhoenix !== undefined ? productToSend['couponPhoenixExecuted'] = step.couponPhoenix : null;
                                                  step.couponAutocall !== undefined ? productToSend['couponAutocallExecuted'] = step.couponAutocall : null;
                                                  productToSend['brokerNameWinner'] = step.emetteur;
                                                }
                                                console.log(step);
                                                console.log(productToSend);
                                                ssModifyTicket(token, productToSend)
                                                .then((data) => {
                                                  //console.log("USER CREE AVEC SUCCES DANS ZOHO");
                                                  
                                                  this.ticket = data.data;
                                                  this.ticket['data'] = convertFresh(data.data['custom_fields']);
                                                  console.log("TICKET MIS A JOUR");
                                                  console.log(data.data);
                                                  this.createObjectTicket(this.ticket);
                                                  this.setState({ isLoading : false});
                                                })
                                                .catch(error => {
                                                  console.log("ERREUR UPDATE TICKET: " + error);
                                                  alert('Erreur : ' + error);
                                                  this.setState({ isLoading : false });
                                                  
                                                }) 
                                              })
                                              .catch((error) => {
                                                this.setState({ isLoading : false });
                                              }); 


                                              this.setState({ showModalResponse : false})
                                            }}
                          >
                            <Text style={{color: 'white' , margin : 5}}>{step.stepSolved.toUpperCase()}</Text>
                          </TouchableOpacity>
                        );
                     })
                    }
                  </View>
                </View>
              </View>
          </Modal>



     );
   }

    render() {

      if (this.state.isLoading) {
        return (
            <View style={globalStyle.loading}>
              <ActivityIndicator size='large' />
            </View>
          );
      }
  
      

//switch(CTicket<FLTemplateAutocall object={this.ticket} templateType={TEMPLATE_TYPE.AUTOCALL_BODY_FULL_TEMPLATE} />
      let arrowW = DEVICE_WIDTH*0.925*0.6;
      let arrowW2 = 3*arrowW/5;
      return (
        <ScrollView contentContainerStyle={{flexGrow : 1, opacity : this.state.showModalResponse ? 0.1 : 1, }}>
        {this.renderModal()}


        <View style={{ marginLeft: DEVICE_WIDTH*0.0125,  width: DEVICE_WIDTH*0.975, borderBottomWidth : 1,justifyContent: 'center', alignItems : 'flex-start', marginTop: 20, borderWidth: 0}}>
            <View style={{ flexDirection : 'row', width: DEVICE_WIDTH*0.975,backgroundColor:  blueFLColor , borderTopLeftRadius: 15}}>
              <View style={{flex: 0.8, paddingBottom: 5, paddingLeft : 20}}>
                  <Text style={[setFont('400', 18, 'white'), {paddingTop: 5, paddingLeft :5}]}>
                    TICKET <Text style={setFont('bold', 20, 'red')}>{Date.now() > this.ticketObj.getFirstAnswerDate() ? 'EN RETARD' : null}</Text>
                  </Text>
                  <Text style={[setFont('200', 12, 'white'), {paddingTop: 5, paddingLeft :5}]}>
                    Mis à jour le {Moment(this.ticketObj.getLastUpdateDate()).locale('fr',localization).format('lll')}
                    
                  </Text>
              </View>
              <View style={{flex:0.2, flexDirection : 'column',borderWidth : 0, justifyContent: 'center'}}>
                <View style={{flex: 0.5, backgroundColor : this.ticketObj.getPriority().color, justifyContent: 'center'}}>
                  <Text style={[setFont('400', 10), {paddingTop : 2, paddingLeft : 2}]} numberOfLines={1}>
                      {this.ticketObj.getPriority().name.toUpperCase()}
                  </Text>
                </View>
                <View style={{flex: 0.5, backgroundColor: this.ticketObj.getStatus().color}}>
                <Text style={[setFont('400', 10), {paddingTop : 2, paddingLeft : 2}]}>
                       {this.ticketObj.getStatus().name.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ width: DEVICE_WIDTH*0.975,backgroundColor: 'white'}}>
                <Text style={[setFont('bold', 16), {paddingTop: 5, paddingLeft :5}]}>
                  {this.ticketObj.getDescription()}
                </Text>
            </View>
            <View style={{ paddingTop : 10, backgroundColor: 'white',borderWidth:1, borderColor: 'white'}}>
              
              <Svg height={60} width={DEVICE_WIDTH*0.975}>

                <Polyline
                  points= {Math.trunc(0.05*arrowW)+",0  " + Math.trunc(0.88*arrowW)+",0 "+Math.trunc(arrowW)+",25 "+Math.trunc(0.87*arrowW)+",50 "+Math.trunc(0.05*arrowW)+",50 "+Math.trunc(0.12*arrowW)+",25 "+Math.trunc(0.05*arrowW)+",0"}
                  //points="20,0 200,0 220,25 200,50 20,50 30,25 20,0"
                  fill="none"
                  stroke="green"
                  strokeWidth="1"
                />
              </Svg>   

            </View>
            <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginTop: -60}}>
                  <View style={{flex: 0.6}}>
                    <Text style={[setFont('200', 12, 'green'), {width: arrowW*0.8, height:50, top : 10, left: 0.07*DEVICE_WIDTH, textAlignVertical: 'center'}]}>
                      {this.ticketObj.getUnsolvedCodeStep()}
                    </Text>
                  </View>
                  <TouchableOpacity style={{flex : 0.4, backgroundColor: 'white', borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}
                                                  onPress={() => {
                                                    this.setState({ showModalResponse : true });
                                              
                                                }}>
                    <View style={{backgroundColor : this.ticketObj.isUserTrigger() ? 'red' : 'gray', borderColor: this.ticketObj.isUserTrigger() ? 'red' : 'gray', borderWidth: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={[setFont('500', 16, 'white'), {textAlign: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }]}>
                        {this.ticketObj.isUserTrigger() ? 'Répondre' : 'Réponse en \nattente'}
                      </Text>

                    </View>
                  </TouchableOpacity>
            </View>


            {this.renderStepPPACO()}
      
            <View style={{ backgroundColor: 'white', width : DEVICE_WIDTH*0.975 ,marginTop: 15}}>
                  <Text style={setFont('400', 12)}>
                    Interlocuteur : {this.ticketObj.getAgentName()}{'\n'}
                    Réponse attendue avant le {Moment(this.ticketObj.getFirstAnswerDate()).locale('fr',localization).format('lll')} 
                  </Text>
                                      
            </View>
        </View>
        

        <Accordion
          sections={[
            {
              title: 'UNDERLYING',
              content: 'blabla',
            }]}
          underlayColor={'transparent'}
          activeSections={this.state.activeSectionsUnderlying}
          renderHeader={this._renderHeaderUnderlying}
          renderContent={this._renderContentUnderlying}
          onChange={(activeSections) => {
            this.setState( { activeSectionsUnderlying : activeSections })  
          }}
        />



        <View style={{marginLeft: DEVICE_WIDTH*0.0125,  width: DEVICE_WIDTH*0.975, backgroundColor:  blueFLColor ,borderBottomWidth : 1,justifyContent: 'center', alignItems : 'flex-start', marginTop: 20, borderWidth: 0, borderTopLeftRadius: 15}}>
              <View style={{ width: DEVICE_WIDTH*0.975, paddingLeft : 20, justifyContent: 'center'}}>
                <Text style={[setFont('400', 18, 'white'), {paddingTop: 5, paddingLeft :5}]}>
                  ECHANGES
                </Text>
              </View>
              <View style={{ backgroundColor: 'white', width : DEVICE_WIDTH*0.975, paddingTop: 20}}>
                <Timeline
                  data={this.data}
                />
              </View>
        </View>

       </ScrollView>
      );
      }
}



const condition = authUser => !!authUser;
const composedStructuredProductDetail = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedStructuredProductDetail)(FLTicketDetail);
