import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, Alert, Platform, Image, Modal, KeyboardAvoidingView, Keyboard, TextInput, TouchableWithoutFeedback, PanResponder, Animated, FlatList } from 'react-native';
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

import { getBroadcastAmount, ssModifyTicket, getConversation, getConversations, getTicket, createreply, getRepricing, getProduct} from '../../../API/APIAWS';

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
import { FLDetailBroadcastPSSubscripter } from './FLDetailBroadcastPSSubscripter';
import { FLChat } from './FLChat';

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant, getContentTypeIcon, getContentTypeColor, niceBytes } from '../../../Utils';

import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import HTMLView from 'react-native-htmlview';
import * as WebBrowser from 'expo-web-browser';

import * as TEMPLATE_TYPE from '../../../constants/template';

import FLModalDropdown from '../FLModalDropdown';

import { CAutocall2 } from '../../../Classes/Products/CAutocall2';

import { ScrollView } from 'react-native-gesture-handler';
import { CTicket } from '../../../Classes/Tickets/CTicket';

import Robot from "../../../assets/svg/robotBlink.svg";
import { CWorkflowTicket } from '../../../Classes/Tickets/CWorkflowTicket';
import { CSouscriptionTicket } from '../../../Classes/Tickets/CSouscriptionTicket';
import { CUser } from '../../../Classes/CUser';
import { FLUF } from "../Autocall/FLUF";
import { CFollowedTicket } from '../../../Classes/Tickets/CFollowedTicket';




class FLTicketDetail extends React.Component {
    
  constructor(props) {
    super(props);


    //this.ticket= this.props.ticket;
    this.ticket =  this.props.navigation.getParam('ticket');
    
    
    this.autocall = null;
    //console.log("Constructeur ticket");
    this.props._removeToast();
    this.state = {

      nominal :  this.ticket.getNominal(),
      finalNominal :  this.ticket.getNominal(),


      //messages des conversations
      linesInputCount : 1,
      messages : [],
      isConversationLoading : false, 

      //gestion du clavier
      keyboardHeight: 0,
      isKeyboardVisible: false,

      //modal
      showModalDrawnerPriority : false,

      //gestion des conversations et notes
      notes : [],
      chat : [],
      files : [],

      //timer de reponses aux offres
      timers : [0, 0, 0],
      timerFirsDueBy : 0,
      
      //handle files
      categoryFilesToShow : 'TOUS',

      isLoading : true,
    
      //pour les tickets paratagés
      subscripters : [],

      //gestion des tabs
      index: 0,
      routes: [
        { key: 'DETAIL', title: 'Détail' },
        { key: 'CONVERSATION', title: this.ticket.isShared ? 'Conversations' : 'Conversation' },
        { key: 'ACTIVITY', title: 'Activité' },
        { key: 'DOCUMENTS', title: 'Docs' },
        //{ key: 'TEST', title: 'Test' },
	  ],

	  hasSpoken : false,
	  

    }

    // console.log(Moment(new Date(1590938100000)).format('llll'));

    ///timers
    this.intervalTimer = [null, null, null];
    this.intervalTimerFirstDueBy = null;
    this.nbOfIssuerResponses = 0;


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);

   //shared amount 
   this.sharedAmount = 0;

