import React from 'react'
import { Modal, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Platform } from 'react-native'
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";

import AnimatedProgressWheel from 'react-native-progress-wheel';

import { globalStyle, setColor, backgdColor, FLFontFamily, subscribeColor, setFont, headerTabColor } from '../../Styles/globalStyle'

import Robot from "../../assets/svg/robotBlink.svg";

import { ifIphoneX, ifAndroid, isAndroid, isIphoneX } from '../../Utils';
import { interpolateBestProducts } from '../../Utils/interpolatePrices';

import SwipeGesture from '../../Gesture/SwipeGesture';
import { CPSRequest } from '../../Classes/Products/CPSRequest';



import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import SwitchSelector from "react-native-switch-selector";
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup, VictoryStack } from 'victory-native'


import { UserContext } from '../../Session/UserProvider';
import FLSearchInput from '../commons/FLSearchInput';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { FLBadge } from '../commons/FLBadge'
import botImage from '../../assets/bot.png'

import { searchProducts } from '../../API/APIAWS';

import Dimensions from 'Dimensions';

import FLBottomPanel from '../commons/FLBottomPanel';
import { SNAP_POINTS_FROM_TOP } from '../commons/FLBottomPanel';

import { FLAuctionDetail } from './description/FLAuctionDetail';
import { FLProductDetail } from './description/FLProductDetail';
import { FLUnderlyingDetail } from './description/FLUnderlyingDetail';
import { FLMaturityDetail } from './description/FLMaturityDetail';
import { FLPDIDetail } from './description/FLPDIDetail';
import { FLFreqDetail } from './description/FLFreqDetail';
import { FLPhoenixBarrierDetail } from './description/FLPhoenixBarrierDetail';
import { FLAirbagDetail } from './description/FLAirbagDetail';
import { FLDegressiveDetail } from './description/FLDegressiveDetail';
import { FLUFDetail } from './description/FLUFDetail';

const Spline = require('cubic-spline');
var polynomial = require('everpolate').polynomial;
var interpolator = require('../../Utils/spline.js');

const dataForge = require('data-forge');

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT =  isAndroid() ? StatusBar.currentHeight : isIphoneX() ? 44 : 20;



class PricerScreen extends React.Component {

  constructor(props) {
    super(props);
    Numeral.locale('fr');
    this.initialMessageLoading = 'Interrogation du marché...';
    this.state = {
      isLoading: false,

      messageLoading : this.initialMessageLoading,

      //les prix ne sont plus bons : un parametre au moins a été touché
      needToRefresh: false,

      //position du bottomPanel
      bottomPanelPosition : SNAP_POINTS_FROM_TOP[2],

      toto : true,
    }

    //parametre courant qui a été touché pour passer l'info à FLBottomPanel
    this.currentParameter = '';

    //ensemble des modal dropdown
    this._dropdown = {};

    this.request = new CPSRequest();
    //console.log(this.request.getProduct());

    //recuperation de la liste des sous-jacents
    this.underlyings = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;

    //this.parameterProductUpdated(this.product);
    this.bestProducts = [];
  }


  static navigationOptions = {
    header: null
  }

