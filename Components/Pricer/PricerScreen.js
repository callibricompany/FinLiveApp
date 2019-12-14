import React from 'react'
import { Modal, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Platform } from 'react-native'

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
import { FLMemoryDetail } from './description/FLMemoryDetail';
import { FLCouponMinDetail } from './description/FLCouponMinDetail';

import logo from '../../assets/LogoWithoutText.png';
import logo_gray from '../../assets/LogoWithoutTex_gray.png';

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

      //on optimise la marge ou le coupon
      optimizer : 'CPN',

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
      case 'typeAuction' : return  <FLAuctionDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'type' : return  <FLProductDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)} />
      case 'underlying' : return  <FLUnderlyingDetail underlyings={this.underlyings} updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)} />
      case 'maturity' : return  <FLMaturityDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'barrierPDI' : return  <FLPDIDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'barrierPhoenix' : return  <FLPhoenixBarrierDetail updateValue={this._updateValue} initialValueBP={this.request.getValue('barrierPhoenix')} initialValueIM={this.request.getValue('isMemory')}/>
      case 'freq' : return  <FLFreqDetail updateValue={this._updateValue} initialValueFreq={this.request.getValue('freq')} initialValueNNCP={this.request.getValue('nncp')}/>
      case 'airbagLevel' : return  <FLAirbagDetail updateValue={this._updateValue} initialValueAB={this.request.getValue('airbagLevel')} initialValueDS={this.request.getValue('degressiveStep')}/>
      case 'degressiveStep' : return  <FLDegressiveDetail updateValue={this._updateValue} initialValue={this.product['degressiveStep'].value}/>
      case 'UF' : return  <FLUFDetail updateValue={this._updateValue} initialValueUF={this.request.getValue('UF')} initialValueUFAssoc={this.request.getValue('UFAssoc')}/>
      case 'coupon' : return  <FLCouponMinDetail updateValue={this._updateValue} initialValueCouponMin={this.request.getValue('coupon')}/>
      case 'isMemory' : return  <FLMemoryDetail />

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
    this.setState({ toto : !this.state.toto });
    
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
    console.log(this.currentParameter + "   :   " + toActivate);
  
    this.setState({ toto : !this.state.toto });
    
    //fermeture du panel
    //this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[2] });
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
                              <MaterialCommunityIconsIcon name={"beaker-outline"}  size={30} style={{color: this.request.isActivated('type') ? setColor('') : setColor('light')}}/> 
                          </View>
                          <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                            onPress={() => {
                                              this.currentParameter = 'type';
                                              this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                            }}
                          >
                            <MaterialCommunityIconsIcon name={'plus'}  size={14} style={{color: setColor('light')}}/>
                          </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, setColor(''), 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
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
                                            this._updateValue('barrierPhoenix', 0.9, "Protégé jusqu'à -10%");
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
                                  <Text style={[setFont('300', 14, setColor('')), {textAlign: 'left'}]}>
                                    {this.request.getValueLabel('type')}
                                  </Text>
                                </ModalDropdown>
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor(''), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14,setColor(''), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('type')}
                  </Text>
                </View>
           </View>
        
  );
}
  //choix du sous-jacent
_renderGenericTile=(criteria) => {
  //console.log("PASSE LA : "+criteria);
  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: (DEVICE_WIDTH*0.925-20)/3, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  this.request.isActivated(criteria) ? 'white' : setColor('') ,
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
                              <MaterialCommunityIconsIcon name={this.request.getIcon(criteria)}  size={30} style={{color: this.request.isActivated(criteria) ? setColor('') : setColor('light')}}/> 
                          </View>
                          <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                            onPress={() => {
                                              if (criteria !== 'UF' && criteria !== 'coupon') {
                                                  this.currentParameter = criteria;
                                                  this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                              }
                                            }}
                                            activeOpacity={(criteria === 'UF' || criteria === 'coupon') ? 1 : 0.2}
                          >
                          {criteria !== 'UF' && criteria !== 'coupon' 
                              ? <MaterialCommunityIconsIcon name={'plus'}  size={14} style={{color: setColor('light')}}/>
                              : null
                          }

                          </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                        {this.request.isActivated(criteria) ? 
                            <Text style={[setFont('300', 14, this.request.isActivated(criteria) ? setColor('') : setColor('light')), {textAlign: 'left'}]}>
                                    { this.request.getValueLabel(criteria) }
                            </Text>
                            :
                            <View style={{backgroundColor : 'white', padding: 10, borderRadius: 30, marginBottom: 3}}>
                              <Image style={{width: 30, height: 30}} source={logo} />
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : this.request.isActivated(criteria) ? 1 : 0, borderTopColor : setColor(''), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated(criteria) ? setColor('') : setColor('light'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle(criteria)}
                  </Text>
                </View>
           </View>
        
  );
}

