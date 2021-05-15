import React from "react";
import { Image, ScrollView, Text, View, Animated, StyleSheet, KeyboardAvoidingView, Dimensions, TouchableOpacity, TextInput, StatusBar, Modal, Keyboard, FlatList, ClippingRectangle } from "react-native";

import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import FLTemplateAutocall from "./FLTemplateAutocall";
import { setFont, setColor , globalStyle  } from '../../../Styles/globalStyle';

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant } from '../../../Utils';
import { interpolateColorFromGradient } from '../../../Utils/color';

import FLAnimatedSVG from '../FLAnimatedSVG';
import StepIndicator from 'react-native-step-indicator';
import Accordion from 'react-native-collapsible/Accordion';



import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { broadcastPP } from '../../../API/APIAWS';


import { parsePhoneNumberFromString } from 'libphonenumber-js'

import Numeral from 'numeral'
import 'numeral/locales/fr'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import logo_white from '../../../assets/LogoWithoutTex_white.png';
import logo from '../../../assets/LogoWithoutText.png';

import * as TEMPLATE_TYPE from '../../../constants/template';
import { CWorkflowTicket } from "../../../Classes/Tickets/CWorkflowTicket";

import  { FLDatePicker } from  '../FLDatePicker';




class FLAutocallDetailBroadcastPP extends React.Component {
   
  constructor(props) {
    super(props);   

    //recuperation de l'autocall
    this.autocall =  this.props.navigation.getParam('autocall', '...');

    //user lists
    this.user = this.props.user;
    this.users = this.props.users;

    this.state = { 

        //gestion du nominal (deja traité ou pas)
        nominal :  this.autocall.getNominal(),
        targetNorminal :  this.autocall.getTargetNominal(),
        hideCC : false,

        //gestion de l'accordeon
        activeSections: [],


        //gestion du fondu de l'en tete
        scrollOffset: new Animated.Value(0),

        //friends
        friends : this.autocall.getFriends(),


        //gestion du clavier
        keyboardHeight: 0,
        isKeyboardVisible: false,
  
        //affchage du modal description avant traiter
        showModalDescription : false,
        description : '',
        message : '',
        isAutomatique : true,
       
        isLoadingCreationTicket : false,
        isLoadingUpdatePrice : false,
        messageUpdatePrice : '',
        toto : true,

    };

    //this.viewabilityConfig = { itemVisiblePercentThreshold: 40 }

    this.props.navigation.setParams({ hideBottomTabBar : true });


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);