  //au chargemnt de la page recupération des meilleurs resultats
  async componentDidMount() {
    if (!isAndroid()) {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
          StatusBar.setBarStyle('dark-content');
        });
    }
   // this.calculateProducts();
   this.needToRefresh();

  }

  componentWillUnmount() {
    if (!isAndroid()) {
      this._navListener.remove();
    }
  }

  _snapChange=(bottomPanelPosition) => {
    //console.log(bottomPanelPosition);
    this.setState({ bottomPanelPosition });
  }

  _renderFLBottomPanel=() => {
    switch (this.currentParameter) {
      case 'typeAuction' : return  <FLAuctionDetail updateValue={this._updateValue} initialValue={this.product['typeAuction'].value}/>
      case 'type' : return  <FLProductDetail updateValue={this._updateValue} initialValue={this.product['type'].value}/>
      case 'underlying' : return  <FLUnderlyingDetail underlyings={this.underlyings} updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'maturity' : return  <FLMaturityDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'barrierPDI' : return  <FLPDIDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'barrierPhoenix' : return  <FLPhoenixBarrierDetail updateValue={this._updateValue} initialValueBP={this.request.getValue('barrierPhoenix')} initialValueIM={this.request.getValue('isMemory')}/>
      case 'freq' : return  <FLFreqDetail updateValue={this._updateValue} initialValueFreq={this.request.getValue('freq')} initialValueNNCP={this.request.getValue('nncp')}/>
      case 'airbagLevel' : return  <FLAirbagDetail updateValue={this._updateValue} initialValueAB={this.request.getValue('airbagLevel')} initialValueDS={this.request.getValue('degressiveStep')}/>
      case 'degressiveStep' : return  <FLDegressiveDetail updateValue={this._updateValue} initialValue={this.product['degressiveStep'].value}/>
      case 'UF' : return  <FLUFDetail updateValue={this._updateValue} initialValueUF={this.request.getValue('UF')} initialValueUFAssoc={this.request.getValue('UFAssoc')}/>

      default : return  <View>
                          <Text style={{padding : 15, fontSize : 24, fontFamily : 'FLFontTitle'}}>F i n l i v e</Text>
                        </View>;
    }

  }

  async calculateProducts() {

    //this.state.isLoading === false ? this.setState({ isLoading: true }) : null;
    this.setState({ isLoading: true }) ;
    //this.setState({ isLoading : true }, () => {
    this.bestProducts = [];

    //chagrgement des prix depuis le serveur
    console.log(this.request.getCriteria());
    
    //criteria['maturity'] = ["3Y", "5Y", "8Y"];
    searchProducts(this.props.firebase, this.request.getCriteria())
    .then((data) => {
      this.setState({ messageLoading : 'Réception et analyse des prix' });
      console.log("APRES RETOUR SERVEUR : ");
      //console.log(data[0]);
      let product = [...new Set(data.map(x => x.product))];
      console.log("product : " + product);

      let underlying = [...new Set(data.map(x => x.underlying))];
      console.log("underlying : " + underlying);

      let maturity = [...new Set(data.map(x => x.maturity))];
      console.log("maturity : " + maturity);

      let freqAutocall = [...new Set(data.map(x => x.freqAutocall))];
      console.log("freqAutocall : " + freqAutocall);
      
      let airbagLevel = [...new Set(data.map(x => x.airbagLevel))];
      console.log("airbagLevel : " + airbagLevel);

      let isIncremental = [...new Set(data.map(x => x.isIncremental))];
      console.log("isIncremental : " + isIncremental);

      let degressiveStep = [...new Set(data.map(x => x.degressiveStep))];
      console.log("degressiveStep : " + degressiveStep);

      let isMemory = [...new Set(data.map(x => x.isMemory))];
      console.log("isMemory : " + isMemory);
      let noCallNbPeriod = [...new Set(data.map(x => x.noCallNbPeriod))];
      console.log("noCallNbPeriod : " + noCallNbPeriod);            
      
      let barrierPhoenix = [...new Set(data.map(x => x.barrierPhoenix))];
      console.log("barrierPhoenix : " + barrierPhoenix);
      
      let barrierPDI = [...new Set(data.map(x => x.barrierPDI))];
      console.log("barrierPDI : " + barrierPDI);

      let isPDIUS = [...new Set(data.map(x => x.isPDIUS))];
      console.log("isPDIUS : " + isPDIUS);

      //calcul du produit

      this.bestProducts = interpolateBestProducts(data, this.request);
      //console.log(this.bestProducts);
      this.setState({ isLoading: false }, () => {
          this.props.navigation.navigate('FLResultPricer', {
          bestProducts: this.bestProducts,
          //ticketType: TICKET_TYPE.PSCREATION
        })
      });
    
    })
    .catch(error => {
      console.log("ERREUR recup prix: " + error);
      alert('ERREUR calcul des prix', '' + error);
      this.setState({ isLoading : false , messageLoading : ''});
    });


    //});
  }


  //parameter du produit changé et donc updaté
  /*parameterProductUpdated = (productParameters) => {
    //console.log(productParameters);
    this.request.updateProduct(productParameters);
    this.request.refreshFields();

  }*/
  _updateValue=(id, value, valueLabel) =>{
    console.log(id + "  :  "+value+"  :  "+valueLabel);
    this.request.setCriteria(id, value, valueLabel);
    this.needToRefresh();
    
  }
  _activateParameter=(toActivate) => {
    this.request.setActivation(this.currentParameter, toActivate);
    if (this.currentParameter === 'freq') {
      this.request.setActivation('nncp', toActivate);
    }
    if (this.currentParameter === 'nncp') {
      this.request.setActivation('freq', toActivate);
    }
    if (this.currentParameter === 'airbagLevel') {
      this.request.setActivation('degressiveStep', toActivate);
    }
    if (this.currentParameter === 'degressiveStep') {
      this.request.setActivation('airbagLevel', toActivate);
    }

    this.needToRefresh();
    //fermeture du panel
    //this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[2] });
  }
  //demande le calcul au serveur et affichage des résultats 
  _launchPricing = () => {

    this.calculateProducts();
    this.setState({ needToRefresh: false });
  }

  //les prix ne sont plus bons : un parametre au moins a été touché
  needToRefresh = () => {
    //console.log("Besoin de refresh");
    this.setState({ needToRefresh: true });
  }


  //les UF ont été changés
  updateUF = (UF, UFAssoc) => {
    //console.log("UF Updated " + UF + "   et    " + UFAssoc);
    this.request.refreshUF(UF, UFAssoc);


  }

