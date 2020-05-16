import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Modal, Alert, StatusBar, TouchableHighlight} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import AnimatedProgressWheel from 'react-native-progress-wheel';

import RobotBlink from "../../../assets/svg/robotBlink.svg";

import { WebView } from 'react-native-webview';

import { URL_AWS } from '../../../API/APIAWS';

import { globalStyle, setFont, setColor } from '../../../Styles/globalStyle'

import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../../Session/withAuthentication';
import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import * as TEMPLATE_TYPE from '../../../constants/template'

import { searchProducts } from '../../../API/APIAWS';

import { FLPDIDetail } from '../../Pricer/description/FLPDIDetail';
import { FLPhoenixBarrierDetail } from '../../Pricer/description/FLPhoenixBarrierDetail';
import { FLFreqDetail } from '../../Pricer/description/FLFreqDetail';
import { FLUFDetail } from '../../Pricer/description/FLUFDetail';
import { FLAirbagDetail} from '../../Pricer/description/FLAirbagDetail';

import { isIphoneX, ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isAndroid , getConstant } from '../../../Utils';
import { interpolateBestProducts } from '../../../Utils/interpolatePrices';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';


import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { VictoryGroup, VictoryChart, VictoryBar, VictoryTheme, VictoryPie, VictoryLabel, VictoryContainer, VictoryLegend } from "victory-native";
import {Svg, G } from 'react-native-svg';
import { createIconSetFromFontello } from 'react-native-vector-icons';





class FLTemplateAutocall extends React.Component {


  constructor(props) {
    super(props);

    this.state = {

      isGoodToShow : typeof this.props.isGoodToShow !== 'undefined' ? this.props.isGoodToShow : true,
      isEditable : typeof this.props.isEditable !== 'undefined' ? this.props.isEditable : false,
      showModalUpdate : false,
      messageLoading: '',
      nominal : typeof this.props.nominal !== 'undefined' ? this.props.nominal  : 2020,
      toto : true,
    }

    //ensemble des modal dropdown
    this._dropdown = {};

    //console.log(this.props.object);

    //type de tycket
    this.type = this.props.hasOwnProperty('templateType')  ? this.props.templateType : TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE;
    this.originalType = this.props.hasOwnProperty('templateType')  ? this.props.templateType : TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE;

    //ce qui a été calculé sur le ticket : CPN ou CC
    this.optimizer = this.props.hasOwnProperty('optimizer')  ? this.props.optimizer : 'CPN';

   
    this.stdColor = setColor('');
    this.stdLightColor = setColor('lightBlue');
    this.separateBorderColor = 'black'; 
    this.stdBorderRadius = 10;
    this.stdShadowOpacity = 0.9;
    if (this.type === TEMPLATE_TYPE.AUTOCALL_TICKET_TEMPLATE) {
      this.stdColor = 'black';
      this.stdLightColor = 'gainsboro';
      this.stdBorderRadius = 0;
      this.separateBorderColor = setColor('lightBlue');
      this.stdShadowOpacity = 0;
      this.type = TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE;
    }
    //largeur de la cartouche sur l'ecran
    
    switch (this.type) {
      case TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE : this.screenWidth = 0.9; break;
      case TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE : this.screenWidth = 0.9; break;
      case TEMPLATE_TYPE.AUTOCALL_SHORT_TEMPLATE : this.screenWidth = 0.5; break;
      default : this.screenWidth = 0.975; break;
    }
    this.screenWidth = this.props.hasOwnProperty('screenWidth') ? this.props.screenWidth : this.screenWidth;
    this.screenWidth = this.screenWidth * getConstant('width');

          
    //l'objet autocall Classe
    this.autocall = new CAutocall(this.props.object);
    if (this.optimizer === 'CC') {
      this.autocall.setUF(-this.autocall.getPrice());
    }
    this.autocallResult = new CAutocall(this.props.object);

    this.request = new CPSRequest();
    this.request.setRequestFromCAutocall(this.autocall);

   
    
  }

  componentDidMount() {

  }

  UNSAFE_componentWillReceiveProps (props) {
 
    typeof props.isGoodToShow !== 'undefined' ? this.setState({ isGoodToShow : props.isGoodToShow }) : null;
    if (typeof props.nominal !== 'undefined' ) {
      this.state.nominal !== props.nominal ? this.setState({ nominal : props.nominal }, this._updateNominal()) : null;
    }
    
  }
 
 _updateNominal() {
    this._updateValue('nominal', this.state.nominal, currencyFormatDE(this.state.nominal) );
    this._recalculateProduct();
 }


_renderRecalculateProduct() {
        //on est en train de recalculer le produit
        /*
                          <AnimatedProgressWheel 
                      size={60} 
                      width={4} 
  
                      //progress={45}
                      //backgroundColor={'orange'}
                      progress={100}
                      animateFromValue={0}
                      duration={5000}
                      color={'white'}
                      fullColor={setColor('darkBlue')}
                  />
                  <View style={{marginTop: 20}}>
                    <Text style={setFont('300', 14, 'white')}>{this.state.messageLoading}</Text>
                  </View>
                  */
                 //<RobotBlink width={120} height={120} />

        if (this.state.messageLoading !== '') {
              return (
                    <View style={{justifyContent: 'center', alignItems: 'center', padding : 10, backgroundColor:'white', height : 170}}>
                      <WebView source={{uri: URL_AWS + '/svg?page=robotFlash'}} style={{  width : 150, height : 100, marginTop: isAndroid() ? -60 : -70, marginLeft : -50}} scalesPageToFit={true}
                        startInLoadingState={true}
                        renderLoading={() => <RobotBlink width={120} height={120} />}
                        />
                        
                  
                    </View>
              );
        } 
}

 _renderModalUpdate ()  {
   let render = null;


   return (
   
    <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.showModalUpdate}
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
          let verifX = x < getConstant('width')*0  || x > getConstant('width') ? true : false;
          let verifY = y < getConstant('height')*0.5  || y > getConstant('height') ? true : false;
          if (verifX || verifY) {
            //console.log("passe la ");
            this.setState({showModalUpdate : false})
          }
        }}

      >
        <View 
          //directionalLockEnabled={true} 
          //contentContainerStyle={{
            style={{
              flexDirection: 'column',
              backgroundColor: 'white',
              borderWidth :0,
              borderColor : setColor('darkBlue'),
              borderRadius:5,
              width: getConstant('width'),
              height: getConstant('height')*0.5,
              top:  getConstant('height')*0.5,
              left : getConstant('width')*0,

          }}
        >
                    <View style={{    height: 20,
                                      backgroundColor: 'white',
                                      justifyContent : 'center',
                                      alignItems : 'center',
                                      borderTopRightRadius : 10,
                                      borderTopLeftRadius : 10,}} 
                    >
                      <View style={{width: getConstant('width')/3, height : 4, backgroundColor: setColor('')}}><Text></Text></View>
                    </View>
                    <View style={{flex:0.1 , flexDirection: 'row',justifyContent: 'center',alignItems: 'flex-start', borderWidth: 0}}>
                          <View  style={{flex : 0.15, justifyContent: 'center',alignItems: 'flex-end', borderWidth: 0}}>
                            
                          </View>
                          <View style={{flex : 0.7, justifyContent: 'center',alignItems: 'center', borderWidth: 0}}>
                                <Text style={[setFont('600', 21), { textAlign: 'center'}]}>
                                  AIDE
                                </Text>
                          </View>
                          <TouchableOpacity  style={{flex : 0.15, justifyContent: 'center',alignItems: 'center', borderWidth: 0}}
                                             onPress={() => {
                                                    this.setState({ showModalUpdate : false });
                                                }}
                          >
                                <Ionicons name="md-close"  size={25} style={{color : "red"}}/>
                          </TouchableOpacity>
                      </View>
                      {render}
        </View>
      </View>
    </Modal>
  );
               
           
  //  return <FLPDIDetail updateValue={this._updateValue} initialValue={this.autocall.getBarrierPDI()}/>;
}

_updateValue=(id, value, valueLabel) =>{
  console.log(id + "  :  "+value+"  :  "+valueLabel);
  this.request.setCriteria(id, value, valueLabel);
  
}

_recalculateProduct(){
  //console.log("OPTIMIZER : "+ this.optimizer);
  this.setState({ messageLoading : 'Interrogation du marché...', isGoodToShow : true, isRobotFlashSVGLoafingFinished : false });
  
  searchProducts(this.props.firebase, this.request.getCriteria())
  .then((data) => {
    this.setState({ messageLoading : 'Réception et analyse des prix' });

    var autocall = interpolateBestProducts(data, this.request);
    console.log("APRES SGHZJGJ SEARCH PRODUCT");
    if (autocall.length === 1){
      //console.log("RESULTAT DE L'AUTOCALL");
      //console.log(autocall[0]);
      this.autocallResult.updateProduct(autocall[0]);
      if (this.props.hasOwnProperty('callbackUpdate')) {
        this.props.callbackUpdate(this.autocallResult);
      }
      //this.request.setRequestFromCAutocall(this.autocallResult);
      //this.request = new CPSRequest();
      //this.request.setRequestFromCAutocall(this.autocallResult);
      //this.autocall = this.autocallResult;
      //this.setState({ toto: !this.state.toto });
    } else if (autocall.length === 0) {
      alert("Pas résultat possible.\nModifiez vos critères.");
    }

    this.setState({ messageLoading : '', isGoodToShow : true});
    
  })
  .catch(error => {
    console.log("ERREUR recup prix: " + error);
    alert('ERREUR calcul des prix', '' + error);
    this.setState({ isLoading : false , messageLoading : ''});
  });
}

_renderHeaderShortTemplate() {

  return (

                <TouchableOpacity   style={{flexDirection : 'row', backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'center' , borderWidth : 0, paddingTop: 3}}
                        onPress={() => {
                          this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                            autocall: this.autocallResult,
                            //ticketType: TICKET_TYPE.PSCREATION
                          })
                        }}
                >                                                    
                  <View style={{flex : 0.7, borderWidth : 0, paddingLeft : 10, }}>
                      <View>
                        <Text style={setFont('400', 20, setColor('darkBlue'), 'Bold')} numberOfLines={1}>
                          {this.autocall.getProductName()} 
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>

                          <Text style={setFont('400', 13, setColor('darkBlue'), 'Regular')} numberOfLines={1}>   
                            {this.autocall.getFullUnderlyingName(this.props.categories).toUpperCase()}
                          </Text>   
                      </View>
                  </View>
                  <View style={{flex : 0.3,  borderWidth: 0, paddingRight : 5,  borderTopRightRadius: 10, backgroundColor : 'white', alignItems: 'center', justifyContent : 'center', borderColor: 'white'}}>
               
                        <Text style={setFont('400', 18, this.state.messageLoading !== '' ? this.stdColor : setColor('darkBlue'), 'Bold')} numberOfLines={1}>
                            { this.state.messageLoading !== '' ? 'X.XX%' : Numeral(this.autocallResult.getCoupon()).format('0.00%')}
                        </Text>
                        <Text style={setFont('300', 10, )}> {' p.a.'}</Text>   

 
           
                  </View>

    
                </TouchableOpacity>
  
  );
}

