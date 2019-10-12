import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, ActivityIndicator, Alert} from 'react-native';
import { Icon } from 'native-base';
import {  
    generalFontColor, 
    tabBackgroundColor,
    headerTabColor,
    selectElementTab,
    progressBarColor,
    subscribeColor,
    FLFontFamily,
    FLFontFamilyBold,
    apeColor,
    globalStyle
 } from '../../Styles/globalStyle'

import Dimensions from 'Dimensions';
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../Session/withAuthentication';
import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import { convertFresh } from '../../Utils/convertFresh';

import Svg, { Polyline } from 'react-native-svg';

import { ssModifyTicket } from '../../API/APIAWS';

import Moment from 'moment';
import localization from 'moment/locale/fr';

import FLTemplateAutocall  from '../Pricer/FLTemplateAutocall';

import TICKET_STEPS from '../../Data/ticketsSteps.json'
import PRIORITY from '../../Data/priorityFD.json';
import STATUS from '../../Data/statusFD.json';

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';
import { ScrollView } from 'react-native-gesture-handler';

import * as TEMPLATE_TYPE from '../../constants/template';
import * as TICKET_TYPE from '../../constants/ticket';



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;




class FLTicketTemplatePP extends React.Component {


  constructor(props) {
    super(props);

    this.ticket = this.props.ticket;
    this.product = convertFresh(this.ticket['custom_fields']);
    console.log(this.ticket);
    //console.log(this.product);
    //determination de l'étape 
    this.step = TICKET_STEPS.filter(({codeStep}) => codeStep === this.ticket.currentStep[0].codeStep)[0];

    //determination de l'étape  suivante
    this.nextStep = TICKET_STEPS.filter(({codeStep}) => codeStep === this.ticket.currentStep[0].nextCodeStep)[0];
    
    //priorite FD
    this.priority = PRIORITY.filter(({id}) => id === this.ticket.priority)[0];
    
    //statut FD
    this.status = STATUS.filter(({id}) => id === this.ticket.status)[0];


    this.state = {
        isLoading : false,
    }

    //le produit-ticket est filtre ou pas
    this.isFiltered = false;

  }

  componentWillReceiveProps (props) {

  }

 




  render () {
    //si c'est filtré on ne l'affiche pas
    if (this.isFiltered) {
      return null;
    }

    if (this.state.isLoading) {
      return (
          <View style={globalStyle.loading}>
            <ActivityIndicator size='large' />
          </View>
        );
    }

    let arrowW = DEVICE_WIDTH*0.925*0.6;
    let arrowW2 = 3*arrowW/5;
    return (
      <View style={[globalStyle.itemTicket, {flexDirection : 'column', width: DEVICE_WIDTH*0.925, borderBottomWidth : 1,}]}>
          <TouchableOpacity style={{backgroundColor:  headerTabColor  }}
                                  onPress={() => {
                                    this.props.navigation.navigate('FLTicketDetail', {
                                      ticket: this.ticket,
                                      product : this.product
                                    });
                                  }}>
            <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 16, color: 'white', paddingTop: 5, paddingLeft :5}}>
                {this.ticket['subject']}
            </Text>
            <Text style={{fontFamily:  FLFontFamily, fontWeight: '200', fontSize: 13, color: 'white', padding:5}}>
                Placement privé : {this.ticket['type']}
            </Text>
          </TouchableOpacity>
          <View>
            <FLTemplateAutocall item={this.product} templateType={TEMPLATE_TYPE.AUTOCALL_CARAC} />
          </View>
          <View style={{ marginTop : 0, backgroundColor: 'white'}}>

              <Svg height={60} width={DEVICE_WIDTH*0.925}>

                <Polyline
                  points= {Math.trunc(0.05*arrowW)+",0  " + Math.trunc(0.88*arrowW)+",0 "+Math.trunc(arrowW)+",25 "+Math.trunc(0.87*arrowW)+",50 "+Math.trunc(0.05*arrowW)+",50 "+Math.trunc(0.12*arrowW)+",25 "+Math.trunc(0.05*arrowW)+",0"}
                  //points="20,0 200,0 220,25 200,50 20,50 30,25 20,0"
                  fill="green"
                  stroke="green"
                  strokeWidth="1"
                />
  
                {/*<Polyline
                  //points= {Math.trunc(0.05*arrowW2 +arrowW)+",0  " + Math.trunc(0.87*arrowW2+arrowW)+",0 "+Math.trunc(arrowW2+arrowW)+",25 "+Math.trunc(0.87*arrowW2+arrowW)+",50 "+Math.trunc(0.05*arrowW2+arrowW)+",50 "+Math.trunc(0.12*arrowW2+arrowW)+",25 "+Math.trunc(0.05*arrowW2+arrowW)+",0"}
                  points= {Math.trunc(0.0*arrowW+arrowW)+",0  " + Math.trunc(0.88*arrowW+arrowW2)+",0 "+Math.trunc(arrowW+arrowW2)+",25 "+Math.trunc(0.87*arrowW+arrowW2)+",50 "+Math.trunc(0.0*arrowW+arrowW)+",50 "+Math.trunc(0.12*arrowW+arrowW)+",25 "+Math.trunc(0.0*arrowW+arrowW)+",0"}
                  //points="210,0 320,0 340,25 320,50 210,50 230,25 210,0"
                  fill="none"
                  stroke="green"
                  strokeWidth="1"
                />*/}
              </Svg>   
           
          </View>
          <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginTop: -60,}}>
                  <View style={{flex: 0.6}}>
                    <Text style={{width: arrowW*0.8, height:50, top : 10, left: 0.07*DEVICE_WIDTH, textAlignVertical: 'center', fontFamily:  FLFontFamily, color: 'white',  fontWeight: '200', fontSize: 12}}>
                      {this.step.stepUnsolved}
                    </Text>
                  </View>
                  <TouchableOpacity style={{flex : 0.4,  borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}
                                                   onPress={() => {
                                                  if (this.step.userTrigger) {
                                                    this.setState({ isLoading : true });
                                                    this.props.firebase.doGetIdToken()
                                                    .then(token => {
                                                    
                                                      //let productToSend = JSON.parse(JSON.stringify(this.item['data']));
                                                      let productToSend = {};
                                                      
                                                      productToSend['idTicket'] = this.ticket.id;
                                                      productToSend['type'] = this.ticket.type;
                                                      productToSend['cf_cpg_choice'] = this.ticket.currentStep[0].operation;
                                                      productToSend['cf_step_pp'] = this.ticket.currentStep[0].nextCodeStep;
                                                      console.log(productToSend);
                                                      ssModifyTicket(token, productToSend)
                                                      .then((data) => {
                                                        //console.log("USER CREE AVEC SUCCES DANS ZOHO");
                                                        
                                                        console.log("SUCCES CREATION TICKET : ");
                                                        console.log(data);
                                                        
                                                        this.ticket = data.data;
                                                        console.log("TICKET MIS A JOUR");
                                                        this.setState({ isLoading : false});
                                                      })
                                                      .catch(error => {
                                                        console.log("ERREUR CREATION TICKET: " + error);
                                                        this.setState({ isLoading : false });
                                                        
                                                      }) 
                                                    })
                                                    .catch((error) => {
                                                      this.setState({ isLoading : false });
                                                    }); 
                                                  } else {
                                                      /*Alert.alert(
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
                                                      );*/
                                                  }
                                              
                                                }}>
                    <View style={{backgroundColor : this.step.userTrigger ? 'red' : 'gray', borderColor: this.step.userTrigger ? 'red' : 'gray', borderWidth: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{textAlign: 'center', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, fontFamily:  FLFontFamily, color: 'white',  fontWeight: '500', fontSize: 16}}>
                        {this.step.userTrigger ? 'Répondre' : 'Réponse en \nattente'}
                      </Text>
      
                    </View>
                  </TouchableOpacity>
          </View>
          <View style={{height: 15, backgroundColor: 'white', borderWidth:0}}>

          </View>
          <View style={{flexDirection: 'row',backgroundColor:  'whitesmoke' , borderTopWidth :0,}}>
            <View style={{flex:0.3, borderRightWidth : 0, justifyContent: 'center'}}>
              <Text style={{fontFamily:  FLFontFamily,  fontWeight: '300', fontSize: 12, padding : 2}}>
                  Interlocuteur : {'\n'}{this.ticket['requester_id']}
              </Text>
            </View>
            <View style={{flex:0.45, justifyContent: 'center'}}>
              <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 12, paddingTop : 2, paddingLeft : 2}}>
                  Vu le :{'\t'}<Text style={{fontSize: 10}}>{Moment(this.ticket['updated_at']).locale('fr',localization).format('DD-MMM-YY hh:mm')}</Text>
              </Text>
              <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 12, paddingLeft : 2}}>
                  Création :{'\t'}<Text style={{fontSize: 10}}>{Moment(this.ticket['created_at']).locale('fr',localization).format('DD-MMM-YY hh:mm')}</Text>
                  
              </Text>
            </View>
            <View style={{flex:0.25, flexDirection : 'column',borderWidth : 0, justifyContent: 'center'}}>
              <View style={{flex: 0.5, backgroundColor : this.priority.color}}>
                <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 10, paddingTop : 2, paddingLeft : 2}}>
                    Priorité {this.priority.name}
                </Text>
              </View>
              <View style={{flex: 0.5, backgroundColor: this.status.color}}>

                <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 10, paddingTop : 2, paddingLeft : 2}}>
                    Statut {this.status.name}
                </Text>
              </View>
            </View>

          </View>
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

export default hoistStatics(composedWithNav)(FLTicketTemplatePP);