    //supression du menu bas
   this.props.navigation.setParams({ hideBottomTabBar : true });


  }

  static navigationOptions = ({ navigation }) => {

    return ({
		headerShown : false
    }
    );
}
  // compopnentdidmount
  async componentDidMount() {



    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
		//StatusBar.setBarStyle(Platform.OS === 'Android' ? 'light-content' : 'dark-content');
		StatusBar.setBarStyle('light-content');
      });
    }



    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

    //chargement du produit structuré
    var productJSON = await getProduct(this.props.firebase, this.ticket.getProductCode());
    this.autocall = new CAutocall2(productJSON);
    this.ticket.setProduct(this.autocall);


    //chargement des conversations
    await this._loadTicket();

    

    //on specifie que le ticket est lu
    this.props.removeNotification('TICKET', this.ticket.isShared() ? this.ticket.getSouscriptionId() : this.ticket.getId());
    this.props.setCurrentFocusedObject('TICKET', this.ticket.isShared() ? this.ticket.getSouscriptionId() : this.ticket.getId());

    //va directement sur l'onglet necessaire
    var tabToGo = this.props.navigation.getParam('tab', 0);
    if (tabToGo !== 0) {
      this.setState({
        currentTab: this.state.routes[tabToGo].key,
        index : tabToGo
        });
    }

  }

  //component rcceved props
  UNSAFE_componentWillReceiveProps(props) {
    //console.log("RECEPTION DES PROPS TICKETS : " + props.allNotificationsCount );
    //quelque chose a bougé sur le ticket on verifie s'il a été notifié
    console.log("EST NOTIFIE : " + this.props.isNotified('TICKET', this.ticket.getId()));
    //console.log("CSouscriptionTicket :" +(this.ticket instanceof CSouscriptionTicket));
    if (this.props.isNotified('TICKET', this.ticket.isShared() ? this.ticket.getSouscriptionId() : this.ticket.getId())) {
      //on recharhge les tickets et les coversations
      this._loadTicket();
    }
  }

  //le ticket est rechargé ainsi que les conversations
  _loadTicket=() => {
    console.log("RECHARGE LE TICKET ");
      return new Promise((resolve, reject) => {
          //this.setState({ isLoading : true });
          let idTicketToReload = this.ticket.isShared() ? this.ticket.getSouscriptionId() : this.ticket.getId();
          getTicket(this.props.firebase, idTicketToReload)
          .then((ticket) => {

              console.log("load ticket : isShared : "+ this.ticket.isShared());
              if (this.ticket.isShared()) {
                  getBroadcastAmount(this.props.firebase, this.ticket.getBroadcastId())
                  .then((subscripters) => {
                    // console.log("RECUPERE LES SUBSCRIPTERS");
                    //console.log(subscripters);
                    this.sharedAmount = (subscripters === null || subscripters === 'undefined' || !subscripters.hasOwnProperty('subscription')) ? 0 : subscripters.subscription.reduce((a, b) => a + b, 0);
                    this.setState({ subscripters}, () => {
                      this._processUptadedTicket(ticket);
                      this.ticket.setSubscripters(subscripters);
                      //console.log(subscripters);
                      resolve("ok");
                    });
                  })
                  .catch((error) => {
                    console.log("getBroadcastAmount : "+ error);
                  });
              } else {
                this._processUptadedTicket(ticket);
                resolve("ok");
              }
          })
          .catch((error) => {
            console.log("Erreur getTicket #" + idTicketToReload + "  : "  + error);
            alert("Impossible de récupérer les changements du ticket ");
            this.setState({ isLoading : false });
            reject(error);
          });

     });

  }

  _processUptadedTicket(ticket) {
			//console.log(ticket);
			// let t = new CWorkflowTicket(ticket);
			// this.ticket.setObject(t.getObject());
			let isShared = this.ticket.isShared();
			// console.log("process ticket : isShared : "+ isShared);
			if (this.ticket.isFollowed()) {
				this.ticket = new CFollowedTicket(ticket);
			} else {
				this.ticket = isShared ? new CSouscriptionTicket(ticket) :  new CWorkflowTicket(ticket);
				this.ticket.setProduct(this.autocall);
				this.dealineTicket = Moment(this.ticket.getFrDueBy()).fromNow();
				

			}
			//on supprime la notification
			this.props.removeNotification('TICKET', this.ticket.isShared() ? this.ticket.getSouscriptionId() : this.ticket.getId());
			//isShared ? this._updateConversations() : this._updateConversation();
			this.setState({ isLoading : false });
			this._updateConversations();

			if (!this.ticket.isFollowed()) {
				this.initializeTimers();
			}
              
  }

  //////////////////////////////////
  //
  //    TIMERS
  //////////////////////////////////
  initializeTimers() {
    this.intervalTimer = [null, null, null];
    this.nbOfIssuerResponses = this.ticket.getQuoteRequestsIssuersCount();
    switch(this.ticket.getCurrentCodeStep()){
      case 'PPACO' :
            //console.log(Object.keys(this.ticket.getObject().data.quoteRequest));

            for (let i = 0; i < this.nbOfIssuerResponses; i++) {
              let timers = this.state.timers;
              let newTimers = this.state.timers;
              //recuperer le nombre de secondes qu'il reste

              let secondsToExpity = 0;
              let expiry = this.ticket.getResponseIssuer('responseIssuersExpiryDate', i);
             
              if (expiry !== 0) {
                let maintenant = new Date(Date.now());
                let s = (new Date(expiry)).getTime() - maintenant.getTime();
                //console.log("SECONDES : " + s);
                secondsToExpity = Math.round(Math.max(s/1000,0));
                //console.log("Seconde entre les 2 : "+secondsToExpity);
              }

              
              newTimers[i] = secondsToExpity;
              this.setState({timers : newTimers }, () => {
                this.setTimer(0);
              });
            }

            break;
      default : break;
    }

    //oblige a rafraichir toute les minutes pour remise a jour du first due by
    this.intervalTimerFirstDueBy = setInterval( 
      () => {
        this.setState({ timerFirsDueBy: this.state.timerFirsDueBy + 1 });
      },
      60000
    );
  }

  //remets les timers des offres a jour
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
    this.dealineTicket = Moment(this.ticket.getFrDueBy()).fromNow();
    if(this.intervalTimer[0] != null && this.state.timers[0] === 1){ 
      clearInterval(this.intervalTimer[0]);

    }
    if(this.intervalTimer[1] != null && this.state.timers[1] === 1){ 
      clearInterval(this.intervalTimer[1]);
    }
    if(this.intervalTimer[2] != null && this.state.timers[2] === 1){ 
      clearInterval(this.intervalTimer[1]);
    }
  }

  componentWillUnmount() {

    //on cleare les countdowns
    // this.intervalTimer[0] != null ? clearInterval(this.intervalTimer[0]) : null;
    // this.intervalTimer[1] != null ? clearInterval(this.intervalTimer[1]) : null;
    // this.intervalTimer[2] != null ? clearInterval(this.intervalTimer[2]) : null;
    // this.intervalTimer[0] = null;
    // this.intervalTimer[1] = null;
    // this.intervalTimer[2]= null;
    // this.intervalTimerFirstDueBy = null;
	console.log("componentWillUnmount 1");
    clearInterval(this.intervalTimer[0]);
    clearInterval(this.intervalTimer[1]);
    clearInterval(this.intervalTimer[2]);
    clearInterval(this.intervalTimerFirstDueBy);
	console.log("componentWillUnmount 2");
    //on enleve le focus sur ticket
    this.props.setCurrentFocusedObject('', '');
	console.log("componentWillUnmount 3");
    if (!isAndroid()) {
      this._navListener.remove();
    }
    Keyboard.removeListener('keyboardDidShow');
	Keyboard.removeListener('keyboardDidHide');
	console.log("componentWillUnmount 4");
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
  _updateConversations() {
    //determination de tous les tickets 
    let ticketsConvToRetreive = [];
    ticketsConvToRetreive.push(this.ticket.getId());
    if (this.ticket.isShared()) {
        ticketsConvToRetreive.push(this.ticket.getBroadcastId());
        //console.log("C'EST MON TICKET : "+ this.ticket.isMine(this.props.user));
        if (this.ticket.isMine(this.props.user)) {
          if (this.state.subscripters.hasOwnProperty('idTicket')) {
            ticketsConvToRetreive = ticketsConvToRetreive.concat(this.state.subscripters['idTicket']);
            let i =  ticketsConvToRetreive.indexOf(this.ticket.getSouscriptionId());
            if (i > -1) { //on supprime les conversations de son propre ticket de souscription si on en est à l'origine
              ticketsConvToRetreive.splice(i, 1);
            }
          }
        } else { //ce n'est pas mon ticket il faut juste ajouter la conversation du ticket de souscription
          ticketsConvToRetreive = ticketsConvToRetreive.concat(this.ticket.getSouscriptionId());
        }
    }
    //console.log(ticketsConvToRetreive);
    //on demande toutes conversations
    this.setState({ isConversationLoading : true });
    getConversations(this.props.firebase, ticketsConvToRetreive)
    .then((data) => {
      //on enregistres toutes les conversations
      let allConversations = [];
      ticketsConvToRetreive.map((t, index) => {
        let conv = {};
        conv['id'] = t;
        if (index === 0) {
          conv['type'] = 'TICKET_PRODUCT';
          conv['mandatoryForNotes'] = true;
          conv['rw'] = this.ticket.isMine(this.props.user);
        } else if (index === 1) {
          conv['type'] = 'TICKET_BROADCAST';
          conv['mandatoryForNotes'] = this.ticket.isMine(this.props.user);
          conv['rw'] = true;
        } else {
          //if (this.state.subscripters.hasOwnProperty(''))
          conv['type'] = 'TICKET_SOUSCRIPTION';
          conv['mandatoryForNotes'] = !this.ticket.isMine(this.props.user);
          conv['rw'] = true;

          //recherche dans les susbcripters le numero de ticket
          let i = -1;
          if (this.state.subscripters.hasOwnProperty('idTicket')) {
            i =  this.state.subscripters['idTicket'].indexOf(t);
            if (i > -1) {
              if (this.ticket.isMine(this.props.user)) {
                conv['userInfo'] = this.state.subscripters.user[i].userInfo;
                conv['userOrg'] = this.state.subscripters.user[i].userOrg;
              } else { // ce ticket n'est pas à moi on met le profil du requester
                conv['userInfo'] = this.ticket.getRequester();
                conv['userOrg'] = this.ticket.getRequesterOrg();
              }
            }
          }
         
        }    

        conv['conversation'] = data[index];
        //console.log(conv);
        allConversations.push(conv);

      })
      //console.log("AVANT TICKET setConversations");
      this.ticket.setConversations(allConversations);
      this.setState({ files : this.ticket.getFiles(), notes : this.ticket.getNotes(),  messages : allConversations, isLoading : false , isConversationLoading : false });//, () => console.log("NBRE DE NOTES : " + this.state.notes.length));
      
    })
    .catch(error => {
      console.log("ERREUR recupération conversations : " + error);
      alert('Erreur : ' + error);
      this.setState({ isLoading : false, isConversationLoading : false });
    }) 
  }


  async _updateConversation() {
    //chargement de la conversation
    this.setState({ isLoading : true });
    getConversation(this.props.firebase, this.ticket.getId())
    .then((data) => {

      this.ticket.setConversations(data);

      //met au bon format les conversations whatsapp
      let wa = [];//this.ticket.getChat();
      let messages = [];
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
      this.setState({ files : this.ticket.getFiles(), notes : this.ticket.getNotes(), chat : wa,  messages, isLoading : false });//, () => console.log("NBRE DE NOTES : " + this.state.notes.length));
      
    })
    .catch(error => {
      console.log("ERREUR recupération conversation : " + error);
      alert('Erreur : ' + error);
      this.setState({ isLoading : false });
    }) 

  }



  /////////////////////////////////////////////////////////
  //
  //         SPECIFIC STEP
  //si on est a une etape particulier : design particulier

  _renderEmptyIssuerTemplate(index) {
    return (
      <View style={{flex : 0.33, flexDirection : 'column', borderWidth : 1, borderRadius : 5, margin : 3, backgroundColor: setColor('background')}} key={index}>
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
  _renderSpecificStep() {
      let issuers = Array(3).fill().map((_, index) => ({id: index}));

      //on verifie si tout les prix sont time out
      let timers = this.state.timers;
      let allTimeout = true;
      timers.map((t, index) => {
        //console.log("Timer "+ index + " : " +t);
        if (t > 0) {
          allTimeout = false;
        }
      })
      switch(this.ticket.getCurrentCodeStep()){
        case 'PPDCC' :
          return (
            <View style={{flexDirection : 'row', borderWidth : 0, width : 0.95*getConstant('width'), height : 200}}>
              {
                  issuers.map((issuer, index) => {
                          return this._renderEmptyIssuerTemplate(index);
                  })
              }
            </View>
          );
          break;
        case 'PPACO' :           
              //console.log(this.ticket);
              if (!allTimeout) {
                  return (
                    <View style={{flexDirection : 'row', borderWidth : 0, width : 0.95*getConstant('width'), height : 200}}>
                      {
                          issuers.map((issuer, index) => {
                              if (this.nbOfIssuerResponses > index  ) { //reponse recue
                                //this.ticket.getResponseIssuerCode(index)
                                // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).format('llll'));
                                // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).fromNow());
                                // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).toDate());
                                let quote = this.ticket.getResponseIssuer('responseIssuersQuote', index);
                                quote == null ? quote = 0 : quote = quote.quote;

                                let isPriceProcessing = this.ticket.isIssuerProcessing(index);
                                return (
                                    <View style={{flex : 0.33, flexDirection : 'column', borderWidth : 1, borderRadius : 5, margin : 3, backgroundColor: this.state.timers[index] > 1 ? 'white' : setColor('background')}} key={index}>
                                        <View style={{flex : 0.5, borderWidth : 0, justifyContent : 'flex-start', alignItems : 'flex-start', margin : 2}}>
                                          <Image style={{width: 0.95*getConstant('width')/3 - 20, height : 50}} source={{uri : this.ticket.getIssuerIcon(this.props.issuers, index)}} resizeMode={'contain'}/>
                                        </View>
                                        <View style={{flex : 0.35, borderWidth : 0, alignItems: 'center', justifyContent: 'center', marginTop : 3}}>
                                            <Text style={[setFont('400', 26, 'green', this.state.timers[index] > 1 ? 'Bold' : 'Light'), {textAlign : 'center', textAlignVertical : 'center'}]}>
                                              {Numeral(quote/100).format('0.00%')}{'\n'}
                                              <Text style={[setFont('400', 10, 'gray'), {textAlign : 'center', textAlignVertical : 'center'}]}>Term-sheet</Text>
                                            </Text>
                                        </View>
                                        <TouchableOpacity style={{flex : 0.15,  margin : 10, backgroundColor: this.state.timers[index] > 1  ? setColor('subscribeBlue') : isPriceProcessing ? 'gray' : setColor('granny'), borderWidth : isPriceProcessing ? 0 : 1, borderColor: this.state.timers[index] > 1  ? setColor('subscribeBlue') : setColor('granny'), alignItems: 'center', justifyContent : 'center'}}
                                                          onPress={() => {
                                                                if(!this.ticket.isClosed()) {
                                                                      if (this.state.timers[index] > 1 ){
                                                                        alert('On traîte');
                                                                      } else {
                                                                        //console.log( this.ticket.getResponseIssuerCode(index));
                                                                          if (!isPriceProcessing)  {
                                                                            this.setState({ isLoading : true });
                                                                            getRepricing(this.props.firebase, this.ticket.getId(), this.ticket.getIssuerCode(index))
                                                                            .then((ticket) => {
                                                                              console.log("TICKET RECU : ");
                                                                              console.log(ticket);
                                                                                this._processUptadedTicket(ticket);
                                                                                this.setState({ isLoading : false });
                                                                            })
                                                                            .catch((error) => {
                                                                                alert('Impossible de rafraichir le prix');
                                                                                this.setState({ isLoading : false });
                                                                            });
                                                                          }
                                                                      }
                                                                } else {
                                                                  alert("Demande clôturée")
                                                                }
                                                          }}
                                                          activeOpacity={isPriceProcessing ? 1 : 0.2}
                                        >
                                            <Text style={setFont('400', this.state.timers[index] > 1 ? 16 : 12 , 'white', 'Regular')}> 
                                              {this.state.timers[index] > 1 
                                              ? 'TRAITER'
                                              : isPriceProcessing ? 'EN COURS' : 'RAFRAÎCHIR'
                                              }
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={{padding: 5, borderWidth : 0, justifyContent: 'center', alignItems : 'center'}}>
                                          <Text style={{fontSize : 13, textAlign : 'center'}}>
                                            { this.state.timers[index] > 1
                                              ?
                                            ('0'+Math.floor(this.state.timers[index]/3600) % 24).slice(-2)+':'+('0'+Math.floor(this.state.timers[index]/60)%60).slice(-2)+':'+('0' + this.state.timers[index] % 60).slice(-2)
                                              : isPriceProcessing ? 'prix re-demandé' : 'prix échu'
                                            }
                                          
                                          </Text>
                                        </View>
                                    </View>
                                );
                              } else { //réponse non reçue
                                  return this._renderEmptyIssuerTemplate(index);
                              }

                          })
                      }
                        
                    </View>
                  );
              } else { //tous les prix sont echues 
                  return (
                    <View>
                        <View style={{flexDirection : 'row', borderWidth : 0, width : 0.95*getConstant('width'), height : 200}}>
                          {
                              issuers.map((issuer, index) => {
                                  if (this.nbOfIssuerResponses > index  ) { //reponse recue
                                    //this.ticket.getResponseIssuerCode(index)
                                    // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).format('llll'));
                                    // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).fromNow());
                                    // console.log(Moment(this.ticket.getResponseIssuerExpiryDate(index)).toDate());
                                    let quote = this.ticket.getResponseIssuer('responseIssuersQuote', index);
                                    quote == null ? quote = 0 : quote = quote.quote;

                                    
                                    return (
                                        <View style={{flex : 0.33, flexDirection : 'column', borderWidth : 1, borderRadius : 5, margin : 3, backgroundColor: this.state.timers[index] > 1 ? 'white' : setColor('background')}} key={index}>
                                            <View style={{flex : 0.5, borderWidth : 0, justifyContent : 'flex-start', alignItems : 'flex-start', margin : 2}}>
                                              <Image style={{width: 0.95*getConstant('width')/3 - 20, height : 50}} source={{uri : this.ticket.getIssuerIcon(this.props.issuers, index)}} resizeMode={'contain'}/>
                                            </View>
                                            <View style={{flex : 0.35, borderWidth : 0, alignItems: 'center', justifyContent: 'center', marginTop : 3}}>
                                                <Text style={[setFont('400', 26, 'green', this.state.timers[index] > 1 ? 'Bold' : 'Light'), {textAlign : 'center', textAlignVertical : 'center'}]}>
                                                  {Numeral(quote/100).format('0.00%')}{'\n'}
                                                  <Text style={[setFont('400', 10, 'gray'), {textAlign : 'center', textAlignVertical : 'center'}]}>Term-sheet</Text>
                                                </Text>
                                            </View>
                                            <View style={{flex : 0.15,  margin : 10, backgroundColor: 'gray' , alignItems: 'center', justifyContent : 'center'}}>
                                                <Text style={setFont('400', this.state.timers[index] > 1 ? 16 : 12 , 'white', 'Regular')}> 
                                                    ECHU
                                                </Text>
                                            </View>
                                            <View style={{padding: 5, borderWidth : 0, justifyContent: 'center', alignItems : 'center'}}>
                                              <Text style={[setFont('300', 12, 'gray') , {textAlign : 'center'}]}>
                                                  {Moment(new Date(this.ticket.getResponseIssuer('responseIssuersExpiryDate', index))).fromNow()}
                                              </Text>
                                            </View>
                                        </View>
                                    );
                                  } else { //réponse non reçue
                                      return this._renderEmptyIssuerTemplate(index);
                                  }

                              })
                          }
                        </View>
                        <TouchableOpacity style={{margin : 10,padding : 10,  backgroundColor: setColor('subscribeBlue'), borderWidth : 1, borderColor: setColor('subscribeBlue'), borderRadius : 10, alignItems: 'center', justifyContent : 'center'}}
                                          onPress={() => {
                                            if(!this.ticket.isClosed()) {
                                                  this.setState({ isLoading : true });
                                                  getRepricing(this.props.firebase, this.ticket.getId(), 'ALL')
                                                  .then((ticket) => {
                                                    console.log("TICKET RECU : ");
                                                    console.log(ticket);
                                                    this._processUptadedTicket(ticket);
                                                    this.setState({ isLoading : false });
                                                  })
                                                .catch((error) => {
                                                    alert('Impossible de rafraichir le prix');
                                                    this.setState({ isLoading : false });
                                                });
                                            } else {
                                              alert("Demande clôturée");
                                            }
                                          }}
                        >
                            <Text style={setFont('400', 18 , 'white', 'Regular')}> 
                                {String('rafraichir les prix').toUpperCase()}
                            </Text>
                        </TouchableOpacity>                 
                      </View>
                  );
              }
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
          <View style={{flexDirection: 'row', borderWidth : 0, justifyContent : 'flex-start', alignItems : 'flex-start', paddingLeft : 0.025*getConstant('width'), paddingRight : 0.025*getConstant('width')}}>
                <View style={{flex : 0.6, justifyContent: 'center', alignItems: 'flex-start', borderWidth : 0, marginRight : 5}}>
                  <Text style={setFont('500', 18, 'black', 'Regular')}>{this.ticket.getDescription()}</Text>
                </View>
      
                <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-end', borderWidth : 0,backgroundColor: 'white'}}>
                
                  {     this.ticket.getFrDueBy() > Date.now()
                        ?
                                    <View style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 0, backgroundColor: setColor('subscribeticket'), padding : 5}}>
                                        <Text style={[setFont('200', 14, 'white'),{textAlign: 'center'}]}>Deadline : {this.dealineTicket}</Text>
                                    </View>
                        : 
                                    <View style={{backgroundColor: 'red',  alignItems: 'center', justifyContent: 'center', borderWidth: 0, padding : 5}}>
                                        <Text style={[setFont('300', 14, 'white', 'Bold'), {textAlign: 'center'}]}>En retard</Text>
                                    </View>
                  }
                  
                </View>
          </View>
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderWidth : 0, paddingRight : 0.025*getConstant('width'),paddingLeft : 0.025*getConstant('width'), marginTop : 20, backgroundColor: 'white'}}>
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
          <View style={{width : 0.95*getConstant('width'), borderWidth : 0, justifyContent : 'center', marginLeft : 0.025*getConstant('width'), marginTop : 10}}>
            <FLUF   isEditable={false} 
                    UF={this.ticket.getUF()}
                    UFAssoc={this.ticket.getUFAssoc()}
                    nominal={this.ticket.getNominal()}
                    currency={this.ticket.getCurrency()}
                    company={this.props.user.getCompany()}
                    updateProduct={(id, value, valueLabel) => {
                        //(id === 'UF') ? setUF(value) : setUFAssoc(value);
                    }} 
                    locked={true}
                    showSlider={false}
            />
          </View>
          {this.autocall != null
           ?   <TouchableOpacity style={{alignItems: 'center', marginTop : 20, borderWidth : 0, borderColor : 'black', borderRadius : 5, width : getConstant('width')*0.95, marginLeft : 0.025*getConstant('width')}}
                                onPress={() => {
                                  
                                  //this.autocall.setFinalNominal(this.ticket.getNominal());
                                  this.props.navigation.navigate('FLAutocallDetail' , {
                                    autocall: this.autocall,
                                    isEditable : false,
                                    //ticketType: TICKET_TYPE.PSCREATION
                                  })
                                }}
                >
                    <FLTemplateAutocall autocall={this.autocall} screenWidth={0.95} templateType={TEMPLATE_TYPE.AUTOCALL_TICKET_TEMPLATE} isEditable={false} showUF={false} nominal={this.ticket.getNominal()} />
                </TouchableOpacity>
            : null
          }
        {this._renderFooter()}
        <View style={{height : 100}} />           
      </ScrollView> 
    )
  }


  /**
   * render footeer of detail ticket
   */
  _renderFooter() {
    return (
      <View style={{flexDirection : 'row', justifyContent: 'flex-start', alignItems: 'stretch', borderWidth : 0, paddingLeft : 0.025*getConstant('width'), marginTop : 30,}}>
          <View style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={setFont('200', 10, 'gray')}>Création{'\n'}
                    <Text style={setFont('200', 12)}>{Moment(this.ticket.getCreationDate()).format('DD/MM/YY hh:mm')}</Text></Text>
          </View> 
          <TouchableOpacity style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, marginLeft : 7, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {
                              console.log(Moment(Date.now()).add(5, 'minutes').toDate());
                              var productcharacmodif = {
                                fr_due_by: Moment(Date.now()).add(5, 'minutes').toDate(),
                                idTicket: this.ticket.getId()
                              };
                              
                              ssModifyTicket(this.props.firebase, productcharacmodif);
                              this.setState( {showModalDrawnerPriority : false });
                            }}
          >
                <View style={{paddingLeft: 5, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={setFont('200', 12)}>{this.ticket.getStatusName()}{'\n'}
                    <Text style={setFont('200', 9)}>#{this.ticket.getId()}</Text> </Text>
                </View>
          </TouchableOpacity>  
          {/* <View style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, marginLeft : 7, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <MaterialCommunityIcons name={"face-agent"} size={15} />
                </View>
                <View style={{paddingLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={setFont('200', 12)} numberOfLines={2}>{this.ticket.getAgentName()}</Text>
                </View>
          </View>   */}
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

    );
  }

  //////////////////////////////////
  //
  //   WHATSAPP
  //////////////////////////////////
  onSend=(messages = []) => {

    //createReply({ ticketId: 232, body: '<B>|Pierre via App|:</B> Je pense que j en veux.' }, 'undefined').then(val => {console.log(val)}).catch(err => {console.log(err)});
  
    var mess = {};

    
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
                                <MaterialCommunityIcons name={contentIcon} size={35} color={getContentTypeColor(message.content_type)}/>
                              </View>
                              <View style={{backgroundColor: 'lightgray', padding : 3, marginRight : 10, marginBottom : 3}}>
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
                  //messages={this.state.messages}
                  messages={[]}
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
    // if (textToSplit !== '') { //il y a bien un text  que l'on vare traiter
    //     var breakIndex = rowData.body.indexOf("\n");
    //     if (breakIndex === -1) { breakIndex = textToSplit.indexOf('<br>')}
    //     console.log("break index : " + breakIndex);
    //     let titleText = '';
    //     let bodyText = '';
    //     if (breakIndex !== -1){
    //       //console.log(textToSplit.substr(0, breakIndex));
    //       titleText = textToSplit.substr(0, breakIndex);
    //       titleText = titleText.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
    //       bodyText = textToSplit.substr(breakIndex, textToSplit.length);
    //     } else {
    //       titleText = textToSplit;
    //     }
        
    //     return (
    //       <View style={{flex:1, marginRight : 10, marginTop : -10, paddingBottom: 40}}>
    //         <Text style={setFont('400', 16, 'black', 'Bold')}>
    //           {titleText}{'\n'}
    //         </Text>
    //         {(bodyText !== '') 
    //             ? <HTML html={bodyText.replace('\\','')}  />
    //             : <Text style={setFont('400', 12, 'gray')}>{bodyText}</Text>
    //         }
    //       </View>
    //     );
    // } else {
    //   return null;
    // }
    
         return (
           
          <View style={{flex:1, marginRight : 10, marginTop : -10, paddingBottom: 40}}>
              <HTMLView
                value={"<div>" + textToSplit.replace('\\','') + "</div>"}
              />
                 {/* <HTML html={textToSplit.replace('\\','')}  /> */}
          </View>
        );
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


  //////////////////////////////////
  //        documents
  //////////////////////////////////
  _renderDocuments() {
    
    let distinctFilesClassification = [...new Set(this.state.files.map(x => x.type)) ];
    distinctFilesClassification.unshift('TOUS');
    let filesToShow = this.state.files;
    if (this.state.categoryFilesToShow !== 'TOUS'){
      filesToShow = this.state.files.filter(({ type }) => type === this.state.categoryFilesToShow);
    }
    
    
   
    //console.log(toto);
    return (
      <View style={{flex : 1}}>
          <View style={{height : 30, justifyContent: 'center', marginTop : 15}}>
                <FlatList
                    //style={styles.wrapper}
                    //scrollTo={this.state.scrollTo}
                    contentContainerStyle={{marginLeft : 0.025*getConstant('width')}}
                    data={distinctFilesClassification}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                          
                          return (
                            <TouchableOpacity style={{borderWidth : this.state.categoryFilesToShow === item ? 0 : 1, marginRight : 10, paddingLeft : 10, paddingRight : 10, alignItems: 'center', justifyContent : 'center', borderRadius : 15, backgroundColor : this.state.categoryFilesToShow === item ? 'gray' : 'white'}}
                                              onPress={() => {
                                                //console.log(item);
                                                this.setState({ categoryFilesToShow : item });
											  }}
											  //key={item}
                            >
                              <Text style={setFont('300', 12, this.state.categoryFilesToShow === item ? 'white' : 'black', this.state.categoryFilesToShow === item ? 'Bold' : 'Regular')}>{item}</Text>
                            </TouchableOpacity>
                          );
     
                    }}
                    //tabRoute={this.props.route.key}
                    keyExtractor={(item) => item}
                  />
          </View>
          <View style={{flex : 1, justifyContent: 'center'}}>
                <View style={{height : 10, borderBottomWidth : 0, borderBottomColor : 'lightgray'}} />
                <FlatList
                    style={{marginTop : 0}}
                    //scrollTo={this.state.scrollTo}
                    contentContainerStyle={{}}
                    data={filesToShow}
                    renderItem={({ item, index }) => {
                            
                            let contentIcon = getContentTypeIcon(item.content_type);
                            return (
                              <TouchableOpacity style={{flexDirection : 'row', height : 60}}
                                                onPress={() => {
                                                  WebBrowser.openBrowserAsync(item.attachment_url, { enableBarCollapsing: true, showTitle: true });
                                                }}
                              >
                           
                                    <View style={{ borderWidth : 0, justifyContent: 'center', justifyContent : 'center', padding : 5}}>
                                      { item.content_type.indexOf('image') !== -1
                                        ?
                                        <Image  style={{  width: 50, height: 50, borderRadius: 8, resizeMode: 'cover',}}
                                                source={{ uri: item.attachment_url }}
                                        />
                                        : 
                                          <MaterialCommunityIcons name={contentIcon} size={50} color={getContentTypeColor(item.content_type)}/>
                                      }
                                    </View>
                                    <View style={{flex : 1, marginLeft : 15, paddingRight : 0.025*getConstant('width')}}>
                                      <View style={{flex : 0.5, justifyContent : 'flex-end', alignItems: 'flex-start', paddingBottom : 5}}>
                                          <Text style={setFont('200', 14, 'black', 'Regular')} >{item.name.substr(0, item.name.lastIndexOf('.'))} </Text>
                                      </View>
                                      <View style={{flex : 0.5, justifyContent : 'flex-start', alignItems: 'flex-start', borderBottomWidth : 1, borderBottomColor : 'lightgray'}}>
                                          <Text style={setFont('200', 10)} >{Moment(item.updated_at).format('lll')} - {niceBytes(item.size)} </Text>
                                      </View>
                                    </View>
         
                              </TouchableOpacity>
                            );
                    }}
                    //tabRoute={this.props.route.key}
                    keyExtractor={(item) => item.id.toString()}
                  />
          </View>

      </View>
    );
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
        //return this._renderConversation();
        return <FLChat 
					ticket={this.ticket} 
					isFocused={this.state.currentTab === 'CONVERSATION'} 
					isLoading={this.state.isConversationLoading} 
					firebase={this.props.firebase} 
					users={this.props.users}    
					hasSpoken={(hasSpoken, conv) => {
						if (this.ticket.isFollowed() && this.ticket.getType() == 'Demande Générale' && hasSpoken) {
							this.ticket.setStatus(2);

							// var productcharacmodif = {
							// 	priority: s.id,
							// 	idTicket: this.ticket.getId()
							// };
							  
							// ssModifyTicket(this.props.firebase, productcharacmodif);

							this.setState({hasSpoken});
						}
						if (hasSpoken) {
							//this.ticket.setConversations(conv);
							//this._updateConversations();
						}
					}}   
              />
      case 'DETAIL':
        //on verifie de quel type de tickets il s'agit et l'état du ticket
        if (this.ticket.isShared()) {//&& !this.ticket.isMine(this.props.user)) {
            return (
                  <View>
                      <FLDetailBroadcastPSSubscripter 
                              ticket={this.ticket} 
                              subscripters={this.state.subscripters}
                              user={this.props.user} 
                              requester={new CUser(this.ticket.getRequester())}
                              requesterOrg={this.ticket.getRequesterOrg()}
                              handleIndexChange={this._handleIndexChange}
                              firebase={this.props.firebase}
                              reloadTicket={this._loadTicket}
                              footer={this._renderFooter()}
                      />
                      
                  </View>
            );
        } else if (this.ticket.isFollowed()) {
          return (
			<View style={{marginTop : 20}}>
				<View style={{ustifyContent: 'center', alignItems : 'flex-start', marginTop : 5, paddingLeft : 10, borderWidth :  0, paddingTop : 0}}>
						<Text style={setFont('400', 14,  'gray', 'Regular')}>
							{this.ticket.getDescription()}
						</Text>
				</View>

				<View style={{justifyContent: 'center', alignItems : 'flex-start', marginTop : 5, paddingLeft : 10, borderWidth :  0, paddingTop : 5}}>
						<Text style={setFont('400', 16,  'black', 'Regular')}>
							Date de la demande : {Moment(this.ticket.getCreationDate()).format('lll')}
						</Text>
				</View>
				<View style={{justifyContent: 'center', alignItems : 'flex-start', marginTop : 5, paddingLeft : 10, borderWidth :  0, paddingTop : 5}}>
                            
							{this.ticket.getStatus() === 2 
								?  
									<Text style={setFont('400', 14,  'green', 'Bold')}>
										{this.ticket.getStatusName()} 
									</Text>
							:
								<TouchableOpacity 	style={{backgroundColor: 'red',padding  :  10,  borderWidth : 1, borderColor : 'red', borderRadius : 10}}
													onPress={() => {
														this.setState({
															currentTab: this.state.routes[1].key,
															index : 1
														  });
													}}
								>
									<Text style={setFont('400', 14,  'white', 'Bold')}>
										En attente d'une réponse  de votre part
									</Text>
								</TouchableOpacity>
							}
				</View>
			</View>
          );
        } else {
          return this._renderDetail();

        }
        break;
      //case 'TEST' : return <FLChat ticket={this.ticket} isFocused={this.state.currentTab === 'TEST'} isLoading={this.state.isConversationLoading} firebase={this.props.firebase} />
      default:
        return this._renderDocuments();
    }
  };


  _handleIndexChange = index => {
	console.log("CHANGEMENT INDEX : " + this.state.currentTab +  "     : " + this.state.hasSpoken);
	if (this.state.currentTab === 'CONVERSATION' && this.state.hasSpoken) {
		this._updateConversations();
		this.setState({ hasSpoken : false });
	}
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
                                            if (this.ticket.isMine(this.props.user)) {
                                                if(!isSelected) {
                                                  this.ticket.setPriority(s.id);
                                                  var productcharacmodif = {
                                                    priority: s.id,
                                                    idTicket: this.ticket.getId()
                                                  };
                                                  
                                                  ssModifyTicket(this.props.firebase, productcharacmodif);
                                                  this.setState( {showModalDrawnerPriority : false });
                                                }
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
      let dataOptions = (this.ticket.isShared() && this.ticket.isMine(this.props.user) && this.ticket.isCancellable()) ? ['PRIORITY', 'PRODUCT', 'CANCEL', 'ADDFRIEND'] : ['PRIORITY', 'PRODUCT', 'CANCEL'];

      return(
            <View style={{flex:1, flexDirection : 'column', height: getConstant('height'), opacity: ((this.state.showModalDrawnerPriority || this.state.isLoading) && this.state.currentTab !== 'CONVERSATION') ? 0.3 : 1}}> 
             
              <View style={{flexDirection : 'row',  backgroundColor: setColor(''), paddingTop: isAndroid() ?  0 : getConstant('statusBar'),  alignItems: 'center',justifyContent: 'space-between'}}>
                      {this._renderModalDrawnerPriority()}
                      <TouchableOpacity style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-start', padding : 5}}
                                        onPress={() => {
                                          let isJustCreated = this.props.navigation.getParam('isJustCreated', false);
                                          if (isJustCreated) {
                                            this.props.navigation.popToTop();
                                          } else {
											console.log(this.state.hasSpoken);
											if (this.ticket.isFollowed() && this.ticket.getType() == 'Demande Générale' && this.state.hasSpoken) {
												this.props.navigation.state.params.onGoBack(true);
											//	this.props.navigation.navigate('Following');
											} 
											this.props.navigation.goBack();
											
                                          } 
                                        }}
                      >
                           <Ionicons name={'md-arrow-back'}  size={25} style={{color: 'white'}}/>
                      </TouchableOpacity>
                      <View style={{flex: 0.7, justifyContent: 'center', alignItems: 'center', borderWidth : 0}}>
					  {this.ticket.isFollowed()
					  ?<View style={{borderWidth : 0, justifyContent : 'center', alignItems : 'center', paddingHorizontal : 5}}>
					  		<Text style={[setFont('300', 16, 'white', 'Regular'), {textAlign : 'center'}]}>Suivi de produit en cours d'intégration</Text>
						</View>
					  :
					  	<View style={{borderWidth : 0, justifyContent : 'center', alignItems : 'center', paddingHorizontal : 5}}>
                           	<Text style={setFont('300', 16, 'white', 'Regular')}>{this.ticket.getWorkflowName()} {this.ticket.isShared() ? 'partagé' : null}</Text>
                           <Text style={setFont('300', 12, 'white' )} numberOfLines={1}>{this.ticket.getTicketType()} - {this.ticket.isShared() ? (currencyFormatDE(this.sharedAmount) + " / " + currencyFormatDE(this.ticket.getBroadcastAmount())) : currencyFormatDE(this.ticket.getNominal())} {this.ticket.getCurrency()}</Text>
						</View>
					  }    
                      </View>
                      <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.025*getConstant('width')}}>
					  {!this.ticket.isFollowed()
					  	?
                                  <FLModalDropdown
                                                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                                //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                                dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                onSelect={(index, value) => {
                                                  switch(value) {
                                                    case 'PRIORITY' : 
                                                      if(!this.ticket.isClosed()) {
                                                        if (this.ticket.isMine(this.props.user)) {
                                                          this.setState({ showModalDrawnerPriority : true });
                                                        }
                                                      } else {
                                                        alert("Demande clôturée");
                                                      }
                                                      break;
                                                    case 'ADDFRIEND' : 
                                                      if(!this.ticket.isClosed() && this.ticket.isShared()) {
                                                        if (this.ticket.isMine(this.props.user)) {
                                                          console.log(this.ticket.getSubscriptersCodeTS());
                                                          console.log(this.ticket.getSubscriptersUid(this.props.users));
                                                          //this.props.navigation.navigate('FLAutocallDetailBroadcastFriends', {setFriends : this._setFriends.bind(this), friends : this.state.friends });
                                                          this.props.navigation.navigate('FLAddFriendOnBroadcast');
                                                        } else {
                                                          alert("Ce n'est pas ma demande");
                                                        }
                                                      } else {
                                                        alert("Demande clôturée");
                                                      }
                                                      break;
                                                      
                                                    case 'CANCEL' : 
                                                      if (this.ticket.isCancellable()) {
                                                            this._dropdownOptionMenu.hide();
                                                            setTimeout(() => {
                                                              Alert.alert(
                                                                'Annnulation',
                                                                'Voulez-vous vraiment annuler cette demande de prix ?',
                                                                [
                                                                  {
                                                                    text: 'Non',
                                                                    onPress: () => console.log('Cancel Pressed'),
                                                                    style: 'cancel'
                                                                  },
                                                                  { text: 'Oui', onPress: () => {
                                                                        this.ticket.setStatus(5);
                                                                        var productcharacmodif = {
                                                                          status: 5, //closed
                                                                          idTicket: this.ticket.getId()
                                                                        };

                                                                        //console.log(this.ticket.getStatus());
                                                                        ssModifyTicket(this.props.firebase, productcharacmodif);
                                                                  } }
                                                                ],
                                                                { cancelable: false }
                                                              );
                                                            }, 500);
                                                        }
                                                      
       
   
                                                      break;
                                                    default : break;
                                                  }
                                                }}
                                                adjustFrame={(f) => {
                                                  return {
                                                    width: getConstant('width')/2,
                                                    height: Math.min(getConstant('height')/3, dataOptions.length * 40),
                                                    left : f.left,
                                                    right : f.right,
                                                    top: f.top,
                                                    borderWidth : 1,
                                                    borderColor : 'gray',
                                                    borderRadius : 3
                                                  }
                                                }}
                                                renderRow={(option, index, isSelected) => {
                                                  switch(option) {
                                                    case 'PRIORITY' :
                                                          return (
                                                                  <View style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start', height: 40}}>
                                                                      <Text style={setFont('500', 14, this.ticket.isMine(this.props.user) ? 'black' : 'lightgray', 'Regular')}>Changer la priorité</Text>
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
                                                                   <Text style={setFont('500', 14, this.ticket.isCancellable() ? 'black' : 'lightgray', 'Regular')}>Annuler ma demande</Text>
                                                                </View>
                                                            </View>
                                                        );
                                                      case 'ADDFRIEND' :
                                                        return (
                                                            <View style={{flexDirection : 'row', height: 40}}>
                                                                <View style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                   <Text style={setFont('500', 14, 'black' , 'Regular')}>Ajouter un ami</Text>
                                                                </View>
                                                            </View>
                                                        );
                                                    default : 
                                                            return (
                                                              <View style={{paddingLeft : 4, paddingRight : 4, height: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                <Text style={setFont('500', 16, 'gray', 'Regular')}>{option}</Text>
                                                              </View>
                                                          );
                                                  }
                      
                                                }}
                                              
                                                options={dataOptions}
                                                ref={component => this._dropdownOptionMenu = component}
                                                disabled={false}
                              >
                                  <View style={{ borderWidth : 0, width : 0.1*getConstant('width'),  height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name={'dots-vertical'} size={30} style={{color: 'white'}}/>
                                  </View>
                              </FLModalDropdown>
					 	: null
						} 
					  </View>
              </View>
              <View style={{ paddingHorizontal : 15, paddingVertical : 5,backgroundColor: setColor('background'), alignItems: 'center',justifyContent: 'center'}}>
                  <Text style={[setFont('300', 18, 'black', 'Regular' ), {textAlign:'center'}]}>{this.ticket.getSubject()}</Text>
              </View>
              {this.ticket.isClosed() 
              ?
                <View style={{ paddingRight : 10, paddingLeft : 10, paddingVertical : 10,backgroundColor: 'black', alignItems: 'center',justifyContent: 'center'}}>
                   <Text style={[setFont('300', 20, 'white', 'Bold' ), {textAlign:'center'}]}>{String("demande clôturée").toUpperCase()} {Moment(this.ticket.getLastUpdateDate()).fromNow()}</Text>
                </View>
              : null
     
              }
              <View style={{flex : 1, flexDirection : 'column', marginTop : 0, backgroundColor: 'white',borderWidth : 0}}>
                <TabView
                  navigationState={this.state}
                  onIndexChange={this._handleIndexChange}
                  renderScene={this._renderScene}
                  renderTabBar={this._renderHeader}
                  swipeEnabled={false}
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