_renderHeaderMediumTemplate() {
  let dataUnderlyingAutocall = this.props.getAllUndelyings();
  let dataProductName = ['Athéna', 'Phoenix', 'Reverse convertible'];
  let dataAuction = ["Appel public à l'épargne",'Placement Privé'];
  return (

                <View style={{
                              paddingLeft : 20,  
                              backgroundColor: 'white', 
                              borderTopLeftRadius: this.stdBorderRadius, 
                              borderTopRightRadius: this.stdBorderRadius, 
                              borderBottomWidth :1,
                              borderBottomColor : this.separateBorderColor,
                              //borderBottomradius : setColor('gray'),
                              flexDirection: 'row',
                              justifyContent: 'space-between'
                              //paddingTop: 5,
                              //paddingBottom: 5,
                              }}
                >                                                    
                  <View style={{flexDirection: 'column', justifyContent: 'center' , paddingTop: 3, paddingBottom: 3}}>
                  <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0}}
                            onPress={() => {
                              this.state.isEditable ? this._dropdown['type'].show() : null;
                              
                            }}
                            activeOpacity={this.state.isEditable ? 0.2 : 1}
                    >
                    <View style={{ borderWidth: 0}}>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                    onSelect={(index, value) => {
                                      switch (Number(index))  {
                                         case 0 :   //athena
                                            this._updateValue('type', 'athena', value);
                                            this._updateValue('barrierPhoenix', 1, "100%");
                                            this._updateValue('isIncremental', true, "incremental");
                                            this._updateValue('isMemory', true, "Effet mémoire");
                                            break;
                                         case 1 : 
                                            this._updateValue('type', 'phoenix', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this.autocallResult.getDegressiveStep() !== 0 ? this._updateValue('degressiveStep', 0, 'sans stepdown'): null;
                                            this.autocallResult.getAirbagCode() !== 'NA' ? this._updateValue('airbagLevel', 'NA', 'Non airbag') : null;
                                            this.autocallResult.getBarrierPhoenix() === 1 ?  this._updateValue('barrierPhoenix', 0.9, "90%") : null;
                                            break;
                                         case 2 : 
                                            this._updateValue('type', 'reverse', value);
                                            this._updateValue('nncp', 12, '1 an');
                                            this._updateValue('type', 'reverse', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('autocallLevel', 99.99, 'pas de rappel');
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('airbagLevel', 'NA', 'Non airbag');
                                            this._updateValue('freq', '1M', "1 mois");
                                            this._updateValue('barrierPhoenix', 0, "0%");
                                            break;
                                      }
                          
               
                                      this._recalculateProduct();
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        width: getConstant('width')/2,
                                        height: Math.min(getConstant('height')/3, dataProductName.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                      }
                                    }}
                                    defaultIndex={dataProductName.indexOf(this.autocallResult.getProductTypeName())}
                                    options={dataProductName}
                                    ref={component => this._dropdown['type'] = component}
                                    disabled={!this.state.isEditable}
                                >
                                  <Text style={setFont('400', isAndroid() ? 16 : 18, this.request.isUpdated('type') ? setColor('subscribeBlue') : this.stdColor)}>
                                      {this.autocallResult.getProductName()} 
                                  </Text>
                          </ModalDropdown>
                        </View>
                        { this.state.isEditable ?
                          <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding : 2}}>
                            <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('type') ? setColor('subscribeBlue') : this.stdColor}}/> 
                          </View>
                        : null
                          }
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'row'}}
                            onPress={() => {
                              this.state.isEditable ? this._dropdown['underlying'].show() : null;
                              
                            }}
                            activeOpacity={this.state.isEditable ? 0.2 : 1}
                    >
                    
                            <ModalDropdown
                              //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                              //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                              dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                              dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                              onSelect={(index, value) => {
                                  let code = [ value ];
                    
                                  this._updateValue('underlying', code, value);
                                  this._recalculateProduct();
                              }}
                              adjustFrame={(f) => {
                                return {
                                  width: getConstant('width')/3,
                                  height: Math.min(getConstant('height')/3, dataUnderlyingAutocall.length * 40),
                                  left : f.left,
                                  right : f.right,
                                  top: f.top,
                                }
                              }}
                              defaultIndex={dataUnderlyingAutocall.indexOf(this.autocallResult.getUnderlyingTicker())}
                              ref={component => this._dropdown['underlying'] = component}
                              options={dataUnderlyingAutocall}
                              disabled={!this.state.isEditable}
                          >
                            <Text style={setFont('400', isAndroid() ? 16 :18, this.request.isUpdated('underlying') ? setColor('subscribeBlue') : this.stdColor)}>
                                {this.autocallResult.getFullUnderlyingName(this.props.categories)} <Text style={setFont('400', 18, this.stdColor)}>{''}</Text>
                            </Text>
                          </ModalDropdown>
           
                          { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding: 2}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('underlying') ? setColor('subscribeBlue') : this.stdColor}}/> 
                            </View>
                          : null
                           }
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'row'}}
                            onPress={() => {
                              this.state.isEditable ? this._dropdown['auction'].show() : null;
                              
                            }}
                            activeOpacity={this.state.isEditable ? 0.2 : 1}
                    >
                    
                            <ModalDropdown
                              //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                              //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                              dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                              dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                              onSelect={(index, value) => {
                                  let code = 'PP';
                                 
                                  if (Number(index) === 0) {
                                    code = 'APE'
                                  } else {
                                    code = 'PP';
                                  }
                                  this._updateValue('typeAuction', code, value);
                                  this._recalculateProduct();
                              }}
                              adjustFrame={(f) => {
                                return {
                                  width: getConstant('width')/2,
                                  height: Math.min(getConstant('height')/3, dataAuction.length * 40),
                                  left : f.left,
                                  right : f.right,
                                  top: f.top,
                                }
                              }}
                              defaultIndex={dataAuction.indexOf(this.autocallResult.getAuctionType())}
                              ref={component => this._dropdown['auction'] = component}
                              options={dataAuction}
                              disabled={!this.state.isEditable}
                          >
                            <Text style={setFont('400', 14, this.request.isUpdated('typeAuction') ? setColor('subscribeBlue') : this.stdColor)}>
                                {this.originalType !== TEMPLATE_TYPE.AUTOCALL_TICKET_TEMPLATE ? this.autocallResult.getAuctionType() : null}
                            </Text>
                          </ModalDropdown>
                          { this.state.isEditable ?
                          <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding : 2}}>
                            <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('typeAuction') ? setColor('subscribeBlue') : this.stdColor}}/> 
                          </View>
                        : null
                          }
                    </TouchableOpacity>
                  </View>
                  <View style={{ padding: 5, alignItems: 'center', justifyContent: 'center', paddingRight: 5, borderWidth: 0}}>
                      <Text style={setFont('400', 24, 'green')} numberOfLines={1}>        
                          { Numeral(this.autocallResult.getCoupon()).format('0.00%')} <Text style={setFont('200', 12)}>p.a.
                      </Text></Text>   
                      <Text style={setFont('200', 12)}>R : {this.state.nominal === 0 ? Numeral(this.autocallResult.getUF()).format('0.00%') : currencyFormatDE(this.autocallResult.getUF() * this.state.nominal, 0)} {this.autocallResult.getCurrency()}</Text>
                  </View>  
                </View>
  
  );
}

_renderHeaderFullTemplate() {
  
  let dataUnderlyingAutocall = this.props.getAllUndelyings();
  //let dataProductName = STRUCTUREDPRODUCTS.map((p) => p.name);
  let dataProductName = ['Athéna', 'Phoenix', 'Reverse convertible'];
  

  return (
          <View style={{flex : 0.35, flexDirection : 'row'}}>
                <View style={{
                              flex : 0.6, 
                              flexDirection : 'column', 
                              paddingLeft : 20,  
                              backgroundColor: setColor(''), 
                              borderTopLeftRadius: 10, 
                              //borderRadius: 14,
                              borderBottomWidth :  0,

                              }}
                >                                                    
                  <View style={{flex : 0.6, flexDirection: 'column', justifyContent: 'center' }}>
                  <TouchableOpacity style={{flexDirection: 'row'}}
                            onPress={() => {
                              this.state.isEditable ? this._dropdown['type'].show() : null;
                              
                            }}
                            activeOpacity={this.state.isEditable ? 0.2 : 1}
                    >
                    <View style={{ borderWidth: 0, paddingTop : isAndroid() ? 0 : 2}}>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                    onSelect={(index, value) => {
                                      this._updateValue('autocallLevel', 1, 'rappel ATM');
                                      switch (Number(index))  {
                                         case 0 :   //athena
                                            this._updateValue('type', 'athena', value);
                                            this._updateValue('barrierPhoenix', 1, "100%");
                                            this._updateValue('isIncremental', true, "incremental");
                                            this._updateValue('isMemory', true, "Effet mémoire");
                                            break;
                                         case 1 : 
                                            this._updateValue('type', 'phoenix', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this.autocallResult.getDegressiveStep() !== 0 ? this._updateValue('degressiveStep', 0, 'sans stepdown'): null;
                                            this.autocallResult.getAirbagCode() !== 'NA' ? this._updateValue('airbagLevel', 'NA', 'Non airbag') : null;
                                            this.autocallResult.getBarrierPhoenix() === 1 ?  this._updateValue('barrierPhoenix', 0.9, "90%") : null;
                                            break;
                                         case 2 : 
                                            this._updateValue('type', 'reverse', value);
                                            this._updateValue('nncp', 12, '1 an');
                                            this._updateValue('type', 'reverse', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('autocallLevel', 99.99, 'pas de rappel');
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('airbagLevel', 'NA', 'Non airbag');
                                            this._updateValue('freq', '1M', "1 mois");
                                            this._updateValue('barrierPhoenix', 0, "0%");
                                            break;
                                      }
                          
               
                                      this._recalculateProduct();
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        width: getConstant('width')/2,
                                        height: Math.min(getConstant('height')/3, dataProductName.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                      }
                                    }}
                                    defaultIndex={dataProductName.indexOf(this.autocallResult.getProductTypeName())}
                                    options={dataProductName}
                                    ref={component => this._dropdown['type'] = component}
                                    disabled={!this.state.isEditable}
                                >
                                  <Text style={setFont('400', isAndroid() ? 16 : 18, this.request.isUpdated('type') ? setColor('subscribeBlue') : 'white')}>
                                      {this.autocallResult.getProductName()} 
                                  </Text>
                          </ModalDropdown>
                        </View>
                        { this.state.isEditable ?
                          <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding : 2}}>
                            <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('type') ? setColor('subscribeBlue') : 'white'}}/> 
                          </View>
                        : null
                          }
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'row', paddingTop : 0, borderWidth: 0, justifyContent: 'flex-start', alignItems : 'flex-start'}}
                            onPress={() => {
                              this.state.isEditable ? this._dropdown['underlying'].show() : null;
                              
                            }}
                            activeOpacity={this.state.isEditable ? 0.2 : 1}
                    >
                    
                            <ModalDropdown
                              //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                              //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                              dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                              dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                              onSelect={(index, value) => {
                                  let code = [ value ];
                    
                                  this._updateValue('underlying', code, value);
                                  this._recalculateProduct();
                              }}
                              adjustFrame={(f) => {
                                return {
                                  width: getConstant('width')/3,
                                  height: Math.min(getConstant('height')/3, dataUnderlyingAutocall.length * 40),
                                  left : f.left,
                                  right : f.right,
                                  top: f.top,
                                }
                              }}
                              defaultIndex={dataUnderlyingAutocall.indexOf(this.autocallResult.getUnderlyingTicker())}
                              ref={component => this._dropdown['underlying'] = component}
                              options={dataUnderlyingAutocall}
                              disabled={!this.state.isEditable}
                          >
                            <Text style={setFont('400', isAndroid() ? 16 : 18, this.request.isUpdated('underlying') ? setColor('subscribeBlue') : 'white')}>
                                {this.autocallResult.getFullUnderlyingName(this.props.categories)} <Text style={setFont('400', 18, 'white')}>{''}</Text>
                            </Text>
                          </ModalDropdown>
           
                          { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding: 2}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('underlying') ? setColor('subscribeBlue') : 'white'}}/> 
                            </View>
                          : null
                           }
                    </TouchableOpacity>
                  </View>
                </View>
                {this.optimizer === 'CPN' 
                ?
                    <TouchableOpacity style={{flex : 0.4, flexDirection : 'column', borderWidth: 0,  borderTopRightRadius: 10}}
                                      onPress={() => {
                                          this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                                            autocall: this.autocallResult,
                                          })
                                      }}
                    >
                      <View style={{flex : 0.5, backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, marginTop:0, borderWidth: 0, borderColor: 'white', borderTopRightRadius :10}}>
                        <Text style={setFont('400', 24, this.state.messageLoading !== '' ? this.stdColor : 'green')} numberOfLines={1}>
                            { this.state.messageLoading !== '' ? 'X.XX%' : Numeral(this.autocallResult.getCoupon()).format('0.00%')}
                            <Text style={setFont('200', 12)}> { 'p.a.'}</Text>   
                        </Text>  
                      </View> 
                      <View style={{flex : 0.5, paddingTop: 5, paddingBottom: 5, backgroundColor:  setColor('subscribeBlue'), justifyContent: 'center', alignItems: 'center',  borderWidth: 0, }}>
                        <Text style={setFont('400', 14, 'white')}>
                      VOIR >
                        </Text>   
                      </View>
                    </TouchableOpacity>
                :
                    <TouchableOpacity style={{flex : 0.4, flexDirection : 'row', borderWidth: 0,  borderTopRightRadius: 10}}
                                    onPress={() => {
                                        this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                                          autocall: this.autocallResult,
                                        })
                                    }}
                    >
                        <View style={{flex : 0.9, flexDirection : 'column'}}>
                            <View style={{backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, marginTop:0, borderWidth: 0, borderColor: 'white'}}>
                              <Text style={setFont('400', 24, this.state.messageLoading !== '' ? this.stdColor : 'green')} numberOfLines={1}>
                                  { this.state.messageLoading !== '' ? 'X.XX%' : Numeral(this.autocallResult.getCoupon()).format('0.00%')}
                                  <Text style={setFont('200', 12)}> { 'p.a.'}</Text>   
                              </Text>  
                            </View> 
                            <View style={{flex : 0.5, paddingTop: 5, paddingBottom: 5, backgroundColor:  'white', justifyContent: 'center', alignItems: 'center',  borderWidth: 0, }}>
                              <Text style={setFont('400', 14, 'black')}>
                                    R : {Numeral(this.autocall.getUF()).format('0.00%')}
                              </Text>   
                            </View>
                        </View>
                        <View style={{flex : 0.1, padding: 3, backgroundColor:  setColor('subscribeBlue'), alignItems: 'center', justifyContent : 'center',  borderTopRightRadius: 10}}>
                          <Text style={setFont('400', 20, 'white')}>></Text>
                        </View>
                    </TouchableOpacity>
                  }

              </View>
  
  );
}