//choix de la fréquence et du no call périod
_renderPhoenixTile=() => {
  let dataMemoryAutocall = ['Effet mémoire','Non mémoire'];
  console.log("PHOENIX ACTIVE : "+ this.request.isActivated('barrierPhoenix') + "    :     " +this.request.getValue('barrierPhoenix'));
  //determination de la couleur backgound
  let bgColorPhoenix = 'white';
  let iconColorPhoenix = setColor('');
  /*if (this.request.getValue('type') !== 'phoenix') {
    bgColorPhoenix = setColor('gray');
    iconColorPhoenix = setColor('light');
  } else {
    if (!this.request.isActivated('barrierPhoenix')) {
      bgColorPhoenix = setColor('');
      iconColorPhoenix = setColor('light');
    }
  }*/
  
  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: 2*(DEVICE_WIDTH*0.925-20)/3 + 5, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  'white',
                        borderRadius : 4
                        }}
            >
                <View style={{flexDirection: 'row', height: 2*(DEVICE_WIDTH*0.925-20)/3/3}}>
                    <TouchableOpacity style={{flexDirection: 'column', width :(DEVICE_WIDTH*0.925-20)/3 +5, borderWidth: 0,  paddingTop: 2, justifyContent: 'space-between', alignItems: 'center'}}
                                      onPress={() => {
                                        if (this.request.getValue('type') === 'phoenix'){
                                            this.currentParameter = 'barrierPhoenix';
                                            //this.request.setActivation(this.currentParameter, true);
                                  
                                            this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                        }
                                      }}
                                      activeOpacity={this.request.getValue('type') === 'phoenix' ? 0.2 : 1}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIconsIcon name={this.request.getIcon('barrierPhoenix')}  size={30} style={{color: iconColorPhoenix}}/> 
                              </View>

                              <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                                onPress={() => {
                                                  if (this.request.getValue('type') === 'phoenix') {
                                                    this.currentParameter = 'barrierPhoenix';
                                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                                    }
                                                
                                                }}
                                                activeOpacity={this.request.getValue('type') === 'phoenix' ? 0.2 : 1}
                              >
                              
                                  <MaterialCommunityIconsIcon name={'plus'}  size={14} style={{color: setColor('light')}}/>

                              </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                            
                          <Text style={[setFont('300', 14, this.request.isActivated('barrierPhoenix') ? setColor('') : setColor('light')), {textAlign: 'left'}]}>
                                  {this.request.getValueLabel('barrierPhoenix') }
                          </Text>

                            
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'column', width :(DEVICE_WIDTH*0.925-20)/3 +5, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center'}}
                                      onPress={() => {
                                        this._dropdown['isMemory'].show();
                                      }}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIconsIcon name={"memory"}  size={30} style={{color: this.request.isActivated('isMemory') ? setColor('') : setColor('light')}}/> 
                              </View>
 
                              <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                                onPress={() => {
                                                    this.currentParameter = 'isMemory';
                                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                            }}
                              >
                                 <MaterialCommunityIconsIcon name={'plus'}  size={14} style={{color: setColor('light')}}/>
                              </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                              <ModalDropdown
                                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                        dropdownTextStyle={setFont('500', 16, setColor(''), 'Regular')}
                                        dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
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
                                      <Text style={[setFont('300', 14, setColor('')), {textAlign: 'left'}]}>
                                        {this.request.getValueLabel('isMemory')}
                                      </Text>
                                </ModalDropdown>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : this.request.isActivated('freq') ? setColor('') : setColor('light'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, setColor('') , 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('barrierPhoenix')}
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
                          backgroundColor:  (this.request.isActivated('freq') || this.request.isActivated('nncp') ) ? 'white' : setColor(''),
                          borderRadius : 4
                          }}
              >
                  <View style={{flexDirection: 'row', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, flexGrow: 1}}>
                      <TouchableOpacity style={{flex: 0.5, flexDirection: 'column', borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center'}}
                                        onPress={() => {
                                          this.currentParameter = 'freq';
                                          this.request.setActivation(this.currentParameter, true);
                                          this.request.setActivation('nncp', true);
                                          this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                        }}
                      >
                          <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIconsIcon name={this.request.getIcon('freq')}  size={30} style={{color: this.request.isActivated('freq') ? setColor('') : setColor('light')}}/> 
                                </View>
                                <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                                  
                                </View>
                          </View>
                          <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>

                              {this.request.isActivated('freq') 
                                      ? 
                                          <Text style={[setFont('300', 14, this.request.isActivated('freq') ? setColor('') : setColor('light')), {textAlign: 'left'}]}>
                                                  { this.request.getValueLabel('freq') }
                                          </Text>
                                      :   <View style={{backgroundColor : 'white', padding: 10, borderRadius: 30, marginBottom: 3}}>
                                            <Image style={{width: 30, height: 30}} source={logo} />
                                          </View>
                              }
                          </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex: 0.5, flexDirection: 'column', borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center'}}
                                        onPress={() => {
                                          this.currentParameter = 'freq';
                                          this.request.setActivation(this.currentParameter, true);
                                          this.request.setActivation('nncp', true);
                                          this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                        }}
                      >
                          <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIconsIcon name={this.request.getIcon('nncp')}  size={30} style={{color: this.request.isActivated('freq') ? setColor('') : setColor('light')}}/> 
                                </View>
                                <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                                onPress={() => {
                                                    this.currentParameter = 'freq';
                                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                            }}
                              >
                                 <MaterialCommunityIconsIcon name={'plus'}  size={14} style={{color: setColor('light')}}/>
                              </TouchableOpacity>
                          </View>
                          <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start', marginLeft : 3}}>
                              {this.request.isActivated('nncp') 
                                      ? 
                                          <Text style={[setFont('300', 14, this.request.isActivated('nncp') ? setColor('') : setColor('light')), {textAlign: 'left'}]}>
                                            {this.request.isActivated('nncp') ? '1er rappel\ndans ' + this.request.getNNCPLabel() : String('optimisé').toUpperCase()}
                                          </Text>
                                      :   <View style={{backgroundColor : 'white', padding: 10, borderRadius: 30, marginBottom: 3}}>
                                            <Image style={{width: 30, height: 30}} source={logo} />
                                          </View>
                              }
  
                          </View>
                      </TouchableOpacity>
 
                  </View>
                  <View style={{height: 35, borderTopWidth : this.request.isActivated('freq') ? 1 : 0, borderTopColor : this.request.isActivated('freq') ? setColor('') : setColor('light'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[setFont('300', 14, this.request.isActivated('freq') ? setColor('') : setColor('light'), 'Regular' ), {textAlign: 'center'}]}>
                        {this.request.getTitle('freq')}
                    </Text>
                  </View>
             </View>
          
    );
  }

  //choix du airbag et stepdown
_renderAirbagTile() {
   //determination de la couleur backgound
   let bgColor = 'white';
   let iconColor = setColor('');
   if (this.request.getValue('type') !== 'athena') {
    bgColor = setColor('gray');
    iconColor = setColor('light');
   } else {
     if (!this.request.isActivated('airbagLevel')) {
      bgColor = setColor('');
      iconColor = setColor('light');
     }
   }

  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: 3*(DEVICE_WIDTH*0.925-20)/3 +10, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  bgColor,
                        borderRadius : 4
                        }}
            >
                <View style={{flexDirection: 'row', paddingTop: 2, flexGrow: 1}}>
                    <TouchableOpacity style={{flex: 0.333, flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, justifyContent: 'space-between', alignItems: 'center'}}
                                      onPress={() => {
                                        if (this.request.getValue('type') === 'athena'){
                                            this.currentParameter = 'airbagLevel';
                                            this.request.setActivation(this.currentParameter, true);
                                            this.request.setActivation('degressiveStep', true);
                                            this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                        }
                                      }}
                                      activeOpacity={this.request.getValue('type') === 'athena' ? 0.2 : 1}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIconsIcon name={this.request.getIcon('airbagLevel')}  size={30} style={{color: this.request.isActivated('airbagLevel') ? setColor('') : setColor('light')}}/> 
                              </View>
                              <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                                
                              </View>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text style={[setFont('300', 14, this.request.isActivated('airbagLevel') ? setColor('') : setColor('light')), {textAlign: 'left'}]}>
                                        {this.request.getValue('type') === 'athena' ?
                                                              this.request.isActivated('airbagLevel') ? this.request.getValueLabel('airbagLevel') : ''
                                                                  : <Text style={[setFont('300', 14, this.request.isActivated('airbagLevel') ? setColor('') : setColor('light')), {textAlign: 'center'}]}>-</Text>}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 0.334, flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, justifyContent: 'space-between', alignItems: 'center'}}
                                  onPress={() => {
                                    if (this.request.getValue('type') === 'athena'){
                                        this.currentParameter = 'airbagLevel';
                                        this.request.setActivation(this.currentParameter, true);
                                        this.request.setActivation('degressiveStep', true);
                                        this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                    }
                                  }}
                                  activeOpacity={this.request.getValue('type') === 'athena' ? 0.2 : 1}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIconsIcon name={this.request.getIcon('degressiveStep')}  size={30} style={{color: this.request.isActivated('degressiveStep') ? setColor('') : setColor('light')}}/> 
                              </View>
                              <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                               
                              </View>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                            {this.request.isActivated('degressiveStep') ? 
                                <Text style={[setFont('300', 14, this.request.isActivated('airbagLevel') ? setColor('') : setColor('light')), {textAlign: 'left'}]}>
                                  {this.request.getValueLabel('degressiveStep') === '' ? 'Sans stepdown' : this.request.getValueLabel('degressiveStep')}
                                </Text>
                                :  this.request.getValue('type') === 'athena' ?
                                        <View style={{backgroundColor : 'white', padding: 10, borderRadius: 30, marginBottom: 3}}>
                                          <Image style={{width: 30, height: 30}} source={logo} />
                                        </View>
                                        : <Text style={[setFont('300', 14, this.request.isActivated('airbagLevel') ? setColor('') : setColor('light')), {textAlign: 'center'}]}>-</Text>
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 0.333, flexDirection: 'column', height: 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, justifyContent: 'space-between', alignItems: 'center'}}>
                          <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIconsIcon name={this.request.getIcon('autocallLevel')}  size={30} style={{color: setColor('light')}}/> 
                                </View>
                                <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                                  onPress={() => {
                                                    this.currentParameter = 'airbagLevel';
                                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                                  }}
                                >
                                { this.request.getValue('type') === 'athena' ?
                                  <MaterialCommunityIconsIcon name={'plus'}  size={14} style={{color: setColor('light')}}/>
                                  : null 
                                }
                                </TouchableOpacity>
                          </View>
                          <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                              <Text style={[setFont('300', 14, setColor('light')), {textAlign: 'left'}]}>
                                          {Numeral(this.request.getValue('autocallLevel')).format('0%') }
                              </Text>
                          </View>
                      </View>
                </View>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor(''), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated('airbagLevel') ? setColor('') : setColor('light'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('airbagLevel')}
                  </Text>
                </View>
           </View>
        
  );
}