//choix du produit
_renderProductTile() {
  let dataProductName = ['Athéna', 'Phoenix'];
  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: (DEVICE_WIDTH*0.925-20)/3, 
                        marginLeft : 5,  
                        marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  'white' ,
                        borderRadius : 4
                        }}
            >
                <TouchableOpacity style={{flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                  onPress={() => {
                                    this._dropdown['type'].show();
                                  }}
                >
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                              <MaterialCommunityIconsIcon name={"beaker-outline"}  size={30} style={{color: this.request.isActivated('type') ? 'gray' : setColor('light')}}/> 
                          </View>
                          <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                            <Ionicons name={'ios-more'}  size={14} style={{color: setColor('light')}}/>
                          </View>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, 'gray', 'Bold')}
                                    onSelect={(index, value) => {
                                      switch (Number(index))  {
                                         case 0 :   //athena
                                            this._updateValue('type', 'athena', value);
                                            this._updateValue('barrierPhoenix', 1, "100%");
                                            this._updateValue('isIncremental', true, "incremental");
                                            this._updateValue('isMemory', true, "Effet mémoire");
                                            this.request.setActivation('airbagLevel', true);
                                            this.request.setActivation('degressiveStep', true);
                                            this.request.setActivation('barrierPhoenix', false);
                                            break;
                                         case 1 : 
                                            this._updateValue('type', 'phoenix', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('airbagLevel', 'NA', 'Non airbag');
                                            this._updateValue('barrierPhoenix', 0.9, "90%");
                                            this.request.setActivation('airbagLevel', false);
                                            this.request.setActivation('degressiveStep', false);
                                            this.request.setActivation('barrierPhoenix', true);
                                            break;
                                      }
                                      //this.setState({ toto : !this.state.toto});
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        width: DEVICE_WIDTH/2,
                                        height: Math.min(DEVICE_HEIGHT/3, dataProductName.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                      }
                                    }}
                                    defaultIndex={dataProductName.indexOf(this.request.getValueLabel('type'))}
                                    options={dataProductName}
                                    ref={component => this._dropdown['type'] = component}
                                    disabled={false}
                                >
                                  <Text style={[setFont('300', 14), {textAlign: 'left'}]}>
                                    {this.request.getValueLabel('type')}
                                  </Text>
                                </ModalDropdown>
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor('gray'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14,'gray', 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('type')}
                  </Text>
                </View>
           </View>
        
  );
}
  //choix du sous-jacent