    //liste des users ticket partagé
    this.usersList = this.users.getUserListFromUid(this.state.friends);

  }




  static navigationOptions = ({ navigation }) => {
    return ({
      header : null,
    }
    );
 }

  async componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('light-content');
      });
    }
    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);



  }
  componentWillUnmount() {
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


_setFriends(friends) {

  this.setState({ friends }, () => {
    this.usersList = this.users.getUserListFromUid(this.state.friends);
    //this.autocall.setFriends(friends);
    this.setState({ toto : !this.state.toto });
  });
}


  render() {
    let dataOptions = ['Clone', 'Shadow'];
    // console.log("NBRE AMIS : " + this.state.friends.length);

    return (
      <View  style={{ flex: 1, backgroundColor: "white" , opacity: this.state.showModalDescription ? 0.3 : (this.state.isLoadingCreationTicket || this.state.isLoadingUpdatePrice) ? 0.2 : 1}} >
         
            <FLAnimatedSVG name={'robotBlink'} visible={this.state.isLoadingCreationTicket} text={String("partage d'une demande de cotation avec mon réseau d'amis").toUpperCase()}/>
            <FLAnimatedSVG name={'robotBlink'} visible={this.state.isLoadingUpdatePrice} text={String(this.state.messageUpdatePrice).toUpperCase()}/>
        
            <View style={{ flexDirection : 'row', marginTop : getConstant('statusBar')-(isIphoneX() ? 45 : isAndroid() ? 30 : 20) ,height: 45 + getConstant('statusBar'), width : getConstant('width'), paddingLeft : 10, backgroundColor: setColor(''), paddingTop : isAndroid() ? 10 : isIphoneX() ? 40 : 20, alignItems : 'center'}}  >
                            <TouchableOpacity style={{ flex: 0.2, flexDirection : 'row', borderWidth: 0, padding : 5}}
                                                onPress={() => this.props.navigation.goBack()}
                            >
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Ionicons name={'md-arrow-back'}  size={25} style={{color: 'white'}}/>
                                    </View>
                  
                            </TouchableOpacity>
                            <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}} >
                              <Text style={setFont('200', 16, 'white', 'Regular')}>
                                Partager : 
                              </Text>
                              <Text style={setFont('300', 18, 'white', 'Regular')}>
                                {String('placement privé').toUpperCase()} 
                              </Text>
                            </View>
                            <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.05*getConstant('width')}}>
   
              </View>
            </View>
            <View style={{  width : getConstant('width'), justifyContent : 'center', alignItems : 'center', marginTop : 10}}>
                <Accordion
                    sections={[            
                      {
                        title: '...',
                        code: 'DETAIL',
                      }
                    ]}
                    underlayColor={'transparent'}
                    activeSections={this.state.activeSections}
                    renderHeader={({}) => {
                      return (
                        <View style={{flexDirection: 'row', width : getConstant('width'), justifyContent: 'flex-start', marginLeft : 35 }}>                                                    
                          <View style={{flex: 0.5, flexDirection: 'column', justifyContent: 'center' , paddingTop: 3, paddingBottom: 3}}>
        
                            <View style={{}}>
                                <View style={{ borderWidth: 0}}>
                                    <Text style={setFont('400', 20,setColor('darkBlue'), 'Bold')}>
                                            {this.autocall.getProductName()} 
                                    </Text>
                                </View>
                                <View style={{ borderWidth: 0}}>
                                    <Text style={setFont('400', 13, setColor('darkBlue'), 'Regular')}>
                                        {this.autocall.getFullUnderlyingName(this.props.categories)}
                                    </Text>
                                </View>
                            </View>
                          </View>
                          <View style={{ flex : 0.4, alignItems: 'center', justifyContent: 'center', marginRight: 20, borderWidth: 0}}>
                              <Text style={setFont('400', 24, setColor('FLGreen'), 'Bold')} numberOfLines={1}>        
                                  { Numeral(this.autocall.getCoupon()).format('0.00%')} 
                                  <Text style={[setFont('200', 12, setColor('FLGreen')), {textAlign : 'left'}]}> p.a.
                              </Text>   
                              
                              </Text>
                          </View>  
                          <View style={{  alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 0}}>
                              <MaterialCommunityIcons name={this.state.activeSections.length === 0 ? 'chevron-down' : 'chevron-up'} size={25}/>
                          </View>  
                        </View>
                      )
                    }}
                    //renderFooter={this._renderFooterUnderlying}
                    renderContent={({}) => {
                      return (
                        <View style={{borderWidth : 0}}>
                          <FLTemplateAutocall autocall={this.autocall} templateType={TEMPLATE_TYPE.AUTOCALL_DETAIL_FULL_TEMPLATE} isEditable={false} source={'Home'}  nominal={this.autocall.getTargetNominal()} screenWidth={0.9} showUF={false} />        
                        </View>
                      )
                    }}
                    expandMultiple={false}
                    onChange={(activeSections) => {
                        this.setState( { activeSections : activeSections })  
                    }}
                    sectionContainerStyle={{
                                            width : getConstant('width'),
                                            backgroundColor: 'white', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            borderWidth : 0
                                          }}
                    touchableComponent={(props) => <TouchableOpacity {...props} />}
                />
            </View>

     

            <ScrollView style={{marginLeft : getConstant('width')*0.95, marginLeft : getConstant('width')*0.025}}>
              
                            <View style={{marginBottom : 0}}>
                                <Text style={setFont('200', 16, 'gray')}>Nominal investi en propre :</Text>
                            </View>
                            <KeyboardAvoidingView behavior={'padding'} style={{flexDirection : 'row', marginTop : 3}}>
                                        <View style={{flex: 0.8 ,  justifyContent: 'center'}}>
                                            <TextInput 
                                                    style={{    
                                                            display: 'flex',
                                                            backgroundColor: 'white',
                                                            height : 30,
                                                            fontSize: 18,
                                                            color: setColor('lightBlue'),
                                                            borderColor : setColor(''),
                                                            borderWidth: 1,
                                                            borderRadius: 4,
                                                            paddingRight: 5,
                                                            //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                                            textAlign: 'right' ,
                                                            textAlignVertical: 'center',
                                                            }}
                                                    placeholder={'EUR'}
                                                    placeholderTextColor={'lightgray'}
                                                    underlineColorAndroid={'#fff'}
                                                    autoCorrect={false}
                                                    keyboardType={'numeric'}
                                                    returnKeyType={'done'}
                                                    editable={true}
                                                    onBlur={() => {
                                                        this.autocall.setNominal(this.state.nominal);
                                                        if (this.state.targetNorminal < this.state.nominal) {
                                                          this.autocall.setTargetNominal(this.state.nominal);
                                                          this.setState({ targetNorminal : this.state.nominal });
                                                        }
                                                    }}
                                                    onFocus={() =>  this.setState({ nominal : '' })}
                                                    //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                                    value={this.state.nominal === 0 ? '' : currencyFormatDE(Number(this.state.nominal),0)}
                                                    // ref={(inputNominal) => {
                                                    // this.inputNominal = inputNominal;
                                                    // }}
                                                    onChangeText={e => {
                                                        //console.log(Number(e));
                                                        this.setState({ nominal : e === '' ? 0 : Numeral(e).value() });
                                                        
                                                    }}
                                            />
                                        </View>
                                        <View style={{width : 0.2*getConstant('width'), borderWidth : 0, justifyContent : 'center', paddingLeft : 5}}>
                                            <Text style={setFont('400', 18, 'gray' , 'Regular')}>
                                                {this.autocall.getCurrency()}
                                            </Text>
                                        </View>
                            </KeyboardAvoidingView>
                            <View style={{marginTop : 15}}>
                                <Text style={setFont('200', 16, 'gray')}>Cible de nominal avec mes amis :</Text>
                            </View>
                            <KeyboardAvoidingView behavior={'padding'} style={{flexDirection : 'row', marginTop : 3}}>
                                        <View style={{flex: 0.8 ,  justifyContent: 'center'}}>
                                            <TextInput 
                                                    style={{    
                                                            display: 'flex',
                                                            backgroundColor: 'white',
                                                            height : 30,
                                                            fontSize: 18,
                                                            color: setColor('lightBlue'),
                                                            borderColor : setColor(''),
                                                            borderWidth: 1,
                                                            borderRadius: 4,
                                                            paddingRight: 5,
                                                            //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                                            textAlign: 'right' ,
                                                            textAlignVertical: 'center',
                                                            }}
                                                    placeholder={'EUR'}
                                                    placeholderTextColor={'lightgray'}
                                                    underlineColorAndroid={'#fff'}
                                                    autoCorrect={false}
                                                    keyboardType={'numeric'}
                                                    returnKeyType={'done'}
                                                    editable={true}
                                                    onBlur={() => {
                                                        
                                                        if (this.state.targetNorminal < this.state.nominal || this.state.targetNorminal < 200000) {
                                                          alert("Veuillez rentrer un total d'investissement supérieur au vôtre et supérieur à 200 000 EUR");
                                                          let targetNorminal = Math.max(200000, this.state.nominal);
                                                          this.autocall.setTargetNominal(targetNorminal);
                                                          this.setState({ targetNorminal });
                                                        } else {
                                                          this.autocall.setTargetNominal(this.state.targetNorminal);
                                                          //this.setState({ targetNorminal : this.state.nominal });
                                                          // this.autocall.setNominal(this.state.nominal);
                                                        }
                                                    }}
                                                    onFocus={() =>  this.setState({ targetNorminal : '' })}
                                                    //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                                    value={this.state.targetNorminal === 0 ? '' : currencyFormatDE(Number(this.state.targetNorminal),0)}
                                                    // ref={(inputNominal) => {
                                                    // this.inputNominal = inputNominal;
                                                    // }}
                                                    onChangeText={e => {
                                                      this.setState({ targetNorminal : e === '' ? 0 : Numeral(e).value() });
                                                    }}
                                            />
                                        </View>
                                        <View style={{width : 0.2*getConstant('width'), borderWidth : 0, justifyContent : 'center', paddingLeft : 5}}>
                                            <Text style={setFont('400', 18, 'gray' , 'Regular')}>
                                                {this.autocall.getCurrency()}
                                            </Text>
                                        </View>
                            </KeyboardAvoidingView>

                            <View style={{marginTop : 15}}>
                                <Text style={setFont('200', 16, 'gray')}>Demander jusqu'au :</Text>
                            </View>
                            <FLDatePicker date={this.autocall.getEndSharingDate()} minimumDate={new Date(Date.now())} onChange={(d) =>  this.autocall.setEndSharingDate(d)} isEditable={true} />
                            <KeyboardAvoidingView behavior={'padding'} style={{ marginTop : 5}}>
                                  <View style={{marginTop : 15}}>
                                      <Text style={setFont('200', 16, 'gray')}>Rajoutez une description au produit :</Text>
                                  </View>
                                  <View style={{marginTop : 5}}>
                                    <TextInput  style={{color: 'black', textAlignVertical:'top', backgroundColor: 'white' , padding: 5, borderWidth :1, borderRadius: 2,width: getConstant('width')-20, height: getConstant('height')*0.15}}
                                              multiline={true}
                                              numberOfLines={5}
                                              placeholder={'Votre description du produit ...'}
                                              onChangeText={(e) => this.setState({ description : e})}
                                              value={this.state.description}
                                              returnKeyType={'done'}
                                              onSubmitEditing={() => Keyboard.dismiss()}
                                    />
                                  </View>
                                  <View style={{marginTop : 15}}>
                                      <Text style={setFont('200', 16, 'gray')}>Décrivez la proposition à vos amis :</Text>
                                  </View>
                                  <View style={{marginTop : 5}}>
                                    <TextInput  style={{color: 'black', textAlignVertical:'top', backgroundColor: 'white' , padding: 5, borderWidth :1, borderRadius: 2,width: getConstant('width')-20, height: getConstant('height')*0.15}}
                                              multiline={true}
                                              numberOfLines={5}
                                              placeholder={'Votre description de la proposition ...'}
                                              onChangeText={(e) => this.setState({ message : e})}
                                              value={this.state.message}
                                              returnKeyType={'done'}
                                              onSubmitEditing={() => Keyboard.dismiss()}
                                    />
                                  </View>
                                  

                                  <View style={{borderWidth : 0, width : getConstant('width')*0.95, marginTop : 25}}>
                                      <TouchableOpacity style={{flexDirection : 'row'}}
                                                        onPress={() => {
                                                       
                                                            this.props.navigation.navigate('FLAutocallDetailBroadcastFriends', {setFriends : this._setFriends.bind(this), friends : this.state.friends });
                                                        }}        
                                      >
                                            <View style={{justifyContent : 'flex-end', alignItems : 'flex-start'}}>
                                                <Text style={setFont('300', 20, 'black', 'Regular')}>
                                                          Proposer à :
                                                </Text>
                                            </View>
                                            <View style={{paddingLeft : 10,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}>
                                                            {/* <FontAwesome5 name={isFriend ? 'user-minus' : 'user-plus'} color={isFriend ? 'red' : 'green'} size={20}/> */}
                                                            <FontAwesome5 name={'user-plus'} color={'green'} size={20}/>
                                            </View>
                                      </TouchableOpacity>
                                      {
                                        
                                        this.usersList.map((u, index) => {
                                            //let isFriend = this.user.isFriend(u.getId());
                                            return (
                                              <View style={{flexDirection : 'row', marginTop : index === 0 ? 10 : 2, marginBottom : 2, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 1, justifyContent : 'space-between'}} key={index}>
                                                  <View style={{height : 40, width : 40, borderWith : 0, borderColor : 'white', borderRadius : 20, backgroundColor : setColor(''), marginLeft : 10,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                                                  {u.getAvatar() == null 
                                                    ?
                                                      <Text style={setFont('400', 16, 'white', 'Regular')}>{u.getFirstName().charAt(0)}.{u.getLastName().charAt(0)}.</Text>
                                                      : 
                                                      <Image style={{width: 40, height: 40, borderWidth : 0, borderRadius : 20, borderColor : 'white'}} source={{uri : u.getAvatar() }} />
                                                  }
                                                  </View>
                                                  <View style={{flex : 1, borderWidth : 0, marginLeft : 10, marginTop : 3, marginRight : 5}}>
                                                    <View>
                                                      <Text style={setFont('300', 14, 'black', 'Regular')}>
                                                        {u.getName()} {this.user.getOrganization() !== u.getOrganization() ? <Text style={setFont('200', 12)}> ({u.getCompany()})</Text>  : null}
                                                      </Text>
                                                    </View>
                                                    <View>
                                                      <Text style={setFont('200', 12, 'gray')}>
                                                        {u.getEmail()}
                                                      </Text>
                                                    </View>
                                                    <View>
                                                      <Text style={setFont('200', 10, 'gray')}>
                                                        {u.getPhone != null && u.getPhone() !== '' ? parsePhoneNumberFromString(u.getPhone(),'FR').formatInternational() : null}
                                                      </Text>
                                                    </View>
                                                  </View>
                                
                                                        <TouchableOpacity style={{padding : 2,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}
                                                                          onPress={() => {
                                                                              let friends = this.state.friends;
                                                                    
                                                                              let index = friends.indexOf(u.getId());
                                                                
                                                                              if (index !== -1) {
                                                                                friends.splice(index, 1);
                                                                              }
                                                                              
                                                                              this._setFriends(friends);
                                                                          }}
                                                        >
                                                            {/* <FontAwesome5 name={isFriend ? 'user-minus' : 'user-plus'} color={isFriend ? 'red' : 'green'} size={20}/> */}
                                                            <FontAwesome5 name={'user-minus'} color={'red'} size={20}/>
                                                        </TouchableOpacity>

                                              </View>
                                            )

                                          })
                                      }
                                      {
                                        (this.usersList.length === 0)
                                        ?
                                        <View style={{marginTop : 15}}>
                                            <Text style={setFont('200', 16, 'gray')}>ajouter des amis avec qui partager le produit </Text>
                                        </View>
                                          : null
                                      }
                                  </View>

                              </KeyboardAvoidingView>
                            <View style={{height : 150}} />

                            

            </ScrollView>

            <TouchableOpacity     style={{opacity : this.state.friends.length === 0 ? 0.8 : 0.8, position : 'absolute',top: getConstant('height')-110-this.state.keyboardHeight - (isAndroid() ? 30 : 0) , right : 20, alignItems: 'center', justifyContent: 'center', borderWidth : 1, height: 70, width: 70, borderColor: setColor('subscribeBlue'), borderRadius: 35,  backgroundColor: setColor('subscribeBlue')}}
                                  onPress={() => {
                                    
                                    if (this.state.friends.length === 0) {
                                      alert("Veuiller indiquer avec qui partager ce produit !");
                                      return;
                                    }

                                    this.setState( {isLoadingCreationTicket : true });

                                    let product = {};
                                    product['subject'] = this.autocall.getShortName();
                                    product['description'] = this.state.description ==='' ? "Aucune instruction particulière" : this.state.description;
                                    product['department'] = 'FIN';
                                    product['cf_step_pp']  = 'PPRIR';
                                    
                                    let productToSend = {};
                                    productToSend['product'] = product;
                                    productToSend['cf_message'] = this.state.message === '' ? "Pas de message" : this.state.message;
                                    //productToSend['broad_enddate'] = Moment.utc(Moment(this.autocall.getEndSharingDate()).toDate()).format();
                                    let due_byDate = Moment(Date.now()).add(1, 'days').set({"hour": 17, "minute": 30, "second" : 0}).toDate();
                                    productToSend['due_by'] = Moment.utc(due_byDate).format();
                                    let fr_due_byDate = Moment(Date.now()).add(1, 'days').set({"hour": 17, "minute": 15, "second" : 0}).toDate();
                                    productToSend['fr_due_by'] = Moment.utc(fr_due_byDate).format();
                                    productToSend['friends'] = this.state.friends;
                                    productToSend['codeOperation'] = 'pp';
                                    productToSend['ps_num_ticket_broadcast'] = this.state.targetNorminal;
                                    productToSend['ps_num_ticket'] = this.state.nominal;
                                    productToSend['type'] = 'Produit structuré';
                                    //quel mode va rentrer le ticket
                                    productToSend['cf_ps_mode'] =  "Automatique";
                                    productToSend['UF'] = this.autocall.getUF();
                                    productToSend['UFAsso'] = this.autocall.getUFAssoc();
                                    productToSend['cf_ps_shared'] = true;
                                    productToSend['cf_cpg_choice'] = "Placement Privé";
                                    productToSend['productcode'] = this.autocall.getUniqueId();
                                    //console.log(productToSend);

                                   //"due_by": 2020-05-03T15:30:00.912Z,
                                   console.log("++++++++++++");
                                    broadcastPP(this.props.firebase, productToSend)
                                   .then((data) => {
                                      console.log(data);
                                      if (data != null && data !== 'Error') {
                                          //console.log("USER CREE AVEC SUCCES DANS ZOHO");
                                          
                                          console.log("SUCCES CREATION TICKET BROADCAST");
                                          
                                          let t = new CWorkflowTicket(data.data);
                                          this.props.addTicket(t);
                                          console.log("TICKET AJOUTE");
                                          this.setState({ isLoadingCreationTicket : false }, () => {
                                            this.props.navigation.navigate('FLTicketDetail', {ticket : t, isJustCreated : true});
                                          })
                                      } else {
                                        console.log("ERREUR CREATION TICKET: " + error);
                                        this.setState({ isLoadingCreationTicket : false }, () => alert('ERREUR ' + error));
                                      }
                                    })
                                    .catch(error => {
                                       console.log("ERREUR CREATION TICKET: " + error);
                                       this.setState({ isLoadingCreationTicket : false }, () => alert('ERREUR '  + error));
                                      
                                    }); 
                               
                                    
                                  }}  
            >
                      <View style={{marginTop: 0, }}>
                          <Ionicons name={"md-share"} size={40} color={'white'} />
                      </View>

            </TouchableOpacity>

      </View>
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
export default hoistStatics(composedStructuredProductDetail)(FLAutocallDetailBroadcastPP);