_renderHeaderFullTemplate2() {
  
  let dataUnderlyingAutocall = this.props.getAllUndelyings();
  //let dataProductName = STRUCTUREDPRODUCTS.map((p) => p.name);
  let dataProductName = ['Athéna', 'Phoenix', 'Reverse convertible'];
  

  return (
          <View style={{flex : 0.35, flexDirection : 'row'}}>
                <View style={{ flex : 0.6, flexDirection : 'column',  paddingLeft : 15,   backgroundColor: 'white',  borderTopLeftRadius: 10, borderBottomWidth :  0,}} >                                                    
                  <View style={{flex : 0.6, flexDirection: 'column', justifyContent: 'center' }}>
                  <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems : 'center'}}
                            onPress={() => {
                              this.state.isEditable ? this._dropdown['type2'].show() : null;
                              
                            }}
                            activeOpacity={this.state.isEditable ? 0.2 : 1}
                    >
                    <View style={{ borderWidth: 0, paddingTop : isAndroid() ? 0 : 2}}>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                                    onSelect={(index, value) => {
                                      this._updateValue('autocallLevel', 1, 'rappel ATM');
                                      switch (Number(index))  {
                                         case 0 :   //athena
                                            this._updateValue('type', 'athena', value);
                                            this._updateValue('barrierPhoenix', 1, "100%");
                                            this._updateValue('isIncremental', true, "incremental");
                                            this._updateValue('isMemory', true, "Effet mémoire");
                                            break;
                                         case 1 : 
                                            this._updateValue('type', 'phoenix', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this.autocallResult.getDegressiveStep() !== 0 ? this._updateValue('degressiveStep', 0, 'sans stepdown'): null;
                                            this.autocallResult.getAirbagCode() !== 'NA' ? this._updateValue('airbagLevel', 'NA', 'Non airbag') : null;
                                            this.autocallResult.getBarrierPhoenix() === 1 ?  this._updateValue('barrierPhoenix', 0.9, "90%") : null;
                                            break;
                                         case 2 : 
                                            this._updateValue('type', 'reverse', value);
                                            this._updateValue('nncp', 12, '1 an');
                                            this._updateValue('type', 'reverse', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('autocallLevel', 99.99, 'pas de rappel');
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('airbagLevel', 'NA', 'Non airbag');
                                            this._updateValue('freq', '1M', "1 mois");
                                            this._updateValue('barrierPhoenix', 0, "0%");
                                            break;
                                      }
                          
               
                                      this._recalculateProduct();
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        width: getConstant('width')/2,
                                        height: Math.min(getConstant('height')/3, dataProductName.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                        borderWidth : 1,
                                        borderColor : 'black',
                                        borderRadius : 10
                                      }
                                    }}
                                    renderRow={(rowData,index,isSelected) => {
                                      return (
                                        <TouchableHighlight underlayColor={setColor('')}>
                                          <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                            <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                              {rowData}
                                            </Text>
                                          </View>
                                        </TouchableHighlight>
                                      )
                                    }}
                                    defaultIndex={dataProductName.indexOf(this.autocallResult.getProductTypeName())}
                                    options={dataProductName}
                                    ref={component => this._dropdown['type2'] = component}
                                    disabled={!this.state.isEditable}
                                >
                                  <Text style={setFont('400', 22, this.request.isUpdated('type') ? setColor('subscribeBlue') : setColor('darkBlue'), 'Bold')}>
                                      {this.autocallResult.getProductName()} 
                                  </Text>
                          </ModalDropdown>
                        </View>
                        { this.state.isEditable ?
                          <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding : 2}}>
                            <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('type') ? setColor('subscribeBlue') : setColor('darkBlue')}}/> 
                          </View>
                        : null
                          }
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'row', paddingTop : 0, borderWidth: 0, justifyContent: 'flex-start', alignItems : 'center'}}
                            onPress={() => {
                              this.state.isEditable ? this._dropdown['underlying2'].show() : null;
                              
                            }}
                            activeOpacity={this.state.isEditable ? 0.2 : 1}
                    >
                    
                            <ModalDropdown
                              //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                              //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                              dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                              dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                              onSelect={(index, value) => {
                                  let code = [ value ];
                    
                                  this._updateValue('underlying', code, value);
                                  this._recalculateProduct();
                              }}
                              adjustFrame={(f) => {
                                return {
                                  width: getConstant('width')/2,
                                  height: Math.min(getConstant('height')/3, dataUnderlyingAutocall.length * 40),
                                  left : f.left,
                                  right : f.right,
                                  top: f.top,
                                  borderWidth : 1,
                                  borderColor : 'black',
                                  borderRadius : 10
                                }
                              }}
                              renderRow={(rowData,index,isSelected) => {
                                return (
                                  <TouchableHighlight underlayColor={setColor('')}>
                                    <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                      <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                        {rowData}
                                      </Text>
                                    </View>
                                  </TouchableHighlight>
                                )
                              }}
                              defaultIndex={dataUnderlyingAutocall.indexOf(this.autocallResult.getUnderlyingTicker())}
                              ref={component => this._dropdown['underlying2'] = component}
                              options={dataUnderlyingAutocall}
                              disabled={!this.state.isEditable}
                          >
                            <Text style={setFont('400',  14, this.request.isUpdated('underlying') ? setColor('subscribeBlue') : setColor('darkBlue'), 'Regular')}>
                                {this.autocallResult.getFullUnderlyingName(this.props.categories).toUpperCase()}
                            </Text>
                          </ModalDropdown>
           
                          { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding: 2}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('underlying') ? setColor('subscribeBlue') : setColor('darkBlue')}}/> 
                            </View>
                          : null
                           }
                    </TouchableOpacity>
                  </View>
                </View>
                {this.optimizer === 'CPN' 
                ?
                    <TouchableOpacity style={{flex : 0.4,  borderWidth: 0,  borderTopRightRadius: 10, backgroundColor : 'white', alignItems: 'center', justifyContent : 'center', borderColor: 'white'}}
                                      onPress={() => {
                                          this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                                            autocall: this.autocallResult,
                                          })
                                      }}
                    >
               
                        <Text style={setFont('400', 26, this.state.messageLoading !== '' ? this.stdColor : setColor('darkBlue'), 'Bold')} numberOfLines={1}>
                            { this.state.messageLoading !== '' ? 'X.XX%' : Numeral(this.autocallResult.getCoupon()).format('0.00%')}
                            <Text style={setFont('300', 12, )}> {' p.a.'}</Text>   
                        </Text>  
 
           
                    </TouchableOpacity>
                :
                    <TouchableOpacity style={{flex : 0.4, flexDirection : 'row', borderWidth: 0,  borderTopRightRadius: 10}}
                                    onPress={() => {
                                        this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                                          autocall: this.autocallResult,
                                        })
                                    }}
                    >
                        <View style={{flex : 1, flexDirection : 'column', borderWidth : 0}}>
                            <View style={{backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, paddingTop : 2,  borderColor: 'white'}}>
                              <Text style={setFont('400', 26, this.state.messageLoading !== '' ? this.stdColor : setColor('darkBlue'), 'Bold')} numberOfLines={1}>
                                  { this.state.messageLoading !== '' ? 'X.XX%' : Numeral(this.autocallResult.getCoupon()).format('0.00%')}
                                  <Text style={setFont('300', 12)}> {' p.a.'}</Text>   
                              </Text>  
                            </View> 
                            <View style={{flex : 0.5, paddingTop: 1, backgroundColor:  'white', justifyContent: 'center', alignItems: 'center',  borderWidth: 0, }}>
                              <Text style={setFont('200', 12, setColor('darkBlue'))}>
                                    R : {Numeral(this.autocall.getUF()).format('0.00%')}
                              </Text>   
                            </View>
                        </View>
      
                    </TouchableOpacity>
                  }

              </View>
  
  );
}