_renderGenericTile(criteria) {

  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: (DEVICE_WIDTH*0.925-20)/3, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  this.request.isActivated(criteria) ? 'white' : setColor('gray'),
                        borderRadius : 4
                        }}
            >
                <TouchableOpacity style={{flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                  onPress={() => {
                                    this.currentParameter = criteria;
                                    this.request.setActivation(this.currentParameter, true);
                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                  }}
                >
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                              <MaterialCommunityIconsIcon name={this.request.getIcon(criteria)}  size={30} style={{color: this.request.isActivated(criteria) ? 'gray' : setColor('light')}}/> 
                          </View>
                          <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                            <Ionicons name={'ios-more'}  size={14} style={{color: setColor('light')}}/>
                          </View>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Text style={[setFont('300', 14, this.request.isActivated(criteria) ? 'gray' : setColor('light')), {textAlign: 'left'}]}>
                                    {this.request.isActivated(criteria) ? this.request.getValueLabel(criteria) : String('optimisé').toUpperCase()}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor('gray'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated(criteria) ? 'gray' : setColor('light'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle(criteria)}
                  </Text>
                </View>
           </View>
        
  );
}

//choix de la fréquence et du no call périod
_renderFreqTile() {

    return (
              <View style={{
                          height: (DEVICE_WIDTH*0.925-20)/3, 
                          width: 2*(DEVICE_WIDTH*0.925-20)/3 + 5, 
                          marginLeft : 5,  
                          //marginRight :0, 
                          marginBottom: 5, 
                          backgroundColor:  (this.request.isActivated('freq') || this.request.isActivated('nncp') ) ? 'white' : setColor('gray'),
                          borderRadius : 4
                          }}
              >
                  <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity style={{flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                        onPress={() => {
                                          this.currentParameter = 'freq';
                                          this.request.setActivation(this.currentParameter, true);
                                          this.request.setActivation('nncp', true);
                                          this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                        }}
                      >
                          <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIconsIcon name={this.request.getIcon('freq')}  size={30} style={{color: this.request.isActivated('freq') ? 'gray' : setColor('light')}}/> 
                                </View>
                                <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                                  
                                </View>
                          </View>
                          <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                              <Text style={[setFont('300', 14, this.request.isActivated('freq') ? 'gray' : setColor('light')), {textAlign: 'left'}]}>
                                          {this.request.isActivated('freq') ? this.request.getValueLabel('freq') : String('optimisé').toUpperCase()}
                              </Text>
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                        onPress={() => {
                                          this.currentParameter = 'freq';
                                          this.request.setActivation(this.currentParameter, true);
                                          this.request.setActivation('nncp', true);
                                          this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                        }}
                      >
                          <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIconsIcon name={this.request.getIcon('nncp')}  size={30} style={{color: this.request.isActivated('freq') ? 'gray' : setColor('light')}}/> 
                                </View>
                                <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                                  <Ionicons name={'ios-more'}  size={14} style={{color: setColor('light')}}/>
                                </View>
                          </View>
                          <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                              <Text style={[setFont('300', 14, this.request.isActivated('freq') ? 'gray' : setColor('light')), {textAlign: 'left'}]}>
                                          {this.request.isActivated('nncp') ? '1er rappel\ndans' + this.request.getNNCPLabel() : String('optimisé').toUpperCase()}
                              </Text>
                          </View>
                      </TouchableOpacity>
                  </View>
                  <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor('gray'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[setFont('300', 14, this.request.isActivated('freq') ? 'gray' : setColor('light'), 'Regular' ), {textAlign: 'center'}]}>
                        {this.request.getTitle('freq')}
                    </Text>
                  </View>
             </View>
          
    );
  }

  //choix du airbag et stepdown
_renderAirbagTile() {
 //let dsText = this.request.getV === 0 ? 'sans stepdown' : (Numeral(this.autocallResult.getDegressiveStep()/100).format('0%') +' / an')}
  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: 2*(DEVICE_WIDTH*0.925-20)/3 +5, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  (this.request.isActivated('airbagLevel') || this.request.isActivated('degressiveStep') ) ? 'white' : setColor('gray'),
                        borderRadius : 4
                        }}
            >
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                      onPress={() => {
                                        this.currentParameter = 'airbagLevel';
                                        this.request.setActivation(this.currentParameter, true);
                                        this.request.setActivation('degressiveStep', true);
                                        this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                      }}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIconsIcon name={this.request.getIcon('airbagLevel')}  size={30} style={{color: this.request.isActivated('airbagLevel') ? 'gray' : setColor('light')}}/> 
                              </View>
                              <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                                
                              </View>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text style={[setFont('300', 14, this.request.isActivated('airbagLevel') ? 'gray' : setColor('light')), {textAlign: 'left'}]}>
                                        {this.request.isActivated('airbagLevel') ? this.request.getValueLabel('airbagLevel') : String('optimisé').toUpperCase()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                      onPress={() => {
                                        this.currentParameter = 'airbagLevel';
                                        this.request.setActivation(this.currentParameter, true);
                                        this.request.setActivation('degressiveStep', true);
                                        this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                      }}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIconsIcon name={this.request.getIcon('degressiveStep')}  size={30} style={{color: this.request.isActivated('degressiveStep') ? 'gray' : setColor('light')}}/> 
                              </View>
                              <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                                <Ionicons name={'ios-more'}  size={14} style={{color: setColor('light')}}/>
                              </View>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text style={[setFont('300', 14, this.request.isActivated('airbagLevel') ? 'gray' : setColor('light')), {textAlign: 'left'}]}>
                                        {this.request.isActivated('degressiveStep') ? (this.request.getValueLabel('degressiveStep') === '' ? 'Sans stepdown' : this.request.getValueLabel('degressiveStep')) : String('optimisé').toUpperCase()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor('gray'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated('airbagLevel') ? 'gray' : setColor('light'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('airbagLevel')}
                  </Text>
                </View>
           </View>
        
  );
}

//choix de l'effet memoire
_renderMemoryTile() {
  let dataMemoryAutocall = ['Effet mémoire','Non mémoire'];
  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: (DEVICE_WIDTH*0.925-20)/3, 
                        marginLeft : 5,  
                        marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  'white' ,
                        borderRadius : 4
                        }}
            >
                <TouchableOpacity style={{flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                  onPress={() => {
                                    this._dropdown['isMemory'].show();
                                  }}
                >
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                              <MaterialCommunityIconsIcon name={"memory"}  size={30} style={{color: this.request.isActivated('isMemory') ? 'gray' : setColor('light')}}/> 
                          </View>
                          <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                            <Ionicons name={'ios-more'}  size={14} style={{color: setColor('light')}}/>
                          </View>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, 'gray', 'Bold')}
                                    onSelect={(index, value) => {
                                      this._updateValue('isMemory', index == 0  ? true : false, value);

                                      //this.setState({ toto : !this.state.toto});
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        width: DEVICE_WIDTH/2,
                                        height: Math.min(DEVICE_HEIGHT/3, dataMemoryAutocall.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                      }
                                    }}
                                    defaultIndex={dataMemoryAutocall.indexOf(this.request.getValueLabel('isMemory'))}
                                    options={dataMemoryAutocall}
                                    ref={component => this._dropdown['isMemory'] = component}
                                    disabled={false}
                                >
                                  <Text style={[setFont('300', 14), {textAlign: 'left'}]}>
                                    {this.request.getValueLabel('isMemory')}
                                  </Text>
                                </ModalDropdown>
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor('gray'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14,'gray', 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('isMemory')}
                  </Text>
                </View>
           </View>
        
  );
}

