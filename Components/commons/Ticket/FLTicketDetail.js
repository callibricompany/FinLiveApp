import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, Image, Modal, KeyboardAvoidingView, Keyboard, TextInput, TouchableWithoutFeedback, PanResponder, Animated, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import { GiftedChat, Send, InputToolbar} from 'react-native-gifted-chat'
import Timeline from 'react-native-timeline-flatlist';

import { ssCreateStructuredProduct, ssModifyTicket, getConversation  } from '../../../API/APIAWS';

import { setFont, setColor , backgdColor } from '../../../Styles/globalStyle';

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

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual} from '../../../Utils';

import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import HTMLView from 'react-native-htmlview';

import * as TEMPLATE_TYPE from '../../../constants/template';

import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { ScrollView } from 'react-native-gesture-handler';
import { CTicket } from '../../../Classes/Tickets/CTicket';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT =  isAndroid() ? StatusBar.currentHeight : isIphoneX() ? 44 : 20;


class FLTicketDetail extends React.Component {
    
  constructor(props) {
    super(props);


    this.ticket= this.props.ticket;
    this.autocall = this.ticket.getProduct();
    console.log("Constructeur ticket");
    this.props._removeToast();
    this.state = {

      nominal :  this.ticket.getNominal(),
      finalNominal :  this.ticket.getNominal(),


      //messages des conversations
      messages : [],

      //gestion du clavier
      keyboardHeight: 0,
      isKeyboardVisible: false,

      //modal
      showModalDrawnerPriority : false,

      //gestion des conversations et notes
      notes : [],

      isLoading : false,
    

      //gestion des tabs
      index: 0,
      routes: [
        { key: 'DETAIL', title: 'Détail' },
        { key: 'ACTIVITY', title: 'Activité' },
        { key: 'CONVERSATION', title: 'Conversation' },
        { key: 'DOCUMENTS', title: 'Docs' },
      ]
    }
    


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
  }

  componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('light-content');
      });
    }
    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

    //chargement de la conversation
    this.setState({ isLoading : true });
    getConversation(this.props.firebase, this.ticket.getId())
    .then((data) => {

      this.ticket.setConversations(data.data);
      this.setState({ notes : this.ticket.getNotes(), isLoading : false }, () => console.log("NBRE DE NOTES : " + this.state.notes.length));
      
    })
    .catch(error => {
      console.log("ERREUR recupération conversations : " + error);
      alert('Erreur : ' + error);
      this.setState({ isLoading : false });
      
    }) 

    //on specifie que le ticket est lu
    this.props.removeNotification('TICKET', this.ticket.getId());

    this.props.setCurrentFocusedObject('TICKET', this.ticket.getId());
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
          createdAt: new Date(),
          quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: true,
            values: [
              {
                title: '😋 Yes',
                value: 'yes',
              },
              {
                title: '📷 Yes, let me show you with a picture!',
                value: 'yes_picture',
              },
              {
                title: '😞 Nope. What?',
                value: 'no',
              },
            ],
          },
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
        {
          _id: 2,
          text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
          createdAt: new Date(),
          quickReplies: {
            type: 'checkbox', // or 'radio',
            values: [
              {
                title: 'Yes',
                value: 'yes',
              },
              {
                title: 'Yes, let me show you with a picture!',
                value: 'yes_picture',
              },
              {
                title: 'Nope. What?',
                value: 'no',
              },
            ],
          },
          user: {
            _id: 2,
            name: 'React Native',
          },
        }
      ],
    })
  }

  componentWillUnmount() {
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
    }, ()=> console.log("HAUTEUR CLAVIER : " + this.state.keyboardHeight));
  }
  
  
  onSend(messages = []) {
    console.log("SEND : "+ messages);
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
  renderSend(props) {
        return (
          <Send {...props} containerStyle={{ borderWidth: 0, marginRight: 15 , justifyContent:'center', alignItems:'flex-start'}}>
              <Image source={logo} style={{width : 35, height: 35}}  resizeMode={'center'}/>
          </Send>
        );
  }
  renderInputToolbar (props) {
    return <InputToolbar {...props} containerStyle={{
      marginLeft: 15,
      marginRight: 15,
      marginBottom: 5,
      marginTop: 5,
      borderWidth: 0.5,
      borderColor: 'grey',
      borderRadius: 25,
      height: 35,
      alignItems: 'center',
      justifyContent: 'center'
    }} />
  }
  _renderDetail() {
    return (
      <ScrollView style={{marginTop : 20, borderWidth : 0}}>
          <View style={{justifyContent: 'center', alignItems: 'flex-start', borderWidth : 0, paddingLeft : 0.025*DEVICE_WIDTH}}>
            <Text style={setFont('500', 18, 'black', 'Regular')}>{this.ticket.getDescription()}</Text>
          </View>
          <View style={{flexDirection : 'row', justifyContent: 'flex-start', alignItems: 'stretch', borderWidth : 0, paddingLeft : 0.025*DEVICE_WIDTH, marginTop : 10,}}>
              <View style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={setFont('200', 10, 'gray')}>Création{'\n'}
                        <Text style={setFont('200', 12)}>{Moment(this.ticket.getCreationDate()).format('DD/MM/YY hh:mm')}</Text></Text>
               </View> 
               <View style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, marginLeft : 7, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{paddingLeft: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={setFont('200', 9)}>#{this.ticket.getId()}{'\n'}
                        <Text style={setFont('200', 12)}>{this.ticket.getStatus().name}</Text> </Text>
                    </View>
               </View>  
               <View style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, marginLeft : 7, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialCommunityIcons name={"face-agent"} size={15} />
                    </View>
                    <View style={{paddingLeft: 10, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={setFont('200', 12)} numberOfLines={2}>{this.ticket.getAgentName()}</Text>
                    </View>
               </View>  
               <TouchableOpacity style={{flexDirection : 'row', padding : 5, backgroundColor: 'gainsboro',  borderRadius: 3, marginLeft : 7, justifyContent: 'center', alignItems: 'center'}}
                                  onPress={() => this.setState( {showModalDrawnerPriority : true })} 
               >
                    <View style={{height : 10, width: 10, borderRadius: 5, backgroundColor: this.ticket.getPriority().color, margin : 5, justifyContent: 'center', alignItems: 'center'}} />
                    <View style={{paddingLeft: 2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={setFont('200', 12)}>{this.ticket.getPriority().name}</Text>
                    </View>
               </TouchableOpacity>  

          </View>
          <View style={{justifyContent: 'center', alignItems: 'flex-start', borderWidth : 0, paddingLeft : 0.025*DEVICE_WIDTH, marginTop : 25, backgroundColor: 'white'}}>
           
            {     this.ticket.getDueBy() > Date.now()
                  ?
                              <View style={{ padding : 2, alignItems: 'center', justifyContent: 'center', borderWidth: 0, backgroundColor: setColor('subscribeticket')}}>
                                  <Text style={[setFont('200', 9, 'white'),{textAlign: 'center'}]}>Deadline : {Moment(this.ticket.getDueBy()).fromNow()}</Text>
                              </View>
                  : 
                              <View style={{backgroundColor: 'red', width : 50, padding : 2,alignItems: 'center', justifyContent: 'center', borderWidth: 0}}>
                                  <Text style={[setFont('300', 10, 'white', 'Bold'), {textAlign: 'center'}]}>En retard</Text>
                              </View>
            }
             
          </View>
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderWidth : 0, paddingRight : 0.025*DEVICE_WIDTH,paddingLeft : 0.025*DEVICE_WIDTH, marginTop : 5, backgroundColor: 'white'}}>
              <View style={{flex: 0.4}}>
                  <Text style={[setFont('500', 20, 'black', 'Bold'), {textAlign: 'center'}]}>{this.ticket.getUnsolvedStep()}</Text>
              </View>
              <View style={{flex: 0.2, borderWidth : 0, alignItems: 'center', justifyContent: 'center'}}>
                  <MaterialCommunityIcons name={'fast-forward'} size={50} color={'gainsboro'} style={{transform: [{ rotate: '90deg'}]}} />
              </View>
              <View style={{flex: 0.4}}>
                  <Text style={[setFont('300', 20, 'gainsboro', 'Regular'), {textAlign: 'center'}]}>{this.ticket.getSolvedStep()}</Text>
              </View>
          </View>


          <TouchableOpacity style={{alignItems: 'center', marginTop : 40, borderWidth : 1}}
                            onPress={() => {
                              this.autocall.setFinalNominal(this.ticket.getNominal());
                              this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                                autocall: this.autocall,
                                //ticketType: TICKET_TYPE.PSCREATION
                              })
                            }}
          >
              <FLTemplateAutocall object={this.autocall.getObject()} screenWidth={1} templateType={TEMPLATE_TYPE.AUTOCALL_TICKET_TEMPLATE} isEditable={false} source={this.props.source}  nominal={this.ticket.getNominal()} />
          </TouchableOpacity>

      </ScrollView> 
    )
  }

  _renderConversation() {
    return (
        <View style={{borderWidth: 0, flex: 1, marginBottom: 20}}>
          <GiftedChat
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              placeholder={"Tapez votre message ..."}
              user={{
                _id: 1,
              }}
              renderSend={this.renderSend}
              renderInputToolbar={this.renderInputToolbar}
          />
        </View>
    );
  }

  //////////////////////////////////
  //        activity
  //////////////////////////////////
  _renderDetailActivitySectionTitle(sectionID) {
      let title = this.ticket.getUnsolvedStep();
      if (sectionID === 100){
        title = "DEMANDE DE COTATION";
      }

      return title.toUpperCase();
  }
  _renderDetailActivity(rowData, sectionID, rowID) {
    //console.log("SECTIONID : " + sectionID);
    
    return (
      <View style={{flex:1, marginRight : 10, marginTop : -10}}>
         <Text style={setFont('400', 16, 'black', 'Bold')}>
           {this._renderDetailActivitySectionTitle(sectionID)}{'\n'}
         </Text>
         {rowData.body === '' ? <Text style={setFont('400', 12, 'gray')}>{rowData.body_text}</Text>
            : 
            <HTML html={rowData.body.replace('\\','')}  />
            //<WebView originWhitelist={['*']} source={{html: '<h1>Hello world</h1>'}} />
            //<HTMLView value={rowData.body} />
            
         }
      </View>
    )
  }
  _renderTimeActivity(rowData, sectionID, rowID) {
    
    return (
      <View style={{width : DEVICE_WIDTH/4, marginLeft : 0.025*DEVICE_WIDTH}}>
          <View>
              <Text style={setFont('400', 14, 'black')}>
                  {Moment(rowData.created_at).format('lll')}
              </Text>
          </View>
          <View style={{marginTop : 5}}> 
               <Text style={setFont('200', 11)}>
                  {sectionID === 0 ? (this.props.authUser.firstName + ' ' + this.props.authUser.name) : null}
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
              style={{ backgroundColor: backgdColor , borderRadius : 0}}
              //labelStyle={setFont('300', 12)}
              renderLabel={({ route, focused }) => {
                switch(route.key) {
                  case 'DOCUME':
                    return <MaterialCommunityIcons name={'file-document-outline'} size={30} style={{color: focused ? 'black' : setColor('light')}}/>;  
                  default:
                    return  <View style={{borderWidth: 0, marginLeft : -10, marginRight : -10}}><Text style={[setFont('300', 14, focused ? 'black' : setColor(''), focused ? 'Regular': 'Light'),{textAlign: 'center'}]} numberOfLines={1}>{route.title}</Text></View>;
                }
              }}
              tabStyle={{flex: 1, width: DEVICE_WIDTH/(this.state.routes.length), justifyContent : 'center', alignItems : 'stretch', borderWidth : 0}}
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
                let verifX = x < DEVICE_WIDTH*0  || x > DEVICE_WIDTH ? true : false;
                let verifY = y < DEVICE_HEIGHT*0.65  || y > DEVICE_HEIGHT ? true : false;
                if (verifX || verifY) {
                  //console.log("passe la ");
                  this.setState({showModalDrawnerPriority : false})
                }
              }}
          >
            <View style={{ flexDirection: 'column',backgroundColor: 'white', borderWidth :0, borderColor : 'black', borderRadius:5,width: DEVICE_WIDTH, height: DEVICE_HEIGHT*0.35, top:  DEVICE_HEIGHT*0.65, left : DEVICE_WIDTH*0}}>
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
                                      <MaterialCommunityIcons name='check' size={22} color={setColor('vertpomme')}/>
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
            <View style={{flex:1, flexDirection : 'column', height: DEVICE_HEIGHT, opacity: this.state.showModalDrawnerPriority ? 0.3 : 1}}> 
              
              <View style={{flexDirection : 'row', paddingLeft : 10, backgroundColor: setColor('vertpomme'), paddingTop: isAndroid() ?  0 : STATUSBAR_HEIGHT, padding : 5, alignItems: 'flex-start',justifyContent: 'space-between'}}>
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
                      <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.025*DEVICE_WIDTH}}>

                                  <ModalDropdown
                                                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                                //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                                dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                onSelect={(index, value) => {
                                                  switch(value) {
                                                    case 'PRIORITY' : 
                                                      this.setState({ showModalDrawnerPriority : true });
                                                      break;
                                                    deafult : break;
                                                  }
                                                }}
                                                adjustFrame={(f) => {
                                                  return {
                                                    width: DEVICE_WIDTH/2,
                                                    height: Math.min(DEVICE_HEIGHT/3, dataOptions.length * 40),
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
                                                                      <Text style={setFont('500', 14, setColor(''), 'Regular')}>Changer la priorité</Text>
                                                                  </View>
                                                          );
                                                    case 'PRODUCT' :
                                                          return (
                                                              <View style={{flexDirection : 'row', height: 40}}>
                                                                  <View style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                      <Text style={setFont('500', 16, setColor(''), 'Bold')}>Voir le produit</Text>
                                                                  </View>
                                                                  <TouchableOpacity style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}
                                                                                    onPress={() => {
                                                                                      //  this.setState({ searchSRP : !this.state.searchSRP });
                                                                                    }}
                                                                  >
                                                                      <FontAwesome name={"toggle-on"}  size={25} style={{color: setColor('')}}/> 
                                                                  </TouchableOpacity>
                                                              </View>
                                                          );
                                                      case 'CANCEL' :
                                                        return (
                                                            <View style={{flexDirection : 'row', height: 40}}>
                                                                <View style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                    <Text style={setFont('500', 16, setColor(''), 'Bold')}>Annuler ma demande</Text>
                                                                </View>
                                                                <TouchableOpacity style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}
                                                                                  onPress={() => {
                                                                                    //  this.setState({ searchSRP : !this.state.searchSRP });
                                                                                  }}
                                                                >
                                                                    <FontAwesome name={"toggle-on"}  size={25} style={{color: setColor('')}}/> 
                                                                </TouchableOpacity>
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
                                  <View style={{ borderWidth : 0, width : 0.1*DEVICE_WIDTH,  height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name={'dots-vertical'} size={30} style={{color: 'white'}}/>
                                  </View>
                              </ModalDropdown>
                      </View>
              </View>
              <View style={{ paddingRight : 10, paddingLeft : 10, paddingBottom : 10,backgroundColor: setColor('vertpomme'), alignItems: 'center',justifyContent: 'center'}}>
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

/*
<FLTemplatePP ticket={this.ticket} templateType={TEMPLATE_TYPE.TICKET_FULL_TEMPLATE} source={'Home'} />


SOURCE	VALUE
Reply	0
Note	2
Created from tweets	5
Created from survey feedback	6
Created from Facebook post	7
SOURCE TYPE	VALUE
Created from Forwarded Email	8
Created from Phone	9
Created from Mobihelp	10
E-Commerce	11
                          */