//choix du tipe de produit
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
                              <Ionicons name={this.request.getValue('typeAuction') === 'PP' ? "ios-contact" : "ios-contacts"}  size={30} style={{color: this.request.isActivated('typeAuction') ? setColor('') : setColor('light')}}/> 
                          </View>
                          <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                            
                          </View>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, setColor(''), 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
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
                                  <Text style={[setFont('300', 14, setColor('')), {textAlign: 'left'}]}>
                                    {this.request.getValueLabel('typeAuction')}
                                  </Text>
                                </ModalDropdown>
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor(''), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14,setColor(''), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('typeAuction')}
                  </Text>
                </View>
           </View>
        
  );
}

//choix de l'effet mémoire
_renderMemoryTile=() => {
  
  let dataMemoryAutocall = ['Effet mémoire','Non mémoire'];

  return (
            <View style={{
                        height: (DEVICE_WIDTH*0.925-20)/3, 
                        width: (DEVICE_WIDTH*0.925-20)/3, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  this.request.isActivated('isMemory') ? 'white' : setColor('') ,
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
                              <MaterialCommunityIconsIcon name={this.request.getIcon('isMemory')}  size={30} style={{color: this.request.isActivated('isMemory') ? setColor('') : setColor('light')}}/> 
                          </View>
                          <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                          onPress={() => {
                                          
                                              this.currentParameter = 'isMemory';
                                              this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                              
                                          
                                          }}
                        
                          >
                              <MaterialCommunityIconsIcon name={'plus'}  size={14} style={{color: setColor('light')}}/>
                          </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                              <ModalDropdown
                                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                        dropdownTextStyle={setFont('500', 16, setColor(''), 'Regular')}
                                        dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
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
                                      <Text style={[setFont('300', 14, setColor('')), {textAlign: 'left'}]}>
                                        {this.request.getValueLabel('isMemory')}
                                      </Text>
                                    </ModalDropdown>
                        </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : this.request.isActivated('isMemory') ? 1 : 0, borderTopColor : setColor(''), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated('isMemory') ? setColor('') : setColor('light'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('isMemory')}
                  </Text>
                </View>
           </View>
        
  );
}

_renderTiles() {
  console.log("Type : "+this.request.getValue('type'));


  let renderPhoenix = this._renderPhoenixTile();
  if (this.request.getValue('type') !== 'phoenix'){
      renderPhoenix = <View style={{flexDirection: 'row'}}>
                            <View style={{height: (DEVICE_WIDTH*0.925-20)/3, width: (DEVICE_WIDTH*0.925-20)/3, marginLeft : 5, marginBottom: 5 ,borderRadius : 4}}>
                                  
                            </View> 
                            {this._renderMemoryTile()}
                      </View>
  } else if(!this.request.isActivated('barrierPhoenix')) {
    renderPhoenix = <View style={{flexDirection: 'row'}}>
        {this._renderGenericTile('barrierPhoenix')}
        {this._renderMemoryTile()}
      </View>
  }

  console.log("RENDER TILES");
  return (
     <View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {this._renderAuctionTile()}
            {this._renderProductTile()}
            {this._renderGenericTile('underlying')}
            
            
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          {this._renderGenericTile('barrierPDI')}
          {renderPhoenix}
        
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
           {this._renderFreqTile()}
           {this._renderGenericTile('maturity')}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
           {this.request.getValue('type') === 'athena' ? this._renderAirbagTile() : null}        
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
      <View style={{flex:1, height: DEVICE_HEIGHT  }}> 
        {/*  <View style={{flexDirection: 'row', height: 40 + STATUSBAR_HEIGHT, paddingLeft : 10, backgroundColor: 'white', paddingTop: isAndroid() ? 0 : STATUSBAR_HEIGHT, justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{justifyContent: 'center'}}>    
                <Text style={setFont('300', 24, setColor(''), 'FLFontTitle')}>Evaluer</Text>
              </View>
              <TouchableOpacity style={{justifyContent: 'center',  padding: 10}}> 
                <FontAwesome name="gear" size={25} style={{color: setColor('')}}/> 
              </TouchableOpacity>
          </View>
          */}

          <View style={[globalStyle.bgColor, {flex:1, borderWidth:0, justifyContent: 'space-between', marginTop:  isAndroid() ? 0 : STATUSBAR_HEIGHT}]}>


 
            <ScrollView contentContainerStyle={{justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: 20}}> 
              {this._renderTiles()}
            </ScrollView>
            <View style={{width: DEVICE_WIDTH*0.9, marginTop : 20, marginBottom : 10, marginLeft : 0.05*DEVICE_WIDTH}}>
                      <SwitchSelector
                        initial={1}
                        onPress={obj => {
                          this.setState({ optimizer : obj.value });
                          
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
                          { label: "J'optimise ma marge", value: "CC" , customIcon:null}, 
                          { label: "J'optimise le coupon", value: "CPN", customIcon: null} 
                        ]}
                      />

                      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 15}}>
                         {this.state.optimizer === 'CPN' ? this._renderGenericTile('UF') : this._renderGenericTile('coupon')}
                          <TouchableOpacity style ={{ height: 80, width: 80,marginLeft : 15, flexDirection: 'column',  borderWidth : 1, borderColor: setColor('turquoise'), borderRadius: 40, padding : 10, backgroundColor: 'white'}}
                                          onPress={() => {
                                            if (this.state.optimizer === 'CC') {
                                              alert("'J'optimise ma marge' en cours de développement\nChoisissez 'J'optimise mon coupon'");
                                              return;
                                            }
                                            this.calculateProducts();
                                          }}  
                          >
                              <View style={{marginTop: -5, alignItems: 'center', justifyContent: 'center'}}>
                                  <Image style={{width: 50, height: 50}} source={logo} />
                              </View>
                              <View style={{marginTop: -2, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={setFont('400', 12, setColor(''), 'Regular')}>{String('évaluer').toUpperCase()}</Text>
                              </View>
                          </TouchableOpacity>
                      </View>
            </View>
          </View>
          <FLBottomPanel position={this.state.bottomPanelPosition} 
                              snapChange={this._snapChange} 
                              renderFLBottomPanel={this._renderFLBottomPanel()} 
                              renderTitle={this.request.getTitle(this.currentParameter)}
                              activateParameter={this._activateParameter}
                              isActivated={this.request.isActivated(this.currentParameter)}
                              isMandatory={this.request.isMandatory(this.currentParameter)}
          />

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