//choix de l'effet memoire
_renderAuctionTile() {
  let dataAuction = ["Appel public à l'épargne",'Placement privé'];
  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: (DEVICE_WIDTH*0.925-20)/3, 
                        marginLeft : 5,  
                        marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  'white' ,
                        borderRadius : 4
                        }}
            >
                <TouchableOpacity style={{flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                  onPress={() => {
                                    this._dropdown['typeAuction'].show();
                                  }}
                >
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                              <Ionicons name={this.request.getValue('typeAuction') === 'PP' ? "ios-contact" : "ios-contacts"}  size={30} style={{color: this.request.isActivated('typeAuction') ? 'gray' : setColor('light')}}/> 
                          </View>
                          <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                            <Ionicons name={'ios-more'}  size={14} style={{color: setColor('light')}}/>
                          </View>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, 'gray', 'Bold')}
                                    onSelect={(index, value) => {
                                      this._updateValue('typeAuction', index == 0  ? 'APE' : 'PP', value);

                                      //this.setState({ toto : !this.state.toto});
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        //width: DEVICE_WIDTH/2,
                                        height: Math.min(DEVICE_HEIGHT/3, dataAuction.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                      }
                                    }}
                                    defaultIndex={dataAuction.indexOf(this.request.getValueLabel('typeAuction'))}
                                    options={dataAuction}
                                    ref={component => this._dropdown['typeAuction'] = component}
                                    disabled={false}
                                >
                                  <Text style={[setFont('300', 14), {textAlign: 'left'}]}>
                                    {this.request.getValueLabel('typeAuction')}
                                  </Text>
                                </ModalDropdown>
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor('gray'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14,'gray', 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('typeAuction')}
                  </Text>
                </View>
           </View>
        
  );
}

_renderTiles() {
   return (
     <View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {this._renderProductTile()}
            {this._renderGenericTile('underlying')}
            {this._renderGenericTile('barrierPDI')}
            
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
           {this._renderGenericTile('maturity')}
            {this._renderFreqTile()}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
           {this._renderAirbagTile()}
           {this._renderGenericTile('barrierPhoenix')}
           
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {this._renderMemoryTile()}
            {this._renderAuctionTile()}
            {this._renderGenericTile('UF')}
            
        </View>
        <View style={{height: 150}}>
            
        </View>
        {/*<TouchableOpacity style={{marginTop: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 100 }}
                              onPress={() => {
                                alert("la suite demain midi !");
                              }}                    
            >
                <MaterialCommunityIconsIcon name={"play-circle"}  size={60} style={{color: setColor('turquoise')}}/> 
                            </TouchableOpacity>*/}
      </View>
   );
 }



  render() {
    if (this.state.isLoading) {
          return (
              <View style ={{flex: 1,  backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                    <Robot width={200} height={200} />
                    <Text style={setFont('300', 16)}>
                      {this.state.messageLoading}
                    </Text>
              </View>
          );
    }

    return (
      <View style={{flex:1, height: DEVICE_HEIGHT,}}> 
          <View style={{flexDirection: 'row', height: 40 + STATUSBAR_HEIGHT, paddingLeft : 10, backgroundColor: 'white', paddingTop: isAndroid() ? 0 : STATUSBAR_HEIGHT, justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{justifyContent: 'center'}}>    
                <Text style={setFont('300', 24, setColor(''), 'FLFontTitle')}>Evaluer</Text>
              </View>
              <TouchableOpacity style={{justifyContent: 'center',  padding: 10}}> 
                <FontAwesome name="gear" size={25} style={{color: setColor('')}}/> 
              </TouchableOpacity>
          </View>

          <View style={[globalStyle.bgColor, {flex:1, borderWidth:0, justifyContent: 'space-between'}]}>


            <View style={{width: DEVICE_WIDTH*0.9, marginTop : 20, marginLeft : 0.05*DEVICE_WIDTH}}>
                      <SwitchSelector
                        initial={0}
                        onPress={obj => {
                          
                          //this._updateValue("typeAuction", obj.value, obj.label);
                          //this.setState({ gender: value });
                        }}
                        textColor={setColor('light')} 
                        selectedColor={'white'}
                        buttonColor={setColor('turquoise')} 
                        borderColor={setColor('turquoise')} 
                        returnObject={true}
                        hasPadding
                        options={[
                          { label: "J'optimise ma marge", value: "CPN" , customIcon:null}, 
                          { label: "J'optimise le coupon", value: "CC", customIcon: null} 
                        ]}
                      />
                  </View>
            <ScrollView contentContainerStyle={{justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: 20}}> 
              {this._renderTiles()}
            </ScrollView>
                        
          </View>
          <FLBottomPanel position={this.state.bottomPanelPosition} 
                              snapChange={this._snapChange} 
                              renderFLBottomPanel={this._renderFLBottomPanel()} 
                              renderTitle={this.request.getTitle(this.currentParameter)}
                              activateParameter={this._activateParameter}
                              isActivated={this.request.isActivated(this.currentParameter)}
          />
          <TouchableOpacity style ={{ position : 'absolute', top : DEVICE_HEIGHT - 220, left: DEVICE_WIDTH-120, borderWidth : 1, borderColor: setColor('turquoise'), borderRadius: 50, backgroundColor: 'white'}}
                            onPress={() => {
                              this.calculateProducts();
                            }}  
          >
              <Robot width={100} height={100} />
          </TouchableOpacity>
        </View>
    );
  }
}





const condition = authUser => !!authUser;


const composedPricerScreen = compose(
  withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(PricerScreen);

/*
           <TabPricer   launchPricing={this._launchPricing} 
                        product={this.request.getProduct()} 
                        needToRefresh={this.needToRefresh} 
                        isGoodToShow={!this.state.needToRefresh}  
                        parameterProductUpdated={this.parameterProductUpdated} 
            />
            */
