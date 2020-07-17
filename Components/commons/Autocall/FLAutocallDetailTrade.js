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

import { ssCreateStructuredProduct } from '../../../API/APIAWS';
import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant } from '../../../Utils';
import { interpolateColorFromGradient } from '../../../Utils/color';

import FLAnimatedSVG from '../FLAnimatedSVG';
import StepIndicator from 'react-native-step-indicator';
import Accordion from 'react-native-collapsible/Accordion';

import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { searchProducts } from '../../../API/APIAWS';
import { interpolateBestProducts } from '../../../Utils/interpolatePrices';

import Numeral from 'numeral'
import 'numeral/locales/fr'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import logo_white from '../../../assets/LogoWithoutTex_white.png';
import logo from '../../../assets/LogoWithoutText.png';

import * as TEMPLATE_TYPE from '../../../constants/template';
import { CWorkflowTicket } from "../../../Classes/Tickets/CWorkflowTicket";

import { FLIssuer } from "./FLIssuer";
import { FLStrike } from "./FLStrike";
import { FLUF } from "./FLUF";
import { FLCallable } from "./FLCallable";
import { FLCoupons } from "./FLCoupons";
import { FLPDI } from "./FLPDI";




class FLAutocallDetailTrade extends React.Component {
   
  constructor(props) {
    super(props);   

    //recuperation de l'autocall
    this.autocall =  this.props.navigation.getParam('autocall', '...');
  
    this.state = { 

        //gestion du nominal (deja traité ou pas)
        nominal :  this.autocall.getNominal(),
        finalNominal :  this.autocall.getNominal(),
        hideCC : false,

        //gestion du step indicator
        activeSections: [0],
        activeUnderSection : -1,

        //gestion du fondu de l'en tete
        scrollOffset: new Animated.Value(0),

  
        //gestion du clavier
        keyboardHeight: 0,
        isKeyboardVisible: false,
  
        //affchage du modal description avant traiter
        showModalDescription : false,
        description : '',
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
        StatusBar.setBarStyle(Platform.OS === 'Android' ? 'light-content' : 'dark-content');
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





  render() {
    let dataOptions = ['Clone', 'Shadow'];
    return (
      <View  style={{ flex: 1, backgroundColor: "white" , opacity: this.state.showModalDescription ? 0.3 : (this.state.isLoadingCreationTicket || this.state.isLoadingUpdatePrice) ? 0.2 : 1}} >
         
            <FLAnimatedSVG name={'robotBlink'} visible={this.state.isLoadingCreationTicket} text={String("création d'une demande de cotation").toUpperCase()}/>
            <FLAnimatedSVG name={'robotBlink'} visible={this.state.isLoadingUpdatePrice} text={String(this.state.messageUpdatePrice).toUpperCase()}/>
        
            <View style={{ flexDirection : 'row', marginTop : getConstant('statusBar')-(isIphoneX() ? 45 : isAndroid() ? 30 : 20) ,height: 45 + getConstant('statusBar'), width : getConstant('width'), paddingLeft : 10, backgroundColor: setColor(''), paddingTop : isAndroid() ? 10 : isIphoneX() ? 40 : 20, alignItems : 'center'}}  >
                            <TouchableOpacity style={{ flex: 0.2, flexDirection : 'row', borderWidth: 0, padding : 5}}
                                                onPress={() => this.props.navigation.goBack()}
                            >
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/>
                                    </View>
                  
                            </TouchableOpacity>
                            <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}} >
                              <Text style={setFont('200', 16, 'white', 'Regular')}>
                                Traiter :
                              </Text>
                              <Text style={setFont('300', 18, 'white', 'Regular')}>
                                {String('placement privé').toUpperCase()} 
                              </Text>
                            </View>
                            <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.05*getConstant('width')}}>
                                    <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                    onSelect={(index, value) => {
                                                      if(value === 'Clone') {
                                                          let r = new CPSRequest();
                                                            r.setRequestFromCAutocall(this.autocall);
                                                            this.props.navigation.dispatch(NavigationActions.navigate({
                                                                routeName: 'Pricer',
                                                                action: NavigationActions.navigate({ routeName: 'PricerEvaluate' , params : {request : r}} ),
                                                            }));
                                                      }
                                    }}
                                    onDropdownWillShow={() => this.setState({ showModalDropdown : true })}
                                    onDropdownWillHide={() => this.setState({ showModalDropdown : false })}
                                    adjustFrame={(f) => {
                                      return {
                                        width: getConstant('width')/2,
                                        height: Math.min(getConstant('height')/3, dataOptions.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                        borderWidth : 1,
                                        borderColor : 'black',
                                        borderRadius : 10
                                      }
                                    }}
                                    renderRow={(option, index, isSelected) => {
                                      switch(option) {
                                        case 'Shadow' :
                                              return (
                                                  <View style={{flexDirection : 'row', height: 40}}>
                                                      <View style={{flex : 0.8, paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                          <Text style={setFont('500', 16, setColor(''), 'Regular')}>Mode shadow</Text>
                                                      </View>
                                                      <TouchableOpacity style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}
                                                                        onPress={() => {
                                                                          // let optimi = this.state.hideCC ? this.state.optimizer : 'CPN';
                                                                          this.setState({ hideCC : !this.state.hideCC }, () => {
                                                                              this._constructMenu();
                                                                              this.setState({ toto : !this.state.toto });
                                                                          });
                                                                        }}
                                                      >
                                                          <FontAwesome name={this.state.hideCC ? "toggle-on" : "toggle-off"}  size={25} style={{color: setColor('')}}/> 
                                                      </TouchableOpacity>
                                                  </View>
                                              );
                                        case 'Clone' :
                                              return (
                                                    <View style={{height: 40, flex : 0.8, paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                        <Text style={setFont('500', 16, setColor(''), 'Regular')}>Cloner</Text>
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
            <View style={{  width : getConstant('width'), justifyContent : 'center', alignItems : 'center'}}>
                
            <View style={{flexDirection: 'row', width : getConstant('width'), justifyContent: 'flex-start', marginLeft : 35 }}>                                                    
                  <View style={{flex: 0.7, flexDirection: 'column', justifyContent: 'center' , paddingTop: 3, paddingBottom: 3}}>

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
                  <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 20, borderWidth: 0}}>
                      <Text style={setFont('400', 24, 'green', 'Bold')} numberOfLines={1}>        
                          { Numeral(this.autocall.getCoupon()).format('0.00%')} <Text style={setFont('200', 12)}>p.a.
                      </Text></Text>   
                      {/* <Text style={setFont('200', 10, setColor(''))}>R : {this.state.nominal === 0 ? Numeral(this.autocallResult.getUF()).format('0.00%') : currencyFormatDE(this.autocallResult.getUF() * this.state.nominal, 0)} {this.autocallResult.getCurrency()}</Text> */}
                  </View>  
                </View>
  
 












            </View>
            <View style={{  width : getConstant('width'), justifyContent : 'center', alignItems : 'center', borderWidth: 0}}>
                <FLTemplateAutocall autocall={this.autocall} templateType={TEMPLATE_TYPE.AUTOCALL_DETAIL_FULL_TEMPLATE} isEditable={false} source={'Home'}  nominal={this.state.finalNominal} screenWidth={0.9} />
            </View>

            <View style={{backgroundColor: setColor(''), alignItems:'center', justifyContent: 'center', padding: 10}}>
                      <Text style={setFont('500',14,'white', 'Regular')}>INSTRUCTIONS DE COTATION</Text>
                  </View>
                  <View style={{  alignItems:'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={[setFont('300', 14), {padding: 10}]}>Ajoutez vos instructions pour les émetteurs :</Text>
                      <View style={{}}>
                        <TextInput  style={{color: 'black', textAlignVertical:'top', backgroundColor: 'white' , margin : 10, padding: 5, borderWidth :1, borderRadius: 2,width: getConstant('width')-20, height: getConstant('height')*0.15}}
                                  multiline={true}
                                  numberOfLines={5}
                                  placeholder={'Vos instructions...'}
                                  onChangeText={(e) => this.setState({ description : e})}
                                  value={this.state.description}
                                  returnKeyType={'done'}
                                  onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>
                  </View>
                  <View style={{flexDirection: 'row', borderWidth : 0, paddingLeft : 10, paddingRight : 10, paddingTop : 10}}>
                      <View style={{flex: 0.8, borderWidth : 0}}>
                          <Text style={setFont('300', 14, 'black')}>
                              Avez-vous décrit une spécifité au produit non standard ?
                          </Text>
                      </View>
                      <TouchableOpacity style={{flex: 0.2, alignItems:'center', justifyContent: 'center', borderWidth : 0}}
                                        onPress={() => {
                                          this.setState({ isAutomatique : !this.state.isAutomatique })
                                        }}
                      >
                          <MaterialCommunityIcons name={this.state.isAutomatique ? "checkbox-blank-outline" : "check-box-outline"} size={25} />
                      </TouchableOpacity>
                  </View>
                  <View style={{alignItems:'center',  justifyContent: 'center', padding : 15}}>
                    <TouchableOpacity style={{borderWidth: 1, borderColor : setColor('subscribeBlue'), borderRadius : 10, backgroundColor: setColor('subscribeBlue'), padding : 10}}
                                      onPress={() => {
                                        //on envoie le ticket 
                                        this.setState({ isLoadingCreationTicket : true , showModalDescription : false });
                                 
                                        
                                        let productToSend = this.autocall.getProduct();;
                                        productToSend['subject'] = this.autocall.getProductName()  + " " + this.autocall.getMaturityName() + " sur " + this.autocall.getFullUnderlyingName() + " / "  + this.autocall.getFrequencyAutocallTitle().toLowerCase();
                                        productToSend['description'] = this.state.description ==='' ? "Aucune instruction particulière" : this.state.description;
                                        productToSend['type'] = 'Produit structuré';
                                        productToSend['department'] = 'FIN';
                                        productToSend['nominal'] = Number(this.state.nominal);
                                        productToSend['cf_ps_shared'] = false;
                                        
                                        if (productToSend['cf_cpg_choice'] === "Placement Privé") {
                                          productToSend['cf_step_pp'] = "PPDVB";
                                        } else {
                                          productToSend['cf_step_ape'] = "APEDVB";
                                        }
                                        
                                        //date de fin de resolution du ticket 
                                        //si PP dans 3 jours fin de journée
                                        let due_byDate = Moment(Date.now()).add(3, 'days').set({"hour": 17, "minute": 30, "second" : 0}).toDate();
                                        productToSend['due_by'] = Moment.utc(due_byDate).format();
                                        // console.log(Moment.utc(due_byDate).format());
                                        let fr_due_byDate = Moment(Date.now()).add(1, 'days').set({"hour": 17, "minute": 15, "second" : 0}).toDate();
                                        productToSend['fr_due_by'] = Moment.utc(fr_due_byDate).format();


                                        //quel mode va rentrer le ticket
                                        productToSend['cf_ps_mode'] = this.state.isAutomatique ? "Automatique" : "Specifique";
                                        
                                        productToSend['UF'] = this.autocall.getUF();
                                        productToSend['UFAsso'] = this.autocall.getUFAssoc();
                                        //console.log(productToSend);

                                       //"due_by": 2020-05-03T15:30:00.912Z,

                                        ssCreateStructuredProduct(this.props.firebase, productToSend)
                                       .then((data) => {
                                          //console.log("USER CREE AVEC SUCCES DANS ZOHO");
                                          
                                          console.log("SUCCES CREATION TICKET");
                                          
                                          let t = new CWorkflowTicket(data.data);
                                          this.props.addTicket(t);
                                          console.log("TICKET AJOUTE");
                                          this.setState({ isLoadingCreationTicket : false }, () => {
                                            this.props.navigation.navigate('FLTicketDetailTicket', {ticket : t});
                                          })
                                        })
                                        .catch(error => {
                                           console.log("ERREUR CREATION TICKET: " + error);
                                           this.setState({ isLoadingCreationTicket : false }, () => alert('ERREUR CREATION DE TICKET', '' + error));
                                          
                                        });
                                        
                                      }}
                    >
                      <Text style={[setFont('400',14,'white', 'Bold'), {margin : 5}]}>DEMANDER LE PRIX</Text>
                    </TouchableOpacity>
                  </View>



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
export default hoistStatics(composedStructuredProductDetail)(FLAutocallDetailTrade);