_renderAutocallFullTemplate() {

  //remplissage des dropdown
  let dataPhoenixBarrier = ['-70%','-60%','-55%','-50%','-45%','-40%','-35%','-30%','-25%','-20%','-15%','-10%'];
  let dataPDIBarrier = ['-70%','-65%','-60%','-55%','-50%','-45%','-40%','-35%','-30%','-25%','-20%','-15%','-10%'];
  let dataNNCP = ['1 an','2 ans','3 ans'];
  let dataFreqAutocall = ['Mensuel','Trimestriel','Semestriel','Annuel'];
  let dataMemoryAutocall = ['Effet mémoire','Non mémoire'];
  let dataAirbagAutocall = ['Non Airbag','Semi-Airbag','Airbag'];
  let dataDSAutocall = ['sans stepdown','1% / an','2% / an','3% / an','4% / an','5% / an'];
  let dataMaturityAutocall = ['1 an','2 ans','3 ans','4 ans','5 ans','6 ans','7 ans','8 ans','9 ans','10 ans'];

  //console.log("this.autocall : " + this.autocall.getProductName());
  //console.log("this.autocallResult : " + this.autocallResult.getProductName());

  //il s'agit d'un reverse convertible
  if (this.autocallResult.getProductShortName() === 'reverse'){
    return (
      <View style={{flexDirection : 'row', backgroundColor: 'white', paddingTop:5, height : 150 }}>
        <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
           <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
                {String('maturité\n').toUpperCase()}
            </Text>         
          </View>
          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center' }}
                             onPress={() => {
                               this.state.isEditable ? this._dropdown['maturity'].show() : null;
                               
                             }}
                             activeOpacity={this.state.isEditable? 0.2 : 1}
           >
               <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"calendar"}  size={18} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
                 <ModalDropdown
                       //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                       //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                       dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                       dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                       onSelect={(index, value) => {
                           let code = [ Number(index)+1, Number(index) +1 ];
             
                           this._updateValue('maturity', code, value);
                           this._recalculateProduct();
                       }}
                       adjustFrame={(f) => {
                         return {
                           width: getConstant('width')/3,
                           height: Math.min(getConstant('height')/3, dataMaturityAutocall.length * 40),
                           left : f.left,
                           right : f.right,
                           top: f.top,
                         }
                       }}
                       defaultIndex={this.autocallResult.getMaturityInMonths()/12-1}
                       ref={component => this._dropdown['maturity'] = component}
                       options={dataMaturityAutocall}
                       disabled={!this.state.isEditable}
                   >
                     <Text style={setFont('500', 16, (this.request.isUpdated('maturity')) ? setColor('subscribeBlue'): this.stdLightColor, 'Bold')}>
                         {this.autocallResult.getMaturityName()}
                     </Text>
                   </ModalDropdown>
               </View>
               { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
           </TouchableOpacity>
   
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0, paddingTop: 10}}>
             <View style={{ width :25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
               <MaterialCommunityIcons name={"ticket-percent"}  size={18} style={{color: this.request.isUpdated() ? setColor('subscribeBlue') : this.stdLightColor}}/> 
             </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={[setFont('200', 11, this.request.isUpdated() ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                 {Numeral(this.autocallResult.getCoupon()*this.autocallResult.getFrequencyPhoenixNumber()/12).format('0.00%')} 
                 <Text style={setFont('200', 11, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular')}>{' '+ this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>
               </Text>
             </View>
          </View>

        </View>   
        <View style={{flex: 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
            <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
                {String('fréquence\n').toUpperCase()}
            </Text>         
          </View>

          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center' }}
                             onPress={() => {
                               this.state.isEditable  ? this._dropdown['freq'].show() : null;
                               
                             }}
                             activeOpacity={this.state.isEditable ? 0.2 : 1}
          >
               <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"alarm-multiple"}  size={18} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                   <ModalDropdown
                           //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                           //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                           dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                           dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                           onSelect={(index, value) => {
                               let f = '1Y';
                               switch(dataFreqAutocall.indexOf(value)){
                                 case 0 : 
                                   f = '1M';
                                   break;
                                 case 1 :
                                   f = '3M';
                                   break;
                                 case 2 : 
                                   f = '6M';
                                   break;
                                 case 3 : 
                                   f = '1Y';
                                   break;
                                 default : break;
                               }
                               this._updateValue('freq', f, value);
                               this._recalculateProduct();
   
                           }}
                           adjustFrame={(f) => {
                             return {
                               width: getConstant('width')/3,
                               height: Math.min(getConstant('height')/3, dataFreqAutocall.length * 40),
                               left : f.left,
                               right : f.right,
                               top: f.top,
                             }
                           }}
                           defaultIndex={dataFreqAutocall.indexOf(this.autocallResult.getFrequencyAutocallTitle())}
                           //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                           ref={component => this._dropdown['freq'] = component}
                           options={dataFreqAutocall}
                           disabled={!this.state.isEditable}
                       >
                         <Text style={[setFont('500', 16, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                           {this.autocallResult.getFrequencyAutocallTitle().toLowerCase()} 
                         </Text>
                       </ModalDropdown>
                 </View>
                 { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
         </TouchableOpacity>
        </View>                                             
        <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
            <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
             {String('protection \ncapital').toUpperCase()}
            </Text>         
          </View>
          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                           onPress={() => {
                             this.state.isEditable ? this._dropdown['barrierPDI'].show() : null;
                             
                           }}
                           activeOpacity={this.state.isEditable? 0.2 : 1}
          >
               <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"shield"}  size={18} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
                 <ModalDropdown
                   //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                   textStyle={setFont('500', 16, (this.request.isUpdated('barrierPDI')) ? setColor('subscribeBlue'): this.stdLightColor, 'Bold')}
                   dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                   dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                     onSelect={(index, value) => {
                       this._updateValue('barrierPDI', Math.round(100*(Numeral(value).value() +1))/100, value);
                       this._recalculateProduct();
   
                   }}
                   adjustFrame={(f) => {
                     return {
                       width: getConstant('width')/3,
                       height: Math.min(getConstant('height')/3, dataPDIBarrier.length * 40),
                       left : f.left,
                       right : f.right,
                       top: f.top,
                     }
                   }}
                   defaultIndex={dataPDIBarrier.indexOf(Numeral(this.autocallResult.getBarrierPDI() - 1).format('0%'))}
                   defaultValue={Numeral(this.autocallResult.getBarrierPDI()- 1).format('0%')}
                   ref={component => this._dropdown['barrierPDI'] = component}
                   options={dataPDIBarrier}
                   disabled={!this.state.isEditable}
                 />
               </View>
               { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
           </TouchableOpacity>  
        </View>          
      </View>
     )
  }

  return (
   <View style={{flexDirection : 'row', backgroundColor: 'white', paddingTop:5 , height : 165}}>
     <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
        <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
             {String('protection \ncoupon').toUpperCase()}
         </Text>         
       </View>
       <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                        onPress={() => {
                          (this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1) ? this._dropdown['barrierPhoenix'].show() : null;
                          
                        }}
                        activeOpacity={(this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1)  ? 0.2 : 1}
       >
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"shield-half-full"}  size={18} style={{color: this.request.isUpdated('barrierPhoenix') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
              <ModalDropdown
                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                    textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                      onSelect={(index, value) => {
                        this._updateValue('barrierPhoenix', Math.round(100*(Numeral(value).value() +1))/100, value);
                        this._recalculateProduct();

                    }}
                    adjustFrame={(f) => {
                      return {
                        width: getConstant('width')/3,
                        height: Math.min(getConstant('height')/3, dataPhoenixBarrier.length * 40),
                        left : f.left,
                        right : f.right,
                        top: f.top,
                      }
                    }}
                    defaultIndex={dataPhoenixBarrier.indexOf(Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%'))}
                    defaultValue={Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%')}
                    ref={component => this._dropdown['barrierPhoenix'] = component}
                    options={dataPhoenixBarrier}
                    disabled={this.state.isEditable ? this.autocallResult.getBarrierPhoenix() === 1 ? true : false : !this.state.isEditable}
                />
            </View>
            { (this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1)   ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('barrierPhoenix') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
       </TouchableOpacity>

       <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0, paddingTop: 10}}>
          <View style={{ width :25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
            <MaterialCommunityIcons name={"ticket-percent"}  size={18} style={{color: this.request.isUpdated() ? setColor('subscribeBlue') : this.stdLightColor}}/> 
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
             <Text style={[setFont('200', 11, this.request.isUpdated() ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
              {Numeral(this.autocallResult.getCoupon()*this.autocallResult.getFrequencyPhoenixNumber()/12).format('0.00%')} 
              <Text style={setFont('200', 11, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular')}>{' '+ this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>
            </Text>
          </View>
       </View>

       <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', paddingTop : 10}}
                          onPress={() => {
                                this.state.isEditable ? this._dropdown['isMemory'].show() : null;
                              }}
                          activeOpacity={this.state.isEditable ? 0.2 : 1}
       >
            <View style={{ width : 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"memory"}  size={18} style={{color: this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0 }}>
                <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                        onSelect={(index, value) => {
                            //console.log(index + "    - " + value);
                            this._updateValue('isMemory', index == 0  ? true : false, value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: getConstant('width')/3,
                            height: Math.min(getConstant('height')/3, dataMemoryAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.isMemory() ? 0 : 1}
                        defaultValue={dataMemoryAutocall[this.autocallResult.isMemory() ? 0 : 1]}
                        ref={component => this._dropdown['isMemory'] = component}
                        options={dataMemoryAutocall}
                        disabled={!this.state.isEditable}
                    >
                     <Text style={[setFont('200', 11, this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                       {this.autocallResult.isMemory() ? 'mémoire': 'sans mémoire'}
                     </Text>
                   </ModalDropdown>
            </View>
            { this.state.isEditable  ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
      </TouchableOpacity>
      { (this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1))  ?
      <TouchableOpacity style={{flexDirection: 'row',  borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', paddingTop : 10}}
                                    onPress={() => {
                                      (this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1)) ? this._dropdown['airbag'].show() : null;
                                      
                                    }}
                                    activeOpacity={(this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1)) ? 0.2 : 1}
      > 

            <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}

            >
              <MaterialCommunityIcons name={"airbag"}  size={18} style={{color: this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{borderWidth: 0,flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2}}>
                    <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                        onSelect={(index, value) => {
                          
                            var code = 'NA';
                            switch (Number(index))  {
                                case 1 : code = 'SA'; break;
                                case 2 : code = 'FA'; break;
                            }
                            this._updateValue('airbagLevel', code, value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: getConstant('width')/3,
                            height: Math.min(getConstant('height')/3, dataAirbagAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.getAirbagCode() === 'NA' ?  0 : (this.autocallResult.getAirbagCode() === 'SA' ? 1 : 2)}
                        options={dataAirbagAutocall}
                        ref={component => this._dropdown['airbag'] = component}
                        disabled={this.state.isEditable ? (this.autocallResult.getBarrierPhoenix() === 1 ? false : true) : true}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                        {this.autocallResult.getAirbagTitle()}
                      </Text>
                    </ModalDropdown>
            </View>
          
            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>

      </TouchableOpacity>
      : null
    }
     </View>   
     <View style={{flex: 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
         <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
             RAPPELS DU {'\n'}PRODUIT
         </Text>         
       </View>
       <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"gavel"}  size={18} style={{color: this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2}}>
              <Text style={[setFont('500', 16, this.stdLightColor, 'Bold'), {textAlign: 'center'}]}>
               { Numeral(this.autocallResult.getAutocallLevel()).format('0%')}
              </Text>
            </View>
       </View>
       <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', paddingTop: 10  }}
                          onPress={() => {
                            this.state.isEditable  ? this._dropdown['freq'].show() : null;
                            
                          }}
                          activeOpacity={this.state.isEditable ? 0.2 : 1}
       >
            <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"alarm-multiple"}  size={18} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                        onSelect={(index, value) => {
                            let f = '1Y';
                            switch(dataFreqAutocall.indexOf(value)){
                              case 0 : 
                                f = '1M';
                                break;
                              case 1 :
                                f = '3M';
                                break;
                              case 2 : 
                                f = '6M';
                                break;
                              case 3 : 
                                f = '1Y';
                                break;
                              default : break;
                            }
                            this._updateValue('freq', f, value);
                            this._recalculateProduct();

                        }}
                        adjustFrame={(f) => {
                          return {
                            width: getConstant('width')/3,
                            height: Math.min(getConstant('height')/3, dataFreqAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={dataFreqAutocall.indexOf(this.autocallResult.getFrequencyAutocallTitle())}
                        //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                        ref={component => this._dropdown['freq'] = component}
                        options={dataFreqAutocall}
                        disabled={!this.state.isEditable}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]}>
                        {this.autocallResult.getFrequencyAutocallTitle().toLowerCase()} 
                      </Text>
                    </ModalDropdown>
              </View>
              { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
      </TouchableOpacity>
      <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', paddingTop : 10}}
                        onPress={() => {
                          this.state.isEditable  ? this._dropdown['nncp'].show() : null;
                          
                        }}
                        activeOpacity={this.state.isEditable ? 0.2 : 1}
      >
            <View style={{ width: 25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"clock-start"}  size={18} style={{color: this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
             <ModalDropdown
                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                  onSelect={(index, value) => {
                    let nncp = 12;
                    switch(dataNNCP.indexOf(value)){
                      case 0 : 
                        nccp = 12;
                        break;
                      case 1 :
                        nccp = 24;
                        break;
                      case 2 : 
                        nccp = 36;
                        break;
                      default : break;
                    }
                    this._updateValue('nncp', nccp, value);
                    this._recalculateProduct();

                }}
                adjustFrame={(f) => {
                  return {
                    width: getConstant('width')/3,
                    height: Math.min(getConstant('height')/3, dataNNCP.length * 40),
                    left : f.left,
                    right : f.right,
                    top: f.top,
                  }
                }}
                defaultIndex={dataNNCP.indexOf(this.request.getValue('nncp'))}
                //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                ref={component => this._dropdown['nncp'] = component}
                options={dataNNCP}
                disabled={!this.state.isEditable}
            >
                      <Text style={[setFont('200', 11, this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]}>
                        {this.request.getNNCPLabel()}
                      </Text>
          </ModalDropdown>
          </View>
          { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
      </TouchableOpacity>
      { (this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1)  ?
      <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', paddingTop : 10}}
                                   onPress={() => {
                                    (this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1)  ? this._dropdown['degressiveStep'].show() : null;
                                    
                                  }}
                                  activeOpacity={(this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1) ? 0.2 : 1}
       >
            <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'space-between'}}>
              <MaterialCommunityIcons name={"trending-down"}  size={18} style={{color: this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2}}>
                  <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                        onSelect={(index, value) => {
                          console.log("DS : " + index);
                            this._updateValue('degressiveStep', Number(index), value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: getConstant('width')/3,
                            height: Math.min(getConstant('height')/3, dataDSAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.getDegressiveStep()}
                        ref={component => this._dropdown['degressiveStep'] = component}
                        options={dataDSAutocall}
                        disabled={this.state.isEditable ? (this.autocallResult.getBarrierPhoenix() === 1 ? false : true) : true}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('degressiveStep') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                           {this.autocallResult.getDegressiveStep() === 0 ? 'sans stepdown' : (Numeral(this.autocallResult.getDegressiveStep()/100).format('0%') +' / an')}
                      </Text>
                  </ModalDropdown>
            </View>

            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('degressiveStep') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>

       </TouchableOpacity>
       : null
      }
     </View>                                             
     <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
         <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
          {String('protection \ncapital').toUpperCase()}
         </Text>         
       </View>
       <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                        onPress={() => {
                          this.state.isEditable ? this._dropdown['barrierPDI'].show() : null;
                          
                        }}
                        activeOpacity={this.state.isEditable? 0.2 : 1}
       >
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"shield"}  size={18} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
              <ModalDropdown
                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                textStyle={setFont('500', 16, (this.request.isUpdated('barrierPDI')) ? setColor('subscribeBlue'): this.stdLightColor, 'Bold')}
                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                  onSelect={(index, value) => {
                    this._updateValue('barrierPDI', Math.round(100*(Numeral(value).value() +1))/100, value);
                    this._recalculateProduct();

                }}
                adjustFrame={(f) => {
                  return {
                    width: getConstant('width')/3,
                    height: Math.min(getConstant('height')/3, dataPDIBarrier.length * 40),
                    left : f.left,
                    right : f.right,
                    top: f.top,
                  }
                }}
                defaultIndex={dataPDIBarrier.indexOf(Numeral(this.autocallResult.getBarrierPDI() - 1).format('0%'))}
                defaultValue={Numeral(this.autocallResult.getBarrierPDI()- 1).format('0%')}
                ref={component => this._dropdown['barrierPDI'] = component}
                options={dataPDIBarrier}
                disabled={!this.state.isEditable}
              />
            </View>
            { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
        </TouchableOpacity>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2, paddingTop : 16, borderLeftWidth : 0}}>
          <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
              {String('maturité').toUpperCase()}
          </Text>         
       </View>
        <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', borderLeftWidth : 0}}
                          onPress={() => {
                            this.state.isEditable ? this._dropdown['maturity'].show() : null;
                            
                          }}
                          activeOpacity={this.state.isEditable? 0.2 : 1}
        >
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"calendar"}  size={18} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
              <ModalDropdown
                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                    onSelect={(index, value) => {
                        let code = [ Number(index)+1, Number(index) +1 ];
          
                        this._updateValue('maturity', code, value);
                        this._recalculateProduct();
                    }}
                    adjustFrame={(f) => {
                      return {
                        width: getConstant('width')/3,
                        height: Math.min(getConstant('height')/3, dataMaturityAutocall.length * 40),
                        left : f.left,
                        right : f.right,
                        top: f.top,
                      }
                    }}
                    defaultIndex={this.autocallResult.getMaturityInMonths()/12-1}
                    ref={component => this._dropdown['maturity'] = component}
                    options={dataMaturityAutocall}
                    disabled={!this.state.isEditable}
                >
                  <Text style={setFont('500', 16, (this.request.isUpdated('maturity')) ? setColor('subscribeBlue'): this.stdLightColor, 'Bold')}>
                      {this.autocallResult.getMaturityName()}
                  </Text>
                </ModalDropdown>
            </View>
            { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
        </TouchableOpacity>

     </View>    
     
   
   </View>
  )
}

_renderAutocallFullTemplate2() {

  //remplissage des dropdown
  let dataPhoenixBarrier = ['-70%','-60%','-55%','-50%','-45%','-40%','-35%','-30%','-25%','-20%','-15%','-10%'];
  let dataPDIBarrier = ['-70%','-65%','-60%','-55%','-50%','-45%','-40%','-35%','-30%','-25%','-20%','-15%','-10%'];
  let dataNNCP = ['1 an','2 ans','3 ans'];
  let dataFreqAutocall = ['Mensuel','Trimestriel','Semestriel','Annuel'];
  let dataMemoryAutocall = ['Effet mémoire','Non mémoire'];
  let dataAirbagAutocall = ['Non Airbag','Semi-Airbag','Airbag'];
  let dataDSAutocall = ['sans stepdown','1% / an','2% / an','3% / an','4% / an','5% / an'];
  let dataMaturityAutocall = ['1 an','2 ans','3 ans','4 ans','5 ans','6 ans','7 ans','8 ans','9 ans','10 ans'];


  let couponsOk = Math.floor(Math.random() * (95 - 55 + 1)) + 55;
  let pairOk = Math.round(Math.random() *(100 - couponsOk));
  
  //console.log("this.autocall : " + this.autocall.getProductName());
  //console.log("this.autocallResult : " + this.autocallResult.getProductName());

  //il s'agit d'un reverse convertible
  if (this.autocallResult.getProductShortName() === 'reverse'){
    return (
      <View style={{flexDirection : 'row', backgroundColor: 'white', paddingTop:5, height : 150 }}>
        <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
           <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
                {String('maturité\n').toUpperCase()}
            </Text>         
          </View>
          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center' }}
                             onPress={() => {
                               this.state.isEditable ? this._dropdown['maturity'].show() : null;
                               
                             }}
                             activeOpacity={this.state.isEditable? 0.2 : 1}
           >
               <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"calendar"}  size={18} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
                 <ModalDropdown
                       //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                       //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                       dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                       dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                       onSelect={(index, value) => {
                           let code = [ Number(index)+1, Number(index) +1 ];
             
                           this._updateValue('maturity', code, value);
                           this._recalculateProduct();
                       }}
                       adjustFrame={(f) => {
                         return {
                           width: getConstant('width')/3,
                           height: Math.min(getConstant('height')/3, dataMaturityAutocall.length * 40),
                           left : f.left,
                           right : f.right,
                           top: f.top,
                         }
                       }}
                       defaultIndex={this.autocallResult.getMaturityInMonths()/12-1}
                       ref={component => this._dropdown['maturity'] = component}
                       options={dataMaturityAutocall}
                       disabled={!this.state.isEditable}
                   >
                     <Text style={setFont('500', 16, (this.request.isUpdated('maturity')) ? setColor('subscribeBlue'): this.stdLightColor, 'Bold')}>
                         {this.autocallResult.getMaturityName()}
                     </Text>
                   </ModalDropdown>
               </View>
               { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
           </TouchableOpacity>
   
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0, paddingTop: 10}}>
             <View style={{ width :25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
               <MaterialCommunityIcons name={"ticket-percent"}  size={18} style={{color: this.request.isUpdated() ? setColor('subscribeBlue') : this.stdLightColor}}/> 
             </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={[setFont('200', 11, this.request.isUpdated() ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                 {Numeral(this.autocallResult.getCoupon()*this.autocallResult.getFrequencyPhoenixNumber()/12).format('0.00%')} 
                 <Text style={setFont('200', 11, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular')}>{' '+ this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>
               </Text>
             </View>
          </View>

        </View>   
        <View style={{flex: 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
            <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
                {String('fréquence\n').toUpperCase()}
            </Text>         
          </View>

          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center' }}
                             onPress={() => {
                               this.state.isEditable  ? this._dropdown['freq'].show() : null;
                               
                             }}
                             activeOpacity={this.state.isEditable ? 0.2 : 1}
          >
               <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"alarm-multiple"}  size={18} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                   <ModalDropdown
                           //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                           //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                           dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                           dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                           onSelect={(index, value) => {
                               let f = '1Y';
                               switch(dataFreqAutocall.indexOf(value)){
                                 case 0 : 
                                   f = '1M';
                                   break;
                                 case 1 :
                                   f = '3M';
                                   break;
                                 case 2 : 
                                   f = '6M';
                                   break;
                                 case 3 : 
                                   f = '1Y';
                                   break;
                                 default : break;
                               }
                               this._updateValue('freq', f, value);
                               this._recalculateProduct();
   
                           }}
                           adjustFrame={(f) => {
                             return {
                               width: getConstant('width')/3,
                               height: Math.min(getConstant('height')/3, dataFreqAutocall.length * 40),
                               left : f.left,
                               right : f.right,
                               top: f.top,
                             }
                           }}
                           defaultIndex={dataFreqAutocall.indexOf(this.autocallResult.getFrequencyAutocallTitle())}
                           //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                           ref={component => this._dropdown['freq'] = component}
                           options={dataFreqAutocall}
                           disabled={!this.state.isEditable}
                       >
                         <Text style={[setFont('500', 16, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                           {this.autocallResult.getFrequencyAutocallTitle().toLowerCase()} 
                         </Text>
                       </ModalDropdown>
                 </View>
                 { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
         </TouchableOpacity>
        </View>                                             
        <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
            <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
             {String('protection \ncapital').toUpperCase()}
            </Text>         
          </View>
          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                           onPress={() => {
                             this.state.isEditable ? this._dropdown['barrierPDI'].show() : null;
                             
                           }}
                           activeOpacity={this.state.isEditable? 0.2 : 1}
          >
               <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"shield"}  size={18} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
                 <ModalDropdown
                   //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                   textStyle={setFont('500', 16, (this.request.isUpdated('barrierPDI')) ? setColor('subscribeBlue'): this.stdLightColor, 'Bold')}
                   dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                   dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                     onSelect={(index, value) => {
                       this._updateValue('barrierPDI', Math.round(100*(Numeral(value).value() +1))/100, value);
                       this._recalculateProduct();
   
                   }}
                   adjustFrame={(f) => {
                     return {
                       width: getConstant('width')/3,
                       height: Math.min(getConstant('height')/3, dataPDIBarrier.length * 40),
                       left : f.left,
                       right : f.right,
                       top: f.top,
                     }
                   }}
                   defaultIndex={dataPDIBarrier.indexOf(Numeral(this.autocallResult.getBarrierPDI() - 1).format('0%'))}
                   defaultValue={Numeral(this.autocallResult.getBarrierPDI()- 1).format('0%')}
                   ref={component => this._dropdown['barrierPDI'] = component}
                   options={dataPDIBarrier}
                   disabled={!this.state.isEditable}
                 />
               </View>
               { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
           </TouchableOpacity>  
        </View>          
      </View>
     )
  }

  return (
   <View style={{ flexDirection : 'row', backgroundColor: 'white', paddingTop:5}}>
      <View style={{flex : 0.8, borderWidth : 0, marginLeft : 10,  marginTop : 10}}>
            <View style={{flexDirection : 'row',  marginTop : 0, marginBottom : 10}} >

                    <View style={{flex : 0.5, borderWidth : 0, paddingRight : 15}}>
                                    <View style={{marginBottom : 5}}>
                                        <Text style={setFont('200', 12, 'gray')}>Capital</Text>
                                    </View>

                                    <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                                                        onPress={() => {
                                                          this.state.isEditable ? this._dropdown['barrierPDI'].show() : null;
                                                          
                                                        }}
                                                        activeOpacity={this.state.isEditable? 0.2 : 1}
                                      >
                                            <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                              <MaterialCommunityIcons name={"shield"}  size={16} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                              <ModalDropdown
                                                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                                textStyle={[setFont('500', 12, (this.request.isUpdated('barrierPDI')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                                dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                  onSelect={(index, value) => {
                                                    this._updateValue('barrierPDI', Math.round(100*(Numeral(value).value() +1))/100, value);
                                                    this._recalculateProduct();

                                                }}
                                                adjustFrame={(f) => {
                                                  return {
                                                    width: getConstant('width')/3,
                                                    height: Math.min(getConstant('height')/3, dataPDIBarrier.length * 40),
                                                    left : f.left,
                                                    right : f.right,
                                                    top: f.top,
                                                    borderWidth : 1,
                                                    borderColor : 'black',
                                                    borderRadius : 10
                                                  }
                                                }}
                                                renderRow={(rowData,index,isSelected) => {
                                                  return (
                                                    <TouchableHighlight underlayColor={setColor('')}>
                                                      <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                                        <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                                          {rowData}
                                                        </Text>
                                                      </View>
                                                    </TouchableHighlight>
                                                  )
                                                }}
                                                defaultIndex={dataPDIBarrier.indexOf(Numeral(this.autocallResult.getBarrierPDI() - 1).format('0%'))}
                                                defaultValue={Numeral(this.autocallResult.getBarrierPDI()- 1).format('0%')}
                                                ref={component => this._dropdown['barrierPDI'] = component}
                                                options={dataPDIBarrier}
                                                disabled={!this.state.isEditable}
                                              />
                                            </View>
                                            { this.state.isEditable ?
                                                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                                            </View>
                                                          : null
                                            }
                                        </TouchableOpacity>

                            </View>    


                    <View style={{flex : 0.5, borderWidth : 0, paddingRight : 15}}>
                            <View style={{marginBottom : 5}}>
                                <Text style={setFont('200', 12, 'gray')}>Maturité</Text>
                            </View>

                            <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                                                onPress={() => {
                                                  this.state.isEditable ? this._dropdown['maturity'].show() : null;
                                                  
                                                }}
                                                activeOpacity={this.state.isEditable? 0.2 : 1}
                            >
                                  <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                          <MaterialCommunityIcons name={"calendar"}  size={16} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                  </View>
                                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                    <ModalDropdown
                                          //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                          //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                          dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                          dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                          onSelect={(index, value) => {
                                              let code = [ Number(index)+1, Number(index) +1 ];
                                
                                              this._updateValue('maturity', code, value);
                                              this._recalculateProduct();
                                          }}
                                          renderRow={(rowData,index,isSelected) => {
                                            return (
                                              <TouchableHighlight underlayColor={setColor('')}>
                                                <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                                  <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                                    {rowData}
                                                  </Text>
                                                </View>
                                              </TouchableHighlight>
                                            )
                                          }}
                                          adjustFrame={(f) => {
                                            return {
                                              width: getConstant('width')/3,
                                              height: Math.min(getConstant('height')/3, dataMaturityAutocall.length * 35),
                                              left : f.left,
                                              right : f.right,
                                              top: f.top,
                                              borderWidth : 1,
                                              borderColor : 'black',
                                              borderRadius : 10
                                            }
                                          }}
                                          defaultIndex={this.autocallResult.getMaturityInMonths()/12-1}
                                          ref={component => this._dropdown['maturity'] = component}
                                          options={dataMaturityAutocall}
                                          disabled={!this.state.isEditable}
                                      >
                                        <Text style={[setFont('200', 12, this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]}>
                                            {this.autocallResult.getMaturityName()}
                                        </Text>
                                      </ModalDropdown>
                                  </View>
                                  { this.state.isEditable ?
                                                  <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                                    <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                                  </View>
                                                : null
                                  }
                              </TouchableOpacity>

                    </View>  


                    </View>
            <View style={{flexDirection : 'row', borderWidth : 0, height : 105}}>


                    <View style={{flex : 0.5, borderWidth : 0, paddingRight : 15}}>
                                <View style={{marginBottom : 5}}>
                                    <Text style={setFont('200', 12, 'gray')}>Coupons</Text>
                                </View>

                                <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                                                  onPress={() => {
                                                    (this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1) ? this._dropdown['barrierPhoenix'].show() : null;
                                                    
                                                  }}
                                                  activeOpacity={(this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1)  ? 0.2 : 1}
                                >
              

                                      <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        <MaterialCommunityIcons name={"shield-half-full"}  size={16} style={{color: this.request.isUpdated('barrierPhoenix') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                      </View>

                                      <View style={{flex: 1, justifyContent: 'center',  alignItems: 'flex-start', paddingLeft : 5}}>
                                        <ModalDropdown
                                              //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                              textStyle={[setFont('500', 12, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                              dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                              dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                onSelect={(index, value) => {
                                                  this._updateValue('barrierPhoenix', Math.round(100*(Numeral(value).value() +1))/100, value);
                                                  this._recalculateProduct();

                                              }}
                                              adjustFrame={(f) => {
                                                return {
                                                  width: getConstant('width')/3,
                                                  height: Math.min(getConstant('height')/3, dataPhoenixBarrier.length * 40),
                                                  left : f.left,
                                                  right : f.right,
                                                  top: f.top,
                                                  borderWidth : 1,
                                                  borderColor : 'black',
                                                  borderRadius : 10
                                                }
                                              }}
                                              renderRow={(rowData,index,isSelected) => {
                                                return (
                                                  <TouchableHighlight underlayColor={setColor('')}>
                                                    <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                                      <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                                        {rowData}
                                                      </Text>
                                                    </View>
                                                  </TouchableHighlight>
                                                )
                                              }}
                                              defaultIndex={dataPhoenixBarrier.indexOf(Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%'))}
                                              defaultValue={Numeral(this.request.getValue('barrierPhoenix') ).format('0%')}
                                              ref={component => this._dropdown['barrierPhoenix'] = component}
                                              options={dataPhoenixBarrier}
                                              disabled={this.state.isEditable ? this.autocallResult.getBarrierPhoenix() === 1 ? true : false : !this.state.isEditable}
                                          />
                                      </View>
                                      { (this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1)   ?
                                                      <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                                        <MaterialCommunityIcons name={"menu-down-outline"}  size={14} style={{color: this.request.isUpdated('barrierPhoenix') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                                      </View>
                                                    : null
                                      }
                                </TouchableOpacity>





                                <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                                      <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        <MaterialCommunityIcons name={"ticket-percent"}  size={16} style={{color: this.request.isUpdated() ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                      </View>
                                      <View style={{flex: 1, justifyContent: 'center',  alignItems: 'flex-start', paddingLeft : 5}}>
                                            <Text style={[setFont('200', 12, this.request.isUpdated() ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                                                {Numeral(this.autocallResult.getCoupon()*this.autocallResult.getFrequencyPhoenixNumber()/12).format('0.00%')} 
                                                <Text style={setFont('200', 12, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular')}>{' '+ this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>   
                                            </Text>     
                                      </View>
                                </View>




                                <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                                                    onPress={() => {
                                                          this.state.isEditable ? this._dropdown['isMemory'].show() : null;
                                                        }}
                                                    activeOpacity={this.state.isEditable ? 0.2 : 1}
                                >
                                      <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        <MaterialCommunityIcons name={"memory"}  size={18} style={{color: this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                      </View>
                                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                          <ModalDropdown
                                                  //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                                  //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                                  dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                                  dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                  onSelect={(index, value) => {
                                                      //console.log(index + "    - " + value);
                                                      this._updateValue('isMemory', index == 0  ? true : false, value);
                                                      this._recalculateProduct();
                                                  }}
                                                  adjustFrame={(f) => {
                                                    return {
                                                      width: getConstant('width')/2,
                                                      height: Math.min(getConstant('height')/3, dataMemoryAutocall.length * 40),
                                                      left : f.left,
                                                      right : f.right,
                                                      top: f.top,
                                                      borderWidth : 1,
                                                      borderColor : 'black',
                                                      borderRadius : 10
                                                    }
                                                  }}
                                                  renderRow={(rowData,index,isSelected) => {
                                                    return (
                                                      <TouchableHighlight underlayColor={setColor('')}>
                                                        <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                                          <Text style={setFont('400', 18, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                                            {rowData}
                                                          </Text>
                                                        </View>
                                                      </TouchableHighlight>
                                                    )
                                                  }}
                                                  defaultIndex={this.autocallResult.isMemory() ? 0 : 1}
                                                  defaultValue={dataMemoryAutocall[this.autocallResult.isMemory() ? 0 : 1]}
                                                  ref={component => this._dropdown['isMemory'] = component}
                                                  options={dataMemoryAutocall}
                                                  disabled={!this.state.isEditable}
                                              >
                                              <Text style={[setFont('200', 12, this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                                                {this.autocallResult.isMemory() ? 'mémoire': 'sans mémoire'}
                                              </Text>
                                            </ModalDropdown>
                                      </View>
                                      { this.state.isEditable  ?
                                                      <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                                        <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                                      </View>
                                                    : null
                                      }
                                </TouchableOpacity>



                                { (this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1))  ?
                                  <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                                                                onPress={() => {
                                                                  (this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1)) ? this._dropdown['airbag'].show() : null;
                                                                  
                                                                }}
                                                                activeOpacity={(this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1)) ? 0.2 : 1}
                                  > 

                                        <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                          <MaterialCommunityIcons name={"airbag"}  size={18} style={{color: this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                        </View>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                                <ModalDropdown
                                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                    onSelect={(index, value) => {
                                                      
                                                        var code = 'NA';
                                                        switch (Number(index))  {
                                                            case 1 : code = 'SA'; break;
                                                            case 2 : code = 'FA'; break;
                                                        }
                                                        this._updateValue('airbagLevel', code, value);
                                                        this._recalculateProduct();
                                                    }}
                                                    adjustFrame={(f) => {
                                                      return {
                                                        width: getConstant('width')/2,
                                                        height: Math.min(getConstant('height')/3, dataAirbagAutocall.length * 40),
                                                        left : f.left,
                                                        right : f.right,
                                                        top: f.top,
                                                        borderWidth : 1,
                                                        borderColor : 'black',
                                                        borderRadius : 10
                                                      }
                                                    }}
                                                    renderRow={(rowData,index,isSelected) => {
                                                      return (
                                                        <TouchableHighlight underlayColor={setColor('')}>
                                                          <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                                            <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                                              {rowData}
                                                            </Text>
                                                          </View>
                                                        </TouchableHighlight>
                                                      )
                                                    }}
                                                    defaultIndex={this.autocallResult.getAirbagCode() === 'NA' ?  0 : (this.autocallResult.getAirbagCode() === 'SA' ? 1 : 2)}
                                                    options={dataAirbagAutocall}
                                                    ref={component => this._dropdown['airbag'] = component}
                                                    disabled={this.state.isEditable ? (this.autocallResult.getBarrierPhoenix() === 1 ? false : true) : true}
                                                >
                                                  <Text style={[setFont('200', 12, this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                                                    {this.autocallResult.getAirbagTitle()}
                                                  </Text>
                                                </ModalDropdown>
                                        </View>
                                      
                                        <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                          <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                        </View>

                                  </TouchableOpacity>
                                  : null
                                }


                    </View>    


                    <View style={{flex : 0.5, borderWidth : 0, paddingRight : 15}}>
                                <View style={{marginBottom : 5}}>
                                    <Text style={setFont('200', 12, 'gray')}>Rappels</Text>
                                </View>

                                <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }} >
              

                                      <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        <MaterialCommunityIcons name={"gavel"}  size={16} style={{color: this.request.isUpdated('barrierPhoenix') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                      </View>

                                      <View style={{flex: 1, justifyContent: 'center',  alignItems: 'flex-start', paddingLeft : 5}}>
                                            <Text style={[setFont('200', 12, this.request.isUpdated() ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                                                { Numeral(this.autocallResult.getAutocallLevel()).format('0%')}
                                            </Text>     
                                      </View>

                                      
                                </View>





                                <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                                                    onPress={() => {
                                                      this.state.isEditable  ? this._dropdown['freq'].show() : null;
                                                      
                                                    }}
                                                    activeOpacity={this.state.isEditable ? 0.2 : 1}
                                >
                                      <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        <MaterialCommunityIcons name={"alarm-multiple"}  size={16} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                      </View>
                                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                          <ModalDropdown
                                                  //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                                  //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                                                  dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                                  dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                  onSelect={(index, value) => {
                                                      let f = '1Y';
                                                      switch(dataFreqAutocall.indexOf(value)){
                                                        case 0 : 
                                                          f = '1M';
                                                          break;
                                                        case 1 :
                                                          f = '3M';
                                                          break;
                                                        case 2 : 
                                                          f = '6M';
                                                          break;
                                                        case 3 : 
                                                          f = '1Y';
                                                          break;
                                                        default : break;
                                                      }
                                                      this._updateValue('freq', f, value);
                                                      this._recalculateProduct();

                                                  }}
                                                  adjustFrame={(f) => {
                                                    return {
                                                      width: getConstant('width')/3,
                                                      height: Math.min(getConstant('height')/3, dataFreqAutocall.length * 40),
                                                      left : f.left,
                                                      right : f.right,
                                                      top: f.top,
                                                      borderWidth : 1,
                                                      borderColor : 'black',
                                                      borderRadius : 10
                                                    }
                                                  }}
                                                  renderRow={(rowData,index,isSelected) => {
                                                    return (
                                                      <TouchableHighlight underlayColor={setColor('')}>
                                                        <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                                          <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                                            {rowData}
                                                          </Text>
                                                        </View>
                                                      </TouchableHighlight>
                                                    )
                                                  }}
                                                  defaultIndex={dataFreqAutocall.indexOf(this.autocallResult.getFrequencyAutocallTitle())}
                                                  //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                                                  ref={component => this._dropdown['freq'] = component}
                                                  options={dataFreqAutocall}
                                                  disabled={!this.state.isEditable}
                                              >
                                                <Text style={[setFont('200', 12, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]}>
                                                  {this.autocallResult.getFrequencyAutocallTitle().toLowerCase()} 
                                                </Text>
                                              </ModalDropdown>
                                        </View>
                                        { this.state.isEditable ?
                                                      <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                                        <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                                      </View>
                                                    : null
                                      }
                                </TouchableOpacity>




                                <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                                                  onPress={() => {
                                                    this.state.isEditable  ? this._dropdown['nncp'].show() : null;
                                                    
                                                  }}
                                                  activeOpacity={this.state.isEditable ? 0.2 : 1}
                                >
                                      <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        <MaterialCommunityIcons name={"clock-start"}  size={16} style={{color: this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                      </View>
                                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                      <ModalDropdown
                                          //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                          //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                                          dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                          dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                            onSelect={(index, value) => {
                                              let nncp = 12;
                                              switch(dataNNCP.indexOf(value)){
                                                case 0 : 
                                                  nncp = 12;
                                                  break;
                                                case 1 :
                                                  nncp = 24;
                                                  break;
                                                case 2 : 
                                                  nncp = 36;
                                                  break;
                                                default : break;
                                              }
                                              this._updateValue('nncp', nncp, value);
                                              this._recalculateProduct();

                                          }}
                                          adjustFrame={(f) => {
                                            return {
                                              width: getConstant('width')/3,
                                              height: Math.min(getConstant('height')/3, dataNNCP.length * 40),
                                              left : f.left,
                                              right : f.right,
                                              top: f.top,
                                              borderWidth : 1,
                                              borderColor : 'black',
                                              borderRadius : 10
                                            }
                                          }}
                                          renderRow={(rowData,index,isSelected) => {
                                            return (
                                              <TouchableHighlight underlayColor={setColor('')}>
                                                <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                                  <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                                    {rowData}
                                                  </Text>
                                                </View>
                                              </TouchableHighlight>
                                            )
                                          }}
                                          defaultIndex={dataNNCP.indexOf(this.request.getValue('nncp'))}
                                          //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                                          ref={component => this._dropdown['nncp'] = component}
                                          options={dataNNCP}
                                          disabled={!this.state.isEditable}
                                      >
                                                <Text style={[setFont('200', 12, this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]}>
                                                  {this.request.getNNCPLabel()}
                                                </Text>
                                    </ModalDropdown>
                                    </View>
                                    { this.state.isEditable ?
                                                      <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                                        <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                                      </View>
                                                    : null
                                      }
                                </TouchableOpacity>



                                { (this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1)  ?
                                  <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                                                              onPress={() => {
                                                                (this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1)  ? this._dropdown['degressiveStep'].show() : null;
                                                                
                                                              }}
                                                              activeOpacity={(this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1) ? 0.2 : 1}
                                  >
                                        <View style={{ borderLeftWidth: 1, borderLeftColor : setColor(''),  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                          <MaterialCommunityIcons name={"trending-down"}  size={16} style={{color: this.stdLightColor}}/> 
                                        </View>
                                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                              <ModalDropdown
                                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                                    onSelect={(index, value) => {
                                                      console.log("DS : " + index);
                                                        this._updateValue('degressiveStep', Number(index), value);
                                                        this._recalculateProduct();
                                                    }}
                                                    adjustFrame={(f) => {
                                                      return {
                                                        width: getConstant('width')/2,
                                                        height: Math.min(getConstant('height')/3, dataDSAutocall.length * 40),
                                                        left : f.left,
                                                        right : f.right,
                                                        top: f.top,
                                                        borderWidth : 1,
                                                        borderColor : 'black',
                                                        borderRadius : 10
                                                      }
                                                    }}
                                                    renderRow={(rowData,index,isSelected) => {
                                                      return (
                                                        <TouchableHighlight underlayColor={setColor('')}>
                                                          <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                                            <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                                              {rowData}
                                                            </Text>
                                                          </View>
                                                        </TouchableHighlight>
                                                      )
                                                    }}
                                                    defaultIndex={this.autocallResult.getDegressiveStep()}
                                                    ref={component => this._dropdown['degressiveStep'] = component}
                                                    options={dataDSAutocall}
                                                    disabled={this.state.isEditable ? (this.autocallResult.getBarrierPhoenix() === 1 ? false : true) : true}
                                                >
                                                  <Text style={[setFont('200', 12, this.request.isUpdated('degressiveStep') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                                                      {this.autocallResult.getDegressiveStep() === 0 ? 'sans stepdown' : (Numeral(this.autocallResult.getDegressiveStep()/100).format('0%') +' / an')}
                                                  </Text>
                                              </ModalDropdown>
                                        </View>

                                        <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                          <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('degressiveStep') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                                        </View>

                                  </TouchableOpacity>
                                  : null
                                  }


                    </View>    

                    
                      
            </View>


      </View>     
      <View style={{flex : 0.2, borderWidth : 0, marginRight : 10, marginTop : 10,}} >
          <View style={{marginBottom : 5}}>
              <Text style={setFont('200', 12, 'gray')}>Probabilités</Text>
          </View>

              <View style={{borderWidth : 0, height : 80}}>
                  
                      <VictoryPie data={[{ y: couponsOk }, { y: pairOk }, { y: (100 - couponsOk - pairOk) }]} 
                                  origin={{ x: 0.2*(0.9*getConstant('width') - 10)/2, y: 40 }}
                                  //origin={{ x: 20, y: 20 }}
                                  width={150} 
                                  height={150} 
                                  colorScale={[setColor('subscribeticket'), setColor(''), '#C04848']} 
                                  labelComponent={<VictoryLabel  style={{fontSize : 10, fill : 'gray'}} />}
                                  innerRadius={10}  
                                  animate={{ easing: 'exp' }}
                                  labels={( data ) => data.y+'%'}
                                  labelRadius={28}
                                  startAngle={-120}
                                  
                      />
              </View>
              <View style={{marginTop : 0, borderWidth: 0, height : 60}}>
                      <VictoryLegend x={5} y={10}
                                      //title="Legend"
                                      centerTitle
                                      orientation="vertical"
                                      rowGutter={0}
                                      height={100}
                                      style={{ labels: {fontSize: 11 } }}
                                      symbolSpacer={2}
                                      labelComponent={<VictoryLabel  dx={3} style={{fontSize : isAndroid() ? 10 : 12, fill : 'gray'}} />}
                                      data={[
                                        { name: "Coupons", symbol: { fill: setColor('subscribeticket'), type: "square" } },
                                        { name: "Pair", symbol: { fill: setColor(''), type: "square"} },
                                        { name: "Capital", symbol: { fill: "#C04848", type: "square" } }
                                      ]}
                                      
                      />
              </View>
    
                                  
      </View>                  

    </View>
         

  );

}

_renderAutocallMediumTemplate() {

  //remplissage des dropdown
  let dataPhoenixBarrier = ['-70%','-60%','-55%','-50%','-45%','-40%','-35%','-30%','-25%','-20%','-15%','-10%'];
  let dataPDIBarrier = ['-70%','-65%','-60%','-55%','-50%','-45%','-40%','-35%','-30%','-25%','-20%','-15%','-10%'];
  let dataNNCP = ['1 an','2 ans','3 ans'];
  let dataFreqAutocall = ['Mensuel','Trimestriel','Semestriel','Annuel'];
  let dataMemoryAutocall = ['Effet mémoire','Non mémoire'];
  let dataAirbagAutocall = ['Non Airbag','Semi-Airbag','Airbag'];
  let dataDSAutocall = ['sans stepdown','1% / an','2% / an','3% / an','4% / an','5% / an'];
  let dataMaturityAutocall = ['1 an','2 ans','3 ans','4 ans','5 ans','6 ans','7 ans','8 ans','9 ans','10 ans'];

  //console.log("this.autocall : " + this.autocall.getProductName());
  //console.log("this.autocallResult : " + this.autocallResult.getProductName());

  //il s'agit d'un reverse convertible
  if (this.autocallResult.getProductShortName() === 'reverse'){
    return (
      <View style={{flexDirection : 'row', backgroundColor: 'white', paddingTop:5, height : 150 }}>
        <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
           <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
                {String('maturité\n').toUpperCase()}
            </Text>         
          </View>
          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center' }}
                             onPress={() => {
                               this.state.isEditable ? this._dropdown['maturity'].show() : null;
                               
                             }}
                             activeOpacity={this.state.isEditable? 0.2 : 1}
           >
               <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"calendar"}  size={18} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
                 <ModalDropdown
                       //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                       //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                       dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                       dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                       onSelect={(index, value) => {
                           let code = [ Number(index)+1, Number(index) +1 ];
             
                           this._updateValue('maturity', code, value);
                           this._recalculateProduct();
                       }}
                       adjustFrame={(f) => {
                         return {
                           width: getConstant('width')/3,
                           height: Math.min(getConstant('height')/3, dataMaturityAutocall.length * 40),
                           left : f.left,
                           right : f.right,
                           top: f.top,
                         }
                       }}
                       defaultIndex={this.autocallResult.getMaturityInMonths()/12-1}
                       ref={component => this._dropdown['maturity'] = component}
                       options={dataMaturityAutocall}
                       disabled={!this.state.isEditable}
                   >
                     <Text style={setFont('500', 16, (this.request.isUpdated('maturity')) ? setColor('subscribeBlue'): this.stdLightColor, 'Bold')}>
                         {this.autocallResult.getMaturityName()}
                     </Text>
                   </ModalDropdown>
               </View>
               { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
           </TouchableOpacity>
   
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0, paddingTop: 10}}>
             <View style={{ width :25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
               <MaterialCommunityIcons name={"ticket-percent"}  size={18} style={{color: this.request.isUpdated() ? setColor('subscribeBlue') : this.stdLightColor}}/> 
             </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={[setFont('200', 11, this.request.isUpdated() ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                 {Numeral(this.autocallResult.getCoupon()*this.autocallResult.getFrequencyPhoenixNumber()/12).format('0.00%')} 
                 <Text style={setFont('200', 11, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular')}>{' '+ this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>
               </Text>
             </View>
          </View>

        </View>   
        <View style={{flex: 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
            <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
                {String('fréquence\n').toUpperCase()}
            </Text>         
          </View>

          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center' }}
                             onPress={() => {
                               this.state.isEditable  ? this._dropdown['freq'].show() : null;
                               
                             }}
                             activeOpacity={this.state.isEditable ? 0.2 : 1}
          >
               <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"alarm-multiple"}  size={18} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                   <ModalDropdown
                           //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                           //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                           dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                           dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                           onSelect={(index, value) => {
                               let f = '1Y';
                               switch(dataFreqAutocall.indexOf(value)){
                                 case 0 : 
                                   f = '1M';
                                   break;
                                 case 1 :
                                   f = '3M';
                                   break;
                                 case 2 : 
                                   f = '6M';
                                   break;
                                 case 3 : 
                                   f = '1Y';
                                   break;
                                 default : break;
                               }
                               this._updateValue('freq', f, value);
                               this._recalculateProduct();
   
                           }}
                           adjustFrame={(f) => {
                             return {
                               width: getConstant('width')/3,
                               height: Math.min(getConstant('height')/3, dataFreqAutocall.length * 40),
                               left : f.left,
                               right : f.right,
                               top: f.top,
                             }
                           }}
                           defaultIndex={dataFreqAutocall.indexOf(this.autocallResult.getFrequencyAutocallTitle())}
                           //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                           ref={component => this._dropdown['freq'] = component}
                           options={dataFreqAutocall}
                           disabled={!this.state.isEditable}
                       >
                         <Text style={[setFont('500', 16, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                           {this.autocallResult.getFrequencyAutocallTitle().toLowerCase()} 
                         </Text>
                       </ModalDropdown>
                 </View>
                 { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
         </TouchableOpacity>
        </View>                                             
        <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
          <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
            <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
             {String('protection \ncapital').toUpperCase()}
            </Text>         
          </View>
          <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                           onPress={() => {
                             this.state.isEditable ? this._dropdown['barrierPDI'].show() : null;
                             
                           }}
                           activeOpacity={this.state.isEditable? 0.2 : 1}
          >
               <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                 <MaterialCommunityIcons name={"shield"}  size={18} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
               </View>
               <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
                 <ModalDropdown
                   //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                   textStyle={setFont('500', 16, (this.request.isUpdated('barrierPDI')) ? setColor('subscribeBlue'): this.stdLightColor, 'Bold')}
                   dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                   dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                     onSelect={(index, value) => {
                       this._updateValue('barrierPDI', Math.round(100*(Numeral(value).value() +1))/100, value);
                       this._recalculateProduct();
   
                   }}
                   adjustFrame={(f) => {
                     return {
                       width: getConstant('width')/3,
                       height: Math.min(getConstant('height')/3, dataPDIBarrier.length * 40),
                       left : f.left,
                       right : f.right,
                       top: f.top,
                     }
                   }}
                   defaultIndex={dataPDIBarrier.indexOf(Numeral(this.autocallResult.getBarrierPDI() - 1).format('0%'))}
                   defaultValue={Numeral(this.autocallResult.getBarrierPDI()- 1).format('0%')}
                   ref={component => this._dropdown['barrierPDI'] = component}
                   options={dataPDIBarrier}
                   disabled={!this.state.isEditable}
                 />
               </View>
               { this.state.isEditable ?
                               <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                                 <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                               </View>
                             : null
               }
           </TouchableOpacity>  
        </View>          
      </View>
     )
  }

  return (
   <View style={{flexDirection : 'row', backgroundColor: 'white', paddingTop:5 , height : 165}}>
     <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
        <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
             {String('protection \ncoupon').toUpperCase()}
         </Text>         
       </View>
       <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                        onPress={() => {
                          (this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1) ? this._dropdown['barrierPhoenix'].show() : null;
                          
                        }}
                        activeOpacity={(this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1)  ? 0.2 : 1}
       >
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"shield-half-full"}  size={18} style={{color: this.request.isUpdated('barrierPhoenix') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
              <ModalDropdown
                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                    textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdColor, this.request.isUpdated('barrierPhoenix') ? 'Bold' : 'Light'), {textAlign: 'center'}]}
                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                      onSelect={(index, value) => {
                        this._updateValue('barrierPhoenix', Math.round(100*(Numeral(value).value() +1))/100, value);
                        this._recalculateProduct();

                    }}
                    adjustFrame={(f) => {
                      return {
                        width: getConstant('width')/3,
                        height: Math.min(getConstant('height')/3, dataPhoenixBarrier.length * 40),
                        left : f.left,
                        right : f.right,
                        top: f.top,
                      }
                    }}
                    defaultIndex={dataPhoenixBarrier.indexOf(Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%'))}
                    defaultValue={Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%')}
                    ref={component => this._dropdown['barrierPhoenix'] = component}
                    options={dataPhoenixBarrier}
                    disabled={this.state.isEditable ? this.autocallResult.getBarrierPhoenix() === 1 ? true : false : !this.state.isEditable}
                />
            </View>
            { (this.state.isEditable && this.autocallResult.getBarrierPhoenix() !== 1)   ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('barrierPhoenix') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
       </TouchableOpacity>

       <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0, paddingTop: 10}}>
          <View style={{ width :25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
            <MaterialCommunityIcons name={"ticket-percent"}  size={18} style={{color: this.request.isUpdated() ? setColor('subscribeBlue') : this.stdLightColor}}/> 
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
             <Text style={[setFont('200', 11, this.request.isUpdated() ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
              {Numeral(this.autocallResult.getCoupon()*this.autocallResult.getFrequencyPhoenixNumber()/12).format('0.00%')} 
              <Text style={setFont('200', 11, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular')}>{' '+ this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>
            </Text>
          </View>
       </View>

       <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', paddingTop : 10}}
                          onPress={() => {
                                this.state.isEditable ? this._dropdown['isMemory'].show() : null;
                              }}
                          activeOpacity={this.state.isEditable ? 0.2 : 1}
       >
            <View style={{ width : 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"memory"}  size={18} style={{color: this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0 }}>
                <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                        onSelect={(index, value) => {
                            //console.log(index + "    - " + value);
                            this._updateValue('isMemory', index == 0  ? true : false, value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: getConstant('width')/3,
                            height: Math.min(getConstant('height')/3, dataMemoryAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.isMemory() ? 0 : 1}
                        defaultValue={dataMemoryAutocall[this.autocallResult.isMemory() ? 0 : 1]}
                        ref={component => this._dropdown['isMemory'] = component}
                        options={dataMemoryAutocall}
                        disabled={!this.state.isEditable}
                    >
                     <Text style={[setFont('200', 11, this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                       {this.autocallResult.isMemory() ? 'mémoire': 'sans mémoire'}
                     </Text>
                   </ModalDropdown>
            </View>
            { this.state.isEditable  ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('isMemory') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
      </TouchableOpacity>
      { (this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1))  ?
      <TouchableOpacity style={{flexDirection: 'row',  borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', paddingTop : 10}}
                                    onPress={() => {
                                      (this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1)) ? this._dropdown['airbag'].show() : null;
                                      
                                    }}
                                    activeOpacity={(this.state.isEditable && (this.autocallResult.getBarrierPhoenix() === 1)) ? 0.2 : 1}
      > 

            <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}

            >
              <MaterialCommunityIcons name={"airbag"}  size={18} style={{color: this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{borderWidth: 0,flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2}}>
                    <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                        onSelect={(index, value) => {
                          
                            var code = 'NA';
                            switch (Number(index))  {
                                case 1 : code = 'SA'; break;
                                case 2 : code = 'FA'; break;
                            }
                            this._updateValue('airbagLevel', code, value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: getConstant('width')/3,
                            height: Math.min(getConstant('height')/3, dataAirbagAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.getAirbagCode() === 'NA' ?  0 : (this.autocallResult.getAirbagCode() === 'SA' ? 1 : 2)}
                        options={dataAirbagAutocall}
                        ref={component => this._dropdown['airbag'] = component}
                        disabled={this.state.isEditable ? (this.autocallResult.getBarrierPhoenix() === 1 ? false : true) : true}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                        {this.autocallResult.getAirbagTitle()}
                      </Text>
                    </ModalDropdown>
            </View>
          
            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('airbagLevel') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>

      </TouchableOpacity>
      : null
    }
     </View>   
     <View style={{flex: 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
         <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
             RAPPELS DU {'\n'}PRODUIT
         </Text>         
       </View>
       <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"gavel"}  size={18} style={{color: this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2}}>
              <Text style={[setFont('500', 16, this.stdColor, 'Light'), {textAlign: 'center'}]}>
               { Numeral(this.autocallResult.getAutocallLevel()).format('0%')}
              </Text>
            </View>
       </View>
       <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', paddingTop: 10  }}
                          onPress={() => {
                            this.state.isEditable  ? this._dropdown['freq'].show() : null;
                            
                          }}
                          activeOpacity={this.state.isEditable ? 0.2 : 1}
       >
            <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"alarm-multiple"}  size={18} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                        onSelect={(index, value) => {
                            let f = '1Y';
                            switch(dataFreqAutocall.indexOf(value)){
                              case 0 : 
                                f = '1M';
                                break;
                              case 1 :
                                f = '3M';
                                break;
                              case 2 : 
                                f = '6M';
                                break;
                              case 3 : 
                                f = '1Y';
                                break;
                              default : break;
                            }
                            this._updateValue('freq', f, value);
                            this._recalculateProduct();

                        }}
                        adjustFrame={(f) => {
                          return {
                            width: getConstant('width')/3,
                            height: Math.min(getConstant('height')/3, dataFreqAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={dataFreqAutocall.indexOf(this.autocallResult.getFrequencyAutocallTitle())}
                        //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                        ref={component => this._dropdown['freq'] = component}
                        options={dataFreqAutocall}
                        disabled={!this.state.isEditable}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]}>
                        {this.autocallResult.getFrequencyAutocallTitle().toLowerCase()} 
                      </Text>
                    </ModalDropdown>
              </View>
              { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('freq') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
      </TouchableOpacity>
      <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', paddingTop : 10}}
                        onPress={() => {
                          this.state.isEditable  ? this._dropdown['nncp'].show() : null;
                          
                        }}
                        activeOpacity={this.state.isEditable ? 0.2 : 1}
      >
            <View style={{ width: 25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"clock-start"}  size={18} style={{color: this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
             <ModalDropdown
                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : this.stdColor, 'Regular')}
                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                  onSelect={(index, value) => {
                    let nncp = 12;
                    switch(dataNNCP.indexOf(value)){
                      case 0 : 
                        nccp = 12;
                        break;
                      case 1 :
                        nccp = 24;
                        break;
                      case 2 : 
                        nccp = 36;
                        break;
                      default : break;
                    }
                    this._updateValue('nncp', nccp, value);
                    this._recalculateProduct();

                }}
                adjustFrame={(f) => {
                  return {
                    width: getConstant('width')/3,
                    height: Math.min(getConstant('height')/3, dataNNCP.length * 40),
                    left : f.left,
                    right : f.right,
                    top: f.top,
                  }
                }}
                defaultIndex={dataNNCP.indexOf(this.request.getValue('nncp'))}
                //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                ref={component => this._dropdown['nncp'] = component}
                options={dataNNCP}
                disabled={!this.state.isEditable}
            >
                      <Text style={[setFont('200', 11, this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]}>
                        {this.request.getNNCPLabel()}
                      </Text>
          </ModalDropdown>
          </View>
          { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('nncp') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
      </TouchableOpacity>
      { (this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1)  ?
      <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', paddingTop : 10}}
                                   onPress={() => {
                                    (this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1)  ? this._dropdown['degressiveStep'].show() : null;
                                    
                                  }}
                                  activeOpacity={(this.state.isEditable && this.autocallResult.getBarrierPhoenix() === 1) ? 0.2 : 1}
       >
            <View style={{ width: 25, borderWidth: 0, alignItems: 'center', justifyContent: 'space-between'}}>
              <MaterialCommunityIcons name={"trending-down"}  size={18} style={{color: this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2}}>
                  <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                        onSelect={(index, value) => {
                          console.log("DS : " + index);
                            this._updateValue('degressiveStep', Number(index), value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: getConstant('width')/3,
                            height: Math.min(getConstant('height')/3, dataDSAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.getDegressiveStep()}
                        ref={component => this._dropdown['degressiveStep'] = component}
                        options={dataDSAutocall}
                        disabled={this.state.isEditable ? (this.autocallResult.getBarrierPhoenix() === 1 ? false : true) : true}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('degressiveStep') ? setColor('subscribeBlue') : this.stdColor,'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                           {this.autocallResult.getDegressiveStep() === 0 ? 'sans stepdown' : (Numeral(this.autocallResult.getDegressiveStep()/100).format('0%') +' / an')}
                      </Text>
                  </ModalDropdown>
            </View>

            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('degressiveStep') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>

       </TouchableOpacity>
       : null
      }
     </View>                                             
     <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
         <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
          {String('protection \ncapital').toUpperCase()}
         </Text>         
       </View>
       <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}
                        onPress={() => {
                          this.state.isEditable ? this._dropdown['barrierPDI'].show() : null;
                          
                        }}
                        activeOpacity={this.state.isEditable? 0.2 : 1}
       >
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"shield"}  size={18} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
              <ModalDropdown
                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                textStyle={setFont('500', 16, (this.request.isUpdated('barrierPDI')) ? setColor('subscribeBlue'): this.stdColor, this.request.isUpdated('barrierPDI') ? 'Bold' : 'Light')}
                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                  onSelect={(index, value) => {
                    this._updateValue('barrierPDI', Math.round(100*(Numeral(value).value() +1))/100, value);
                    this._recalculateProduct();

                }}
                adjustFrame={(f) => {
                  return {
                    width: getConstant('width')/3,
                    height: Math.min(getConstant('height')/3, dataPDIBarrier.length * 40),
                    left : f.left,
                    right : f.right,
                    top: f.top,
                  }
                }}
                defaultIndex={dataPDIBarrier.indexOf(Numeral(this.autocallResult.getBarrierPDI() - 1).format('0%'))}
                defaultValue={Numeral(this.autocallResult.getBarrierPDI()- 1).format('0%')}
                ref={component => this._dropdown['barrierPDI'] = component}
                options={dataPDIBarrier}
                disabled={!this.state.isEditable}
              />
            </View>
            { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('barrierPDI') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
        </TouchableOpacity>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2, paddingTop : 16, borderLeftWidth : 0}}>
          <Text style={[setFont('300', 10, this.stdColor, 'Light', 'top'), {textAlign: 'center'}]}>
              {String('maturité').toUpperCase()}
          </Text>         
       </View>
        <TouchableOpacity style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', borderLeftWidth : 0}}
                          onPress={() => {
                            this.state.isEditable ? this._dropdown['maturity'].show() : null;
                            
                          }}
                          activeOpacity={this.state.isEditable? 0.2 : 1}
        >
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIcons name={"calendar"}  size={18} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
              <ModalDropdown
                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                    onSelect={(index, value) => {
                        let code = [ Number(index)+1, Number(index) +1 ];
          
                        this._updateValue('maturity', code, value);
                        this._recalculateProduct();
                    }}
                    adjustFrame={(f) => {
                      return {
                        width: getConstant('width')/3,
                        height: Math.min(getConstant('height')/3, dataMaturityAutocall.length * 40),
                        left : f.left,
                        right : f.right,
                        top: f.top,
                      }
                    }}
                    defaultIndex={this.autocallResult.getMaturityInMonths()/12-1}
                    ref={component => this._dropdown['maturity'] = component}
                    options={dataMaturityAutocall}
                    disabled={!this.state.isEditable}
                >
                  <Text style={setFont('500', 16, (this.request.isUpdated('maturity')) ? setColor('subscribeBlue'): this.stdColor, this.request.isUpdated('maturity') ? 'Bold' : 'Light')}>
                      {this.autocallResult.getMaturityName()}
                  </Text>
                </ModalDropdown>
            </View>
            { this.state.isEditable ?
                            <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                              <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: this.request.isUpdated('maturity') ? setColor('subscribeBlue') : this.stdLightColor}}/> 
                            </View>
                          : null
            }
        </TouchableOpacity>

     </View>    
     
   
   </View>
  )
}

_renderAutocallShortTemplate() {
  return (
   <TouchableOpacity style={{flexDirection : 'row', backgroundColor: 'white'}}
          onPress={() => {
            this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
              autocall: this.autocallResult,
            })
          }}
   
   >
     <View style={{flex : 0.9, flexDirection : 'column', padding: 5, borderWidth: 0}}>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIcons name={"gavel"}  size={15} style={{color: this.stdLightColor}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{ Numeral(this.autocallResult.getAutocallLevel()).format('0%')} </Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIcons name={"alarm-multiple"}  size={18} style={{color: this.stdLightColor}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>
                </View>
            </View>
        </View>
        <View style={{flexDirection: 'row', borderWidth : 0}}>
           <View style={{flex: 0.5, flexDirection: 'row'}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIcons name={"calendar"}  size={18} style={{color: this.stdLightColor}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocallResult.getMaturityName()} </Text>
                </View>
            </View>

            { this.request.getValue('isMemory') ? 
                  <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5, borderWidth : 0}}>
                      <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                        <MaterialCommunityIcons name={"memory"}  size={15} style={{color: this.stdLightColor}}/>
                      </View>
                      <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                          <Text style={setFont('300', 12, setColor(''), 'Light')}>{(this.request.getValue('isMemory') ? 'mémoire': 'non mémoire')} </Text>
                      </View>
                  </View>
              : null
            }
        </View>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIcons name={"shield"}  size={15} style={{color: this.stdLightColor}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{Numeral(this.request.getValue('barrierPDI') - 1).format('0%')}</Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0, paddingLeft: 5}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',paddingRight : 5}}>
                  <MaterialCommunityIcons name={this.request.getValue('barrierPhoenix') === 1 ? "airbag" : "shield-half-full"}  size={15} style={{color: this.stdLightColor}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')} numberOfLines={1}>{this.request.getValue('barrierPhoenix') === 1  ? this.autocallResult.getAirbagTitle() : Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%')}</Text>
                </View>
            </View>


        </View>
     </View>
  
  </TouchableOpacity>
  )
}

_renderFooterShortTemplate(isFavorite) {
  //remplisaaage des dropdown
  return (
           <View style={{flex : 0.10, flexDirection : 'row', borderTopWidth : 1, borderTopColor: 'lightgray', padding :3, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <TouchableOpacity style={{flex : 0.5, justifyContent: 'center', alignItems: 'center'}} 
                                  onPress={() => {
                                    if (this.request.isUpdated()) {
                                      alert('Valider votre produit avant de le mettre en favori');
                                      return;
                                    }
                                    this.props.setFavorite(this.autocallResult.getObject())
                                    .then((fav) => {                                 
                                      this.autocallResult.setFavorite(fav);
                                      this.setState({ toto: !this.state.toto })
                                    })
                                    .catch((error) => console.log("Erreur de mise en favori : " + error));
                                  }}
                >
                  <MaterialCommunityIcons name={!isFavorite ? "heart-outline" : "heart"} size={20} color={setColor(this.request.isUpdated() ? 'gray' : 'light')}/>
                </TouchableOpacity>

   

                <TouchableOpacity style={{flex : 0.5, justifyContent: 'center', alignItems: 'center'}} 
                                                onPress={() => {
                                                  let r = new CPSRequest();
                                                  r.setRequestFromCAutocall(this.autocallResult);
                                                  this.props.navigation.dispatch(NavigationActions.navigate({
                                                    routeName: 'Pricer',
                                                    action: NavigationActions.navigate({ routeName: 'PricerEvaluate' , params : {request : r}} ),
                                                  }));
                                                }}
                 >
                 
                  <FontAwesome name={"gears"}  size={20} style={{color: this.stdLightColor}}/> 
                </TouchableOpacity>   
                
              </View>

  );
}

_renderFooterMediumTemplate(isFavorite) {
  //remplisaaage des dropdown
  
  return (
           <View style={{ padding: 5, backgroundColor: 'white', borderBottomRightRadius: this.stdBorderRadius, borderBottomLeftRadius: this.stdBorderRadius}}>
 
                
              </View>

  );
}


_renderFooterFullTemplate(isFavorite) {
  //remplisaaage des dropdown
  let dataUF = Array(61).fill().map((_, index) => (Numeral(index/1000).format('0.00%')));
  return (
    <View style={{flex : 0.10, flexDirection : 'row', borderTopWidth : 1, borderTopColor: 'lightgray', paddingTop : 0, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                  onPress={() => {
                                    if (this.request.isUpdated()) {
                                      alert('Valider votre produit avant de le mettre en favori');
                                      return;
                                    }
                                    
                                    this.props.setFavorite(this.autocallResult.getObject())
                                    .then((fav) => {                                 
                                      this.autocallResult.setFavorite(fav);
                                      this.setState({ toto: !this.state.toto })
                                    })
                                    .catch((error) => console.log("Erreur de mise en favori : " + error));
                                  }}
                >
                  <MaterialCommunityIcons name={!isFavorite ? "heart-outline" : "heart"} size={20} color={setColor(this.request.isUpdated() ? 'gray' : 'light')}/>
                </TouchableOpacity>
                {/*<View style={[{flex : 0.2}, globalStyle.templateIcon]}>
                  <FontAwesome name={"microphone-slash"}  size={20} style={{color: setColor('gray')}}/> 
                </View>
                */}
   
                <View style={[{flex : 0.2}, globalStyle.templateIcon]}>              
                 <ModalDropdown
                  ref={'UF'}
                  dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                  dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
                    onSelect={(index, value) => {
                      this._updateValue('UF', Math.round(1000*(Numeral(value).value()))/1000, value);
                      this._recalculateProduct();

                    }}
                    adjustFrame={(f) => {
                      return {
                        width: getConstant('width')/3,
                        height: Math.min(getConstant('height')/3, dataUF.length * 40),
                        left : f.left,
                        right : f.right,
                        top: f.top,
                      }
                    }}
                    onDropdownWillShow={() => {
                      let idx = dataUF.indexOf(Numeral(this.request.getValue('UF')).format('0.00%'));
                      this.refs['UF'].select(idx);
                      //this.refs['UF'].scrollTo({animated: true}, 100);
                    }}
                    defaultIndex={dataUF.indexOf(Numeral(this.request.getValue('UF')).format('0.00%'))}
                    //defaultValue={Numeral(this.request.getValue('UF') - 1).format('0%')}
                    //defaultValue={''}

                    options={dataUF}
                  >
                    <MaterialCommunityIcons name={"margin"} size={20} style={{color: setColor(this.request.isUpdated('UF') ? 'subscribeBlue' : 'light')}}/>
                  </ModalDropdown>
                </View>
      
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                                onPress={() => {
                                                  let r = new CPSRequest();
                                                  r.setRequestFromCAutocall(this.autocallResult);
                                                  this.props.navigation.dispatch(NavigationActions.navigate({
                                                    routeName: 'Pricer',
                                                    action: NavigationActions.navigate({ routeName: 'PricerEvaluate' , params : {request : r}} ),
                                                  }));
                                                }}
                 >
                 
                  <FontAwesome name={"gears"}  size={20} style={{color: this.stdLightColor}}/> 
                </TouchableOpacity>   
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                  onPress={() => {
                                    //on revient au produit initial
                                    this.autocallResult = new CAutocall(this.props.object);

                                    this.request = new CPSRequest();
                                    this.request.setRequestFromCAutocall(this.autocall);
                                    this.setState({ toto : !this.state.toto });
                                  }}
                                  activeOpacity={(this.state.isEditable && this.request.isUpdated())  ? 0.2 : 1}
                >
                  <MaterialCommunityIcons name={"undo"} size={20} color={setColor((this.state.isEditable && this.request.isUpdated()) ? 'subscribeBlue' : 'light')}/>
                </TouchableOpacity>

                <TouchableOpacity style={[{flex : 0.2, backgroundColor : setColor(''), borderBottomRightRadius: 10,}, globalStyle.templateIcon]}
                                  onPress={() => {
                                    this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                                      autocall: this.autocallResult,
                                    })
                                }}
                >
                  <MaterialCommunityIcons name="fast-forward" size={25} color={'white'}/>
                </TouchableOpacity>
                

              </View>

  );
}



render () {

      if (this.type === TEMPLATE_TYPE.AUTOCALL_BODY_FULL_TEMPLATE) {
        return this._renderAutocallFullTemplate();
      }




      //check if it is in favorites
      let isFavorite = false;
      isFavorite = this.autocallResult.isFavorite(this.props.favorite);
      /*this.props.favorites.forEach((fav) => {
        if (isEqual(fav.data, this.data)) {
          //isFavorite = this.item.isFavorite && this.item.toFavorites.active;
          isFavorite = true;
        }
      });
      //remise a jour de l'objet item en fonction de ce qui a été trouve dans favorites
      this.object.isFavorite = isFavorite;
      this.object.toFavorites.active = isFavorite;*/

      return (
            <View opacity={this.state.isGoodToShow ? 1 : 0.1} style={{flexDirection : 'column', 
                                                                      width: this.screenWidth, 
                                                                      //marginLeft : 0.025*getConstant('width'),
                                                                      shadowColor: setColor('shadow'),
                                                                      shadowOffset: { width: 0, height: 2 },
                                                                      shadowOpacity: this.stdShadowOpacity,
                                                                      borderWidth :   1,
                                                                      borderColor : isAndroid() ? 'black' :  'white',
                                                                      //borderTopLeftRadius: 15,
                                                                      borderRadius: this.stdBorderRadius,
                                                                      //overflow: "hidden",
                                                                      backgroundColor: 'white',
                                                                      //elevation: 3
                                                                    }}
            >

                {this._renderModalUpdate()}

                {this.type === TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE ? this._renderHeaderFullTemplate2() 
                                                                    : this.type === TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE ? this._renderHeaderMediumTemplate()
                                                                                                                         : this._renderHeaderShortTemplate()
                }

                {this.state.messageLoading === '' ? this.type === TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE ? this._renderAutocallFullTemplate2() 
                                                                                                       : this.type === TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE ? this._renderAutocallMediumTemplate()
                                                                                                                                                              : this._renderAutocallShortTemplate()
                                                  : this._renderRecalculateProduct()
                }

                {this.type === TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE ? this._renderFooterFullTemplate(isFavorite) 
                                                                    : this.type === TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE ? null
                                                                                                                          : this._renderFooterShortTemplate(isFavorite)
                }
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
export default hoistStatics(composedWithNav)(FLTemplateAutocall);

//export default FLTemplateAutocall;