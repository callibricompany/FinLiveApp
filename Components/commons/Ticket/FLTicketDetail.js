import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, Image, Modal, KeyboardAvoidingView, Keyboard, TextInput, TouchableWithoutFeedback, PanResponder, Animated, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import { GiftedChat, Send, InputToolbar, Composer, Message, Bubble, MessageImage} from 'react-native-gifted-chat';
import Lightbox from 'react-native-lightbox';


import Timeline from 'react-native-timeline-flatlist';

import { ssCreateStructuredProduct, ssModifyTicket, getConversation, getTicket, createreply } from '../../../API/APIAWS';

import { setFont, setColor  } from '../../../Styles/globalStyle';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { withFirebase } from '../../../Database';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import FLTemplatePP from "../Ticket/FLTemplatePP";
import FLTemplateAutocall from '../Autocall/FLTemplateAutocall';

import logo_white from '../../../assets/LogoWithoutTex_white.png';
import logo from '../../../assets/LogoWithoutText.png';

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant, getContentTypeIcon, getContentTypeColor } from '../../../Utils';

import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import HTMLView from 'react-native-htmlview';
import * as WebBrowser from 'expo-web-browser';

import * as TEMPLATE_TYPE from '../../../constants/template';

import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { ScrollView } from 'react-native-gesture-handler';
import { CTicket } from '../../../Classes/Tickets/CTicket';

import Robot from "../../../assets/svg/robotBlink.svg";
import { CWorkflowTicket } from '../../../Classes/Tickets/CWorkflowTicket';






class FLTicketDetail extends React.Component {
    
  constructor(props) {
    super(props);


    this.ticket= this.props.ticket;
    this.autocall = this.ticket.getProduct();
    //console.log("Constructeur ticket");
    this.props._removeToast();
    this.state = {

      nominal :  this.ticket.getNominal(),
      finalNominal :  this.ticket.getNominal(),


      //messages des conversations
      linesInputCount : 1,
      messages : [],

      //gestion du clavier
      keyboardHeight: 0,
      isKeyboardVisible: false,

      //modal
      showModalDrawnerPriority : false,

      //gestion des conversations et notes
      notes : [],
      chat : [],

      //timer de reponses aux offres
      timers : [0, 0, 0],


      isLoading : true,
    

      //gestion des tabs
      index: 0,
      routes: [
        { key: 'DETAIL', title: 'Détail' },
        { key: 'CONVERSATION', title: 'Conversation' },
        { key: 'ACTIVITY', title: 'Activité' },
        { key: 'DOCUMENTS', title: 'Docs' },
      ]
    }

    ///timers
    this.intervalTimer = [null, null, null];
    this.nbOfIssuerResponses = 0;

    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);

   
  }

  // compopnentdidmount
  componentDidMount() {

    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle(Platform.OS === 'Android' ? 'light-content' : 'dark-content');
      });
    }

    //timers


    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

    //chargement des conversations
    getTicket(this.props.firebase, this.ticket.getId())
    .then((ticket) => {
        this.ticket = new CWorkflowTicket(ticket);
        this.dealineTicket = Moment(this.ticket.getDueBy()).fromNow();
        this._updateConversation();
        this.initializeTimers();
    })
    .catch((error) => {
      console.log(error);
      alert("Impossible de récupérer les changements du ticket " + notification.data.idTicket);
    });
    

    //on specifie que le ticket est lu
    this.props.removeNotification('TICKET', this.ticket.getId());
    this.props.setCurrentFocusedObject('TICKET', this.ticket.getId());

  }

  //component rcceved props
  UNSAFE_componentWillReceiveProps(props) {
    //console.log("RECEPTION DES PROPS TICKETS : " + props.allNotificationsCount );
    //quelque chose a bougé sur le ticket on verifie s'il a été notifié
    console.log("EST NOTIFIE : " + this.props.isNotified('TICKET', this.ticket.getId()));
    if (this.props.isNotified('TICKET', this.ticket.getId())) {
      //on recharhge les tickets et les coversations
      this.setState({ isLoading : true });
      getTicket(this.props.firebase, this.ticket.getId())
      .then((ticket) => {
          //console.log(ticket);
          // let t = new CWorkflowTicket(ticket);
          // this.ticket.setObject(t.getObject());
          this.ticket = new CWorkflowTicket(ticket);
          this.dealineTicket = Moment(this.ticket.getDueBy()).fromNow();
          
          //on supprime la notification
          this.props.removeNotification('TICKET', this.ticket.getId());

          this._updateConversation();
          this.initializeTimers();
          this.setState({ isLoading : false });
      })
      .catch((error) => {
        console.log(error);
        alert("Impossible de récupérer les changements du ticket " + notification.data.idTicket);
        this.setState({ isLoading : false });
      });
      
      


    }
  }

  //////////////////////////////////
  //
  //    TIMERS
  //////////////////////////////////
  initializeTimers() {
    this.intervalTimer = [null, null, null];
    switch(this.ticket.getCurrentCodeStep()){
      case 'PPACO' :
            //console.log(Object.keys(this.ticket.getObject().data.quoteRequest));

            this.nbOfIssuerResponses = this.ticket.getQuoteRequestsCount();
            for (let i = 0; i < this.nbOfIssuerResponses; i++) {
              let timers = this.state.timers;
              let newTimers = this.state.timers;
              //recuperer le nombre de secondes qu'il reste

              let secondsToExpity = 0;
              let expiry = this.ticket.getResponseIssuerExpiryDate(i);
              console.log(Moment(expiry).format('llll'));
              if (expiry !== 0) {

                secondsToExpity = (Moment(expiry).toDate() - Date.now())/1000;
              }

              
              newTimers[i] = secondsToExpity;
              this.setState({timers : newTimers }, () => {
                this.setTimer(0);
              });
            }

            break;
      default : break;
    }
  }

  setTimer(index) {
    this.intervalTimer[index] = setInterval(
      () => {
        let timers = this.state.timers;
        let newTimers = [];
        timers.forEach((t) => {
          //console.log("Timer : " + t);
          t = Math.max(0, t - 1);
          newTimers.push(t);
        });
        this.setState({ timers: newTimers });//, () => console.log(this.state.timers));//this.setState((prevState)=> ({ timers: [prevState.timers(0) - 1] })),
      },
      1000
    );
  }

  //on acheve  les timers et on agit en consequence
  componentDidUpdate(){
    this.dealineTicket = Moment(this.ticket.getDueBy()).fromNow();
    if(this.intervalTimer[0] != null && this.state.timers[0] === 1){ 
      clearInterval(this.intervalTimer[0]);

    }
    if(this.intervalTimer[1] != null && this.state.timers[1] === 1){ 
      clearInterval(this.intervalTimer[1]);
    }
    if(this.intervalTimer[2] != null && this.state.timers[1] === 1){ 
      clearInterval(this.intervalTimer[1]);
    }
  }

  componentWillUnmount() {

    //on cleare les countdowns
    this.intervalTimer[0] != null ? clearInterval(this.intervalTimer[0]) : null;
    this.intervalTimer[1] != null ? clearInterval(this.intervalTimer[1]) : null;
    this.intervalTimer[2] != null ? clearInterval(this.intervalTimer[2]) : null;


    //on enleve le focus sur ticket
    this.props.setCurrentFocusedObject('', '');

    if (!isAndroid()) {
      this._navListener.remove();
    }
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  }
  
  keyboardDidHide() {
    this.setState({
      keyboardHeight: 0,
      isKeyboardVisible: false
    });
  }

  keyboardDidShow(e) {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
      isKeyboardVisible: true
    });
  }
  
  //////////////////////////////////
  //
  //    TICKET UPDATE
  //////////////////////////////////


  //////////////////////////////////
  //
  //    CONVERSATION
  //////////////////////////////////
  async _updateConversation() {
    //chargement de la conversation
    this.setState({ isLoading : true });
    await getConversation(this.props.firebase, this.ticket.getId())
    .then((data) => {

      this.ticket.setConversations(data.data);

      //met au bon format les conversations whatsapp
      let wa = this.ticket.getChat();
      let messages = [ ];
      let minDate = new Date();
      
      wa.map((t, index) => {
        let mess = {};
        mess['_id'] = index + 2;
        let text = t.body_text;
        //supression des retours de lignes a la fin
        mess['text'] = text.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "");
        let user = {};
        user['_id'] = this.props.authUser.codeTS === t.user_id ? 1 : 2
        mess['user'] = user;
        mess['createdAt'] = Moment(t.updated_at).toDate();
        
        //on rajoute les attachments
        if (t.hasOwnProperty('attachments')) {
          mess['attachments'] = t.attachments;
        }
        //mess['image'] = "https://picsum.photos/200";
       
        // {
        //   _id: 3,
        //   text: 'Alouette',
        //   createdAt: new Date(),
        //   user: {
        //     _id: 2,
        //     name: 'FinLive',
        //   },
        // },

        //on utilise mindate pour plcer le premier message systeme
        minDate = Moment(t.updated_at).toDate();
        messages.push(mess);
      });
      messages.push({
        _id: 1,
        text: 'Bienvenue dans les conversations FinLive',
        createdAt: minDate,
        system: true,

      });
      this.setState({ notes : this.ticket.getNotes(), chat : wa,  messages, isLoading : false });//, () => console.log("NBRE DE NOTES : " + this.state.notes.length));
      
    })
    .catch(error => {
      console.log("ERREUR recupération conversations : " + error);
      alert('Erreur : ' + error);
      this.setState({ isLoading : false });
      
    }) 

  }



  /////////////////////////////////////////////////////////
  //
  //         SPECIFIC STEP
  //si on est a une etape particulier : design particulier
  _renderSpecificStep() {
      switch(this.ticket.getCurrentCodeStep()){
        case 'PPACO' :
              //console.log(Object.keys(this.ticket.getObject().data.quoteRequest));
              let issuers = Array(3).fill().map((_, index) => ({id: index}));

              //this.nbOfIssuerResponses = this.ticket.getQuoteRequestsCount();
              
              return (
                <View style={{flexDirection : 'row', borderWidth : 0, width : 0.95*getConstant('width'), height : 200}}>
                  {
                      issuers.map((issuer, index) => {
                          if (this.nbOfIssuerResponses > index  ) { //reponse recue
                            //this.ticket.getResponseIssuerCode(index)
                            // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).format('llll'));
                            // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).fromNow());
                            // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).toDate());
                            return (
                                <View style={{flex : 0.33, flexDirection : 'column', borderWidth : 1, borderRadius : 5, margin : 3, backgroundColor: this.state.timers[index] > 1 ? 'white' : setColor('gray')}} key={index}>
                                    <View style={{flex : 0.5, borderWidth : 0, justifyContent : 'flex-start', alignItems : 'flex-start', margin : 2}}>
                                       <Image style={{width: 0.95*getConstant('width')/3 - 20, height : 50}} source={require('../../../assets/issuers/sg.png')} resizeMode={'contain'}/>
                                    </View>
                                    <View style={{flex : 0.35, borderWidth : 0, alignItems: 'center', justifyContent: 'center', marginTop : 3}}>
                                        <Text style={[setFont('400', 26, 'green', this.state.timers[index] > 1 ? 'Bold' : 'Light'), {textAlign : 'center', textAlignVertical : 'center'}]}>
                                          {Numeral(this.ticket.getResponseIssuerQuote(index)/100).format('0.00%')}{'\n'}
                                          <Text style={[setFont('400', 10, 'gray'), {textAlign : 'center', textAlignVertical : 'center'}]}>Term-sheet</Text>
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{flex : 0.15,  margin : 10, backgroundColor: this.state.timers[index] > 1  ? setColor('subscribeBlue') : setColor('granny'), borderWidth : 1, borderColor: this.state.timers[index] > 1  ? setColor('subscribeBlue') : setColor('granny'), alignItems: 'center', justifyContent : 'center'}}
                                                      onPress={() => {
                                                        if (this.state.timers[index] > 1 ){
                                                          alert('On traîte');
                                                        } else {
                                                          alert('on rafraichit');
                                                        }
                                                      }}
                                    >
                                        <Text style={setFont('400', this.state.timers[index] > 1 ? 16 : 12 , 'white', 'Regular')}> 
                                          {this.state.timers[index] > 1 
                                           ? 'TRAITER'
                                           : 'RAFRAÎCHIR'
                                          }
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{paddingBottom: 5, borderWidth : 0, justifyContent: 'center', alignItems : 'center'}}>
                                      <Text style={{fontSize : 14}}>
                                        { this.state.timers[index] > 1
                                          ?
                                         ('0'+Math.floor(this.state.timers[index]/3600) % 24).slice(-2)+':'+('0'+Math.floor(this.state.timers[index]/60)%60).slice(-2)+':'+('0' + this.state.timers[index] % 60).slice(-2)
                                          : 'prix échu'
                                        }
                                        
                                      </Text>
                                    </View>
                                </View>
                            );
                          } else { //réponse non reçue
                            return (
                              <View style={{flex : 0.33, flexDirection : 'column', borderWidth : 1, borderRadius : 5, margin : 3, backgroundColor: setColor('gray')}} key={index}>
                                    <View style={{flex : 0.5, borderWidth : 0, justifyContent : 'flex-start', alignItems : 'flex-start', margin : 2}}>
                                       <Text style={setFont('300', 12, 'gray', 'Regular')}></Text>
                                    </View>
                                    <View style={{flex : 0.35, borderWidth : 0, alignItems: 'center', justifyContent: 'center', marginTop : 3}}>
                                        <Text style={[setFont('400', 12, 'gray', 'Regular'), {textAlign : 'center', textAlignVertical : 'center'}]}>
                                          Prix en cours d'éléaboration
                                        </Text>
                                    </View>
                                    <View style={{flex : 0.15,  margin : 10, backgroundColor: 'gray', alignItems: 'center', justifyContent : 'center'}}>
                                        <Text style={setFont('400', 12, 'lightgray', 'Regular')}> 
                                          TRAITER
                                        </Text>
                                    </View>
                                </View>
                            );
                          }

                      })
                  }
                     
                </View>
              );
              break;
        default : 
              return (
                <View style={{}}>
                    <Text style={[setFont('300', 20, 'gainsboro', 'Regular'), {textAlign: 'center'}]}>{this.ticket.getSolvedStep()}</Text>
                </View>
              );
        
      }    

  }


  //////////////////////////////////
  //
  //    DETAIL TICKET
  //////////////////////////////////
  _renderDetail() {
    return (
      <ScrollView style={{marginTop : 20, borderWidth : 0}}>
          <View style={{justifyContent: 'center', alignItems: 'flex-start', borderWidth : 0, paddingLeft : 0.025*getConstant('width')}}>
            <Text style={setFont('500', 18, 'black', 'Regular')}>{this.ticket.getDescription()}</Text>
          </View>
 
          <View style={{justifyContent: 'center', alignItems: 'flex-start', borderWidth : 0, paddingLeft : 0.025*getConstant('width'), marginTop : 25, backgroundColor: 'white'}}>
           
            {     this.ticket.getDueBy() > Date.now()
                  ?
                              <View style={{ padding : 2, alignItems: 'center', justifyContent: 'center', borderWidth: 0, backgroundColor: setColor('subscribeticket')}}>
                                  <Text style={[setFont('200', 10, 'white'),{textAlign: 'center'}]}>Deadline : {this.dealineTicket}</Text>
                                  <Text style={[setFont('200', 12, 'white'),{textAlign: 'center'}]}>{Moment(this.ticket.getDueBy()).format('llll')}</Text>
                                  <Text style={[setFont('200', 12, 'white'),{textAlign: 'center'}]}>{Moment(this.ticket.getFrDueBy()).format('llll')}</Text>
                              </View>
                  : 
                              <View style={{backgroundColor: 'red', width : 50, padding : 2,alignItems: 'center', justifyContent: 'center', borderWidth: 0}}>
                                  <Text style={[setFont('300', 10, 'white', 'Bold'), {textAlign: 'center'}]}>En retard</Text>
                              </View>
            }
             
          </View>
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderWidth : 0, paddingRight : 0.025*getConstant('width'),paddingLeft : 0.025*getConstant('width'), marginTop : 5, backgroundColor: 'white'}}>
              <View style={{flex: 0.4}}>
                  <Text style={[setFont('500', 20, 'black', 'Bold'), {textAlign: 'center'}]}>{this.ticket.getUnsolvedStep()}</Text>
              </View>
              <View style={{flex: 0.2, borderWidth : 0, alignItems: 'center', justifyContent: 'center'}}>
                  <MaterialCommunityIcons name={'fast-forward'} size={50} color={'gainsboro'} style={{transform: [{ rotate: '90deg'}]}} />
              </View>


              {this._renderSpecificStep()}

              


          </View>



          <View style={{width : 0.95*getConstant('width'), borderWidth : 0, justifyContent : 'center', marginLeft : 0.025*getConstant('width'), marginTop : 40}}>
                    <Text style={setFont('400', 20, 'gray', 'Regular')}>
                      NOMINAL : {currencyFormatDE(this.ticket.getNominal())} {this.ticket.getCurrency()} 
                    </Text>
          </View>

          <TouchableOpacity style={{alignItems: 'center', marginTop : 10, borderWidth : 1}}
                            onPress={() => {
                              this.autocall.setFinalNominal(this.ticket.getNominal());
                              this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailTicket', {
                                autocall: this.autocall,
                                //ticketType: TICKET_TYPE.PSCREATION
                              })
                            }}
          >
              <FLTemplateAutocall object={this.autocall.getObject()} screenWidth={1} templateType={TEMPLATE_TYPE.AUTOCALL_TICKET_TEMPLATE} isEditable={false} source={this.props.source}  nominal={this.ticket.getNominal()} />
          </TouchableOpacity>
          <View style={{flexDirection : 'row', justifyContent: 'flex-start', alignItems: 'stretch', borderWidth : 0, paddingLeft : 0.025*getConstant('width'), marginTop : 30,}}>
              <View style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={setFont('200', 10, 'gray')}>Création{'\n'}
                        <Text style={setFont('200', 12)}>{Moment(this.ticket.getCreationDate()).format('DD/MM/YY hh:mm')}</Text></Text>
               </View> 
               <TouchableOpacity style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, marginLeft : 7, justifyContent: 'center', alignItems: 'center'}}
                                // onPress={() => {
                                //   console.log(Moment(Date.now()).add(3, 'days').toDate());
                                //   var productcharacmodif = {
                                //     due_by: Moment(Date.now()).add(3, 'days').toDate(),
                                //     idTicket: this.ticket.getId()
                                //   };
                                  
                                  //ssModifyTicket(this.props.firebase, productcharacmodif);
                                  //this.setState( {showModalDrawnerPriority : false });
                                //}}
               >
                    <View style={{paddingLeft: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={setFont('200', 12)}>{this.ticket.getStatus().name}{'\n'}
                        <Text style={setFont('200', 9)}>#{this.ticket.getId()}</Text> </Text>
                    </View>
               </TouchableOpacity>  
               <View style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, marginLeft : 7, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialCommunityIcons name={"face-agent"} size={15} />
                    </View>
                    <View style={{paddingLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={setFont('200', 12)} numberOfLines={2}>{this.ticket.getAgentName()}</Text>
                    </View>
               </View>  
               <TouchableOpacity style={{flexDirection : 'column', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, marginLeft : 7, justifyContent: 'center', alignItems: 'flex-start'}}
                                  onPress={() => this.setState( {showModalDrawnerPriority : true })} 
               >
                    <View style={{marginLeft : 5}}>
                      <Text style={setFont('200', 10, 'gray')}>Priorité</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{height : 10, width: 10, borderRadius: 5, backgroundColor: this.ticket.getPriority().color, margin : 5, justifyContent: 'center', alignItems: 'center'}} />
                      <View style={{paddingLeft: 2, justifyContent: 'center', alignItems: 'center'}}>
                           <Text style={setFont('200', 12)}>{this.ticket.getPriority().name}</Text>
                      </View>
                    </View>
               </TouchableOpacity>  

          </View>
          <View style={{height : 100}} />           
      </ScrollView> 
    )
  }



  //////////////////////////////////
  //
  //   WHATSAPP
  //////////////////////////////////
  onSend=(messages = []) => {

    //createReply({ ticketId: 232, body: '<B>|Pierre via App|:</B> Je pense que j en veux.' }, 'undefined').then(val => {console.log(val)}).catch(err => {console.log(err)});
  
    var mess = {};
    //toto = this.ticket.getId();
    
    mess['ticketId'] = this.ticket.getId();
    mess['body'] = messages.length > 0 ? messages[0].text : '';
    //mess['from_email'] = this.props.authUser.email;
    mess['user_id'] = this.props.authUser.codeTS;
    //mess['replied_to'] = ['zlutsyuk@gmail.com'];
    mess['replied_to'] = 'zlutsyuk@gmail.com';
    
    //console.log(mess);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    createreply(this.props.firebase, mess)
    .then((data) => {
      console.log("SUCCES ENVOIE DU MESSAGE : " + mess['body']);
    })
    .catch(error => {
        console.log("Erreur ENVOIE DU MESSAGE : " + error);
    });
  }


  renderSend(props) {
        return (
          <Send {...props} containerStyle={{borderWidth: 0, marginRight: 15 , marginLeft : 10, justifyContent:'center', alignItems:'center'}}>
              <View style={{width : 35, height : 35, borderColor : 'white', borderWidth : 1, borderRadius : 18, backgroundColor : 'white', paddingLeft : 4, justifyContent:'center', alignItems:'center',}}>
                <MaterialCommunityIcons name='send' size={25} color={setColor('subscribeticket')}/>
              </View>
             
          </Send>
        );
  }
  renderInputToolbar (props, lineCount) {
    
    return (
      <InputToolbar {...props} containerStyle={{
                                  //marginLeft: 15,
                                  //marginRight: 15,
                                  //marginBottom: 5 + 35 * (lineCount-1),
                                  //marginTop: 5,
                                  borderWidth: 1,
                                  borderBottomWidth : 0, 
                                  borderColor: 'grey',
                                  
                                  //height: 35 * lineCount,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor : 'lightgray',
                                  //textAlignVertical: 'center'
                                }} 
      />
    );
  }



  renderComposer = props => {
    return <Composer {...props} textInputStyle={{textAlign: 'left', textAlignVertical :'center', backgroundColor : 'white', borderWidth : 1, marginTop : sizeByDevice(6,5,3) , borderRadius: 5, paddingTop :  sizeByDevice(9,8,0), paddingLeft : 15, marginRight : 15}}/>;
    // return (
    //   <View style={{flexDirection: 'row', borderWidth : 2, justifyContent: 'center', alignItems: 'center', backgroundColor :'yellow'}}>
    //     <Composer {...props} />
    //     <Ionicons name="md-camera" color="grey" />
    //     {/* <CustomImageButton />
    //     <CustomAttachButton /> */}
    //   </View>
    // );
  }


  
  renderBubble(props) {
      return ( 
         <Bubble {...props}  wrapperStyle={{left: {backgroundColor: 'white'}, right : {backgroundColor: setColor('granny')} }} />
      );
  }

  _renderFullScreenImage(url) {
      return (
        <Image style={{  flex : 1,resizeMode: 'contain',}}
        source={{ uri: url }}
  />
      );
  }


  renderCustomView(props) {
    //console.log(props.currentMessage)
    if (props.currentMessage.hasOwnProperty('attachments') && props.currentMessage['attachments'].length > 0) {
 
  
                let toto = props.currentMessage['attachments'].map((message, index) => {
                   if(message.content_type.indexOf('image') !== -1) {
                      return (
                        <Lightbox style={{ resizeMode: 'contain'}} 
                                  renderContent={() => this._renderFullScreenImage(message.attachment_url)}
                                  renderHeader={close => (
                                    <TouchableOpacity onPress={close} style={{marginTop : getConstant('statusBar'), marginRight : 20,  borderWith : 4, borderColor : 'red', alignItems : 'flex-end'}}>
                                      <MaterialCommunityIcons name='close' size={50} color='white' />
                                    </TouchableOpacity>
                                  )}
                                  key={index}
                        >
                            <Image style={{  width: 150, height: 100, borderRadius: 13, margin: 3,resizeMode: 'cover',}}
                                  source={{ uri: message.attachment_url }}
                            />
                        </Lightbox>
                        
                      );
                    } else {
                      let contentIcon = getContentTypeIcon(message.content_type);
                      return (
                        <TouchableOpacity key={index}
                                          onPress={() => {
                                            WebBrowser.openBrowserAsync(message.attachment_url, { enableBarCollapsing: true, showTitle: true });
                                          }}
                        >
                            <View style={{flexDirection : 'row', paddingLeft : 3, paddingTop : 3, paddingRight : 0, borderWidth :0, borderTopLeftRadius : index === 0 ? 15 : 0, borderTopRightRadius : index === 0 ? 15 : 0}} >
                              <View style={{borderWidth : 0, justifyContent: 'center', justifyContent : 'center'}}>
                                <MaterialCommunityIcons name={contentIcon} size={40} color={getContentTypeColor(message.content_type)}/>
                              </View>
                              <View style={{backgroundColor: 'lightgray', padding : 3, marginRight : 10}}>
                                <Text style={setFont('200', 10)} >{message.name} </Text>
                              </View>
                            </View>
                            <View style={{height : 70 , backgroundColor : 'orange'}}>
                               <WebView source={{uri: message.attachment_url}}  scalesPageToFit={true}/>
                            </View>
                        </TouchableOpacity>
                        
                      );
                    }
                });
               return toto;    
    
    }

    return null;
      
    //   let titi = '';
    //   props.currentMessage['attachments'].map((message, index) => {
    //     // return (
    //     //   <View key={index}>
    //     //     <Text>jshj</Text>
    //     //     </View>
    //     // );
    //     titi = titi.concat('<View><Text>Merde</Text></View>');
    //     console.log(message);
    // });
    //   return (
    //     <View style={{backgroundColor : 'green', borderTopLeftRadius : 15, borderTopRightRadius : 15}} >
    //      <Text> {titi} </Text>
    //     </View>
    //   );
  }



  _renderConversation() {
    return (
      <SafeAreaView style={{flex : 1, borderWidth : 0, backgroundColor: 'lightgray'}}>
          <View style={{borderWidth: 0, flex: 1, backgroundColor: 'whitesmoke'}}>
              <GiftedChat
                  messages={this.state.messages}
                  onSend={messages => this.onSend(messages)}
                  placeholder={"Tapez votre message ..."}
                  keyboardShouldPersistTaps={'never'}
                  //locale={'fr-fr'}
                  timeFormat={"HH:MM"}
                  dateFormat={'ll'}
                  //dateFormat={Moment.format('ll')}
                  user={{
                      _id: 1,
                    //  name : 'Manu MACRON'
                  }}
                  renderSend={this.renderSend}
                  renderInputToolbar={(props) => this.renderInputToolbar(props, this.state.linesInputCount)}
                  multiline={true}
                  renderAvatar={() => null}
                  showUserAvatar={false}
                  showAvatarForEveryMessage={true}
                  onInputTextChanged={(input) => {
                    let lines = input.split(/\r\n|\r|\n/);
                    //console.log(lines.length);
                    this.setState({ linesInputCount : lines.length});
                  }}
                  renderComposer={this.renderComposer}
                  renderUsernameOnMessage={true}
                  renderBubble={this.renderBubble}
                  renderCustomView={(props) => this.renderCustomView(props)}
                  //isCustomViewBottom={true}

              />
          </View>
        </SafeAreaView>

    );
  }

  //////////////////////////////////
  //        activity
  //////////////////////////////////
  _renderDetailActivity(rowData, sectionID, rowID) {
    //console.log("SECTIONID : " + sectionID);
    //creation de l'en tete et du body pouraactivté
    //l'en tete sera la premire ligne
    let textToSplit = (rowData.hasOwnProperty('body') && rowData.body !== '') ? rowData.body : ((rowData.hasOwnProperty('body_text') && rowData.body_text !== '') ? rowData.body_text : '');
    if (textToSplit !== '') { //il y a bien un text  que l'on vare traiter
        var breakIndex = rowData.body.indexOf("\n");
        let titleText = '';
        let bodyText = '';
        if (breakIndex !== -1){
          //console.log(textToSplit.substr(0, breakIndex));
          titleText = textToSplit.substr(0, breakIndex);
          titleText = titleText.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
          bodyText = textToSplit.substr(breakIndex, textToSplit.length);
        } else {
          titleText = textToSplit;
        }
        
        return (
          <View style={{flex:1, marginRight : 10, marginTop : -10, paddingBottom: 40}}>
            <Text style={setFont('400', 16, 'black', 'Bold')}>
              {titleText}{'\n'}
            </Text>
            {(bodyText !== '') 
                ? <HTML html={bodyText.replace('\\','')}  />
                : <Text style={setFont('400', 12, 'gray')}>{bodyText}</Text>
            }
          </View>
        );
    } else {
      return null;
    }
  }

  _renderTimeActivity(rowData, sectionID, rowID) {
    
    return (
      <View style={{width : getConstant('width')/4, marginLeft : 0.025*getConstant('width')}}>
          <View>
              <Text style={setFont('400', 14, 'black')}>
                  {Moment(rowData.created_at).format('lll')}
              </Text>
          </View>
          <View style={{marginTop : 5}}> 
               <Text style={setFont('200', 11)}>
                  {sectionID === -1 ? (this.props.authUser.firstName + ' ' + this.props.authUser.name) : null}
                </Text>
          </View>

      </View>
    )
  }

  _renderActivity() {

    return (
      <Timeline data={this.state.notes} 
                style={{flex: 1,marginTop:20}}
                circleSize={15}
                circleColor='red'
                lineColor='rgb(45,156,219)'
                timeContainerStyle={{minWidth:72, marginTop: -5, borderWidth: 1}}
                timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
                descriptionStyle={{color:'gray'}}
                options={{
                  style:{paddingTop:5
                  }
                }}
                innerCircle={'dot'}
                //onEventPress={this.onEventPress}
                renderDetail={(rowData, sectionID, rowID) => this._renderDetailActivity(rowData, sectionID, rowID)}
                renderTime={(rowData, sectionID, rowID) => this._renderTimeActivity(rowData, sectionID, rowID)}
                //renderCircle={this._renderCirclecAtivity}
                timeContainerStyle={{minWidth:72}}
                renderFullLine={true}
                //showTime={false}
      />
    )
  }

  _renderHeader =  props => (

        <TabBar
             // getLabelText={this._getLabelText}
              indicatorStyle={{    backgroundColor: setColor('')}}
              style={{ backgroundColor: setColor('background') , borderRadius : 0}}
              //labelStyle={setFont('300', 12)}
              renderLabel={({ route, focused }) => {
                switch(route.key) {
                  case 'DOCUME':
                    return <MaterialCommunityIcons name={'file-document-outline'} size={30} style={{color: focused ? 'black' : setColor('lightBlue')}}/>;  
                  default:
                    return  <View style={{borderWidth: 0, marginLeft : -10, marginRight : -10}}><Text style={[setFont('300', 14, focused ? 'black' : setColor(''), focused ? 'Regular': 'Light'),{textAlign: 'center'}]} numberOfLines={1}>{route.title}</Text></View>;
                }
              }}
              tabStyle={{flex: 1, width: getConstant('width')/(this.state.routes.length), justifyContent : 'center', alignItems : 'stretch', borderWidth : 0}}
              //tabStyle={{width:'auto'}}
              {...props}
        />

  );

  _renderScene = ({ route }) => {

    switch (route.key) {
      case 'ACTIVITY':
        return this._renderActivity();
      case 'CONVERSATION' :
        return this._renderConversation();
      case 'DETAIL':
         return this._renderDetail();
      default:
        return <View style={{padding: 10}}><Text>Aucun document</Text></View>;
    }
  };


  _handleIndexChange = index => {
    this.setState({
      currentTab: this.state.routes[index].key,
      index
    });
  }


  _renderModalDrawnerPriority () {
    return (
      <Modal  animationType="slide" transparent={true} visible={this.state.showModalDrawnerPriority}
              onRequestClose={() => {
              console.log('Modal has been closed');
            }}
      >
          <View 
              style={{flex:1, backgroundColor:'transparent'}} 
              onStartShouldSetResponder={() => true}
              onResponderRelease={(evt) =>{
                let x = evt.nativeEvent.pageX;
                let y = evt.nativeEvent.pageY;
                //si on a clické en dehors du module view cidessous on ferme le modal
                let verifX = x < getConstant('width')*0  || x > getConstant('width') ? true : false;
                let verifY = y < getConstant('height')*0.65  || y > getConstant('height') ? true : false;
                if (verifX || verifY) {
                  //console.log("passe la ");
                  this.setState({showModalDrawnerPriority : false})
                }
              }}
          >
            <View style={{ flexDirection: 'column',backgroundColor: 'white', borderWidth :0, borderColor : 'black', borderRadius:5,width: getConstant('width'), height: getConstant('height')*0.35, top:  getConstant('height')*0.65, left : getConstant('width')*0}}>
                <View style={{ marginTop : 15, justifyContent : 'center', alignItems: 'flex-start', paddingLeft : 15}}>
                        <Text style={setFont('200', 12, 'gray')}>
                            {String('priorité').toUpperCase()}
                        </Text>
                </View>
                {CTicket.PRIORITY().map((s,i) => {
                      
                      let isSelected = this.ticket.getPriority().id === s.id;
                      
                      return (
                        <TouchableOpacity style={{flexDirection : 'row', marginTop : 15}} key={i} 
                                          onPress={() => {
                                              if(!isSelected) {
                                                this.ticket.setPriority(s.id);
                                                var productcharacmodif = {
                                                  priority: s.id,
                                                  idTicket: this.ticket.getId()
                                                };
                                                
                                                ssModifyTicket(this.props.firebase, productcharacmodif);
                                                this.setState( {showModalDrawnerPriority : false });
                                              }
                                          }}
                        >
                              <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{borderWidth : 1, backgroundColor : s.color, borderColor : s.color, height : 8, width : 8, borderRadius : 4}} />
                              </View>
                              <View style={{flex : isSelected ? 0.7 : 0.9, justifyContent : 'center', alignItems: 'flex-start', paddingLeft : 15}}>
                                  <View style={{flexDirection: 'row'}}>
                                      <View>
                                          <Text style={setFont('200', 16, 'black', isSelected ? 'Bold' : 'Regular')}>
                                              {s.name}
                                          </Text>
                                      </View>
                                  </View>
                              </View>
                              {isSelected  
                                ?
                                    <View style={{flex: 0.2, justifyContent : 'center', alignItems: 'flex-start'}}>
                                      <MaterialCommunityIcons name='check' size={22} color={setColor('granny')}/>
                                    </View>
                                : null
                              }
                        </TouchableOpacity>
                      );
                    })
                }

            </View>
          </View>
      </Modal>
    );
  }



  render() { 
      let dataOptions = ['PRIORITY', 'PRODUCT', 'CANCEL'];

      return(
            <View style={{flex:1, flexDirection : 'column', height: getConstant('height'), opacity: (this.state.showModalDrawnerPriority || this.state.isLoading) ? 0.3 : 1}}> 
              
              <View style={{flexDirection : 'row', paddingLeft : 10, backgroundColor: setColor('granny'), paddingTop: isAndroid() ?  0 : getConstant('statusBar'), padding : 5, alignItems: 'flex-start',justifyContent: 'space-between'}}>
                      {this._renderModalDrawnerPriority()}
                      <TouchableOpacity style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-start', padding : 5}}
                                        onPress={() => this.props.navigation.goBack()}
                      >
                           <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/>
                      </TouchableOpacity>
                      <View style={{flex: 0.6, justifyContent: 'center', alignItems: 'center'}}>
                           <Text style={setFont('300', 16, 'white', 'Regular')}>{this.ticket.getWorkflowName()}</Text>
                           <Text style={setFont('300', 12, 'white' )}>{this.ticket.getType()} - {currencyFormatDE(this.ticket.getNominal())} {this.ticket.getCurrency()}</Text>
                           
                      </View>
                      <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.025*getConstant('width')}}>

                                  <ModalDropdown
                                                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                                //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                                dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                onSelect={(index, value) => {
                                                  switch(value) {
                                                    case 'PRIORITY' : 
                                                      this.setState({ showModalDrawnerPriority : true });
                                                      break;
                                                    case 'CANCEL' : 
                                                      console.log('CANCEL');
                                                      break;
                                                    deafult : break;
                                                  }
                                                }}
                                                adjustFrame={(f) => {
                                                  return {
                                                    width: getConstant('width')/2,
                                                    height: Math.min(getConstant('height')/3, dataOptions.length * 40),
                                                    left : f.left,
                                                    right : f.right,
                                                    top: f.top,
                                                  }
                                                }}
                                                renderRow={(option, index, isSelected) => {
                                                  switch(option) {
                                                    case 'PRIORITY' :
                                                          return (
                                                                  <View style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start', height: 40}}>
                                                                      <Text style={setFont('500', 14, 'black', 'Regular')}>Changer la priorité</Text>
                                                                  </View>
                                                          );
                                                    case 'PRODUCT' :
                                                          return (
                                                              <View style={{flexDirection : 'row', height: 40}}>
                                                                  <View style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                      <Text style={setFont('500', 14, 'black', 'Regular')}>Voir le produit</Text>
                                                                  </View>
                                                                  <TouchableOpacity style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}
                                                                                    onPress={() => {
                                                                                      //  this.setState({ searchSRP : !this.state.searchSRP });
                                                                                    }}
                                                                  >
                                                                      <FontAwesome name={"toggle-on"}  size={25} style={{color: 'black'}}/> 
                                                                  </TouchableOpacity>
                                                              </View>
                                                          );
                                                      case 'CANCEL' :
                                                        return (
                                                            <View style={{flexDirection : 'row', height: 40}}>
                                                                <View style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                   <Text style={setFont('500', 14, 'black', 'Regular')}>Annuler ma demande</Text>
                                                                </View>
                                                            </View>
                                                        );
                                                    default : 
                                                            return (
                                                              <View style={{paddingLeft : 4, paddingRight : 4, height: 40, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                <Text style={setFont('500', 16, 'gray', 'Regular')}>{option}</Text>
                                                              </View>
                                                          );
                                                  }
                      
                                                }}
                                                //defaultIndex={dataOptions.indexOf(this.autocallResult.getProductTypeName())}
                                                options={dataOptions}
                                                //ref={component => this._dropdown['options'] = component}
                                                disabled={false}
                              >
                                  <View style={{ borderWidth : 0, width : 0.1*getConstant('width'),  height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name={'dots-vertical'} size={30} style={{color: 'white'}}/>
                                  </View>
                              </ModalDropdown>
                      </View>
              </View>
              <View style={{ paddingRight : 10, paddingLeft : 10, paddingBottom : 10,backgroundColor: setColor('granny'), alignItems: 'center',justifyContent: 'center'}}>
                  <Text style={[setFont('300', 18, 'white' ), {textAlign:'center'}]}>{this.ticket.getSubject()}</Text>
              </View>
              <View style={{flex : 1, flexDirection : 'column', marginTop : 0, backgroundColor: 'white',borderWidth : 0}}>
                <TabView
                  navigationState={this.state}
                  onIndexChange={this._handleIndexChange}
                  renderScene={this._renderScene}
                  renderTabBar={this._renderHeader}
                  //renderTabBar={() => <View><Text>Merde</Text></View>}
                />
              </View>
                  
           </View>



      );
    }
}



//const condition = authUser => !!authUser;
const condition = authUser => authUser != null;
const composedFLTicketDetail = compose(
 // withAuthorization(condition),
  withNavigation,
  withFirebase,
  withUser,
  //withNotification
);

//export default HomeScreen;
export default hoistStatics(composedFLTicketDetail)(FLTicketDetail);



