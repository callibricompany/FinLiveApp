import React from 'react'
import { Modal, StyleSheet, SafeAreaView, TextInput, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Dimensions, Easing } from 'react-native'

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { globalStyle, setColor, setFont } from '../../Styles/globalStyle'

import RobotBlink from "../../assets/svg/robotBlink.svg";
import FLAnimatedSVG from '../commons/FLAnimatedSVG';

import { ifIphoneX, ifAndroid, isAndroid, isIphoneX, isEqual , currencyFormatDE, getConstant, sizeByDevice } from '../../Utils';
import { interpolateBestProducts } from '../../Utils/interpolatePrices';

import { WebView } from 'react-native-webview';
import { URL_AWS } from '../../API/APIAWS';

import { CPSRequest } from '../../Classes/Products/CPSRequest';

import FLModalDropdown from '../commons/FLModalDropdown';

import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import SwitchSelector from "react-native-switch-selector";
import Numeral from 'numeral';
import 'numeral/locales/fr';

import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup, VictoryStack } from 'victory-native';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { FLBadge } from '../commons/FLBadge'
import botImage from '../../assets/bot.png'

import { searchProducts } from '../../API/APIAWS';
import Collapsible from 'react-native-collapsible/Collapsible';


import FLBottomPanel from '../commons/FLBottomPanel';
import { SNAP_POINTS_FROM_TOP } from '../commons/FLBottomPanel';

import { FLAuctionDetail } from './description/FLAuctionDetail';
import { FLProductDetail } from './description/FLProductDetail';
import  FLUnderlyingDetail  from './description/FLUnderlyingDetail';
import { FLMaturityDetail } from './description/FLMaturityDetail';
import { FLPDIDetail } from './description/FLPDIDetail';
import { FLFreqDetail2 } from './description/FLFreqDetail2';
import {FLNNCP} from './description/FLNNCP';
import { FLPhoenixBarrierDetail } from './description/FLPhoenixBarrierDetail';
import { FLAirbagDetail } from './description/FLAirbagDetail';
import { FLDegressiveDetail } from './description/FLDegressiveDetail';
import { FLUFDetail } from './description/FLUFDetail';
import { FLMemoryDetail } from './description/FLMemoryDetail';
import { FLCouponMinDetail } from './description/FLCouponMinDetail';

import logo from '../../assets/LogoWithoutText.png';
import logo_gray from '../../assets/LogoWithoutTex_gray.png';
import logo_white from '../../assets/LogoWithoutTex_white.png';
import Animated from 'react-native-reanimated';









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

      //recherche aussi les produits SRP
      searchSRP : true,

      showModalDropdown : false,
 
      positionProduct : 0,

      nominal : 1000000,

      //collapse UF et CPN
      isCollapsed : false, 

      toto : true,
    }

    //parametre courant qui a été touché pour passer l'info à FLBottomPanel
    this.currentParameter = '';


    //ensemble des modal dropdown
    this._dropdown = {};

    //recuperation eventuelle des cataracteristiques de l'autocall
    this.request = new CPSRequest() 

 

    //recuperation de la liste des sous-jacents
    this.underlyings = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;


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
  
   this.needToRefresh();

  }
 componentDidUpdate(){
  //console.log("componentDidUpdate");
  let r = this.props.navigation.getParam('request', '...');
  //console.log("R : "+ r);
  
  if (r !== '...'){
    //console.log("Request non null");
    if (!Object.is(this.request, r)){
        //console.log("non egal");  
        this.request = r;
        this.setState({ toto : !this.state.toto , nominal : this.request.getValue('nominal')});
    } else {
      //console.log("deja equal");
    }
  } 
 }

  componentWillUnmount() {
    if (!isAndroid()) {
      this._navListener.remove();
    }
  }

  _snapChange=(bottomPanelPosition) => {

    this.setState({ bottomPanelPosition });
  }

  _renderFLBottomPanel=() => {
    switch (this.currentParameter) {
      case 'typeAuction' : return  <FLAuctionDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'type' : return  <FLProductDetail activateParameter={this._activateSpecificParameter} updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)} request={this.request} />
      case 'underlying' : return  <FLUnderlyingDetail underlyings={this.underlyings} updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)} getAllUndelyings={this.props.getAllUndelyings} />
      case 'maturity' : return  <FLMaturityDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'barrierPDI' : return  <FLPDIDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)} initialValueIsUS={this.request.getValue("isPDIUS")}/>
      case 'barrierPhoenix' : return  <FLPhoenixBarrierDetail updateValue={this._updateValue} initialValue={this.request.getValue('barrierPhoenix')} />
      //case 'freq' : return  <FLFreqDetail updateValue={this._updateValue} initialValueFreq={this.request.getValue('freq')} initialValueNNCP={this.request.getValue('nncp')}/>
      case 'freq' : return  <FLFreqDetail2 updateValue={this._updateValue} initialValue={this.request.getValue('freq')} />
      case 'typeAirbag' : return  <FLAirbagDetail updateValue={this._updateValue} initialValue={this.request.getValue('typeAirbag')} request={this.request}/>
      case 'degressiveStep' : return  <FLDegressiveDetail updateValue={this._updateValue} initialValue={this.request.getValue('degressiveStep')} request={this.request} />
      case 'UF' : return  <FLUFDetail updateValue={this._updateValue} initialValueUF={this.request.getValue('UF')} initialValueUFAssoc={this.request.getValue('UFAssoc')}/>
      case 'coupon' : return  <FLCouponMinDetail updateValue={this._updateValue} initialValueCouponMin={this.request.getValue('coupon')}/>
      case 'nncp' : return  <FLNNCP updateValue={this._updateValue} initialValue={this.request.getValue('nncp')}/>
      case 'isMemory' : return  <FLMemoryDetail />

      default : return  <View>
                          <Text style={{padding : 15, fontSize : 24, fontFamily : 'FLFont'}}>F i n l i v e</Text>
                        </View>;
    }

  }

  async calculateProducts() {
    //optimzer = 'CPN'  --> c'esst le coupon qui est recherché la marge étant fixé : valeur par défaut
    //optimzer = 'CC'  --> c'est la marge qui est recherchée le coupon étant minipimé
    let optimizer = 'CPN';
    if (this.request.isActivated('UF') === true && this.request.isActivated('coupon') === true) {
      alert("Fonctionnalité prochainement disponible");
      return;
      optimizer = 'BOTH';
    }
    else if (this.request.isActivated('coupon') === true) {
      optimizer = 'CC';
    } 
    else if (this.request.isActivated('UF') === true) {
      optimizer = 'CPN';
    } 
    else {
      alert("Veillez activer au moins une condition : MARGE ou COUPON PER ANNUM");
      return;
    }


    //this.state.isLoading === false ? this.setState({ isLoading: true }) : null;
    this.setState({ isLoading: true , bottomPanelPosition : SNAP_POINTS_FROM_TOP[2]}) ;
    //this.setState({ isLoading : true }, () => {
    this.bestProducts = [];

    this.request.setCriteria('optimizer', optimizer, optimizer) ;
    //chagrgement des prix depuis le serveur
    console.log(this.request.getCriteria());
    
    //criteria['maturity'] = ["3Y", "5Y", "8Y"];
    this.setState({ messageLoading : 'Interrogation du pricer FinLive' });
    searchProducts(this.props.firebase, this.request.getCriteria(), false)
    .then((data) => {
      this.setState({ messageLoading : 'Réception et analyse des prix' });


      //this.bestProducts = interpolateBestProducts(data, this.request, optimizer);
      //console.log(this.bestProducts);
      this.setState({ isLoading: false,  messageLoading : ''}, () => {
          this.props.navigation.navigate('FLResultPricer', {
          //bestProducts: this.bestProducts,
          bestProducts: data,
          optimizer 
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

  _updateValue=(id, value, valueLabel) =>{
    console.log(id + "  :  "+value+"  :  "+valueLabel);
    this.request.setCriteria(id, value, valueLabel);
    this.setState({ toto : !this.state.toto });
    
  }


  _activateParameter=(toActivate) => {

    this.request.setActivation(this.currentParameter, toActivate);
    
    /*if (this.currentParameter === 'freq') {
      this.request.setActivation('nncp', toActivate);
    }
    if (this.currentParameter === 'nncp') {
      this.request.setActivation('freq', toActivate);
    }
    if (this.currentParameter === 'typeAirbag') {
      this.request.setActivation('degressiveStep', toActivate);
    }
    if (this.currentParameter === 'degressiveStep') {
      this.request.setActivation('typeAirbag', toActivate);
    }*/
    console.log(this.currentParameter + "   :   " + toActivate);
  
    this.setState({ toto : !this.state.toto });
    
    //fermeture du panel
    //this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[2] });
  }

  _activateSpecificParameter=(parameter, toActivate) => {

    this.request.setActivation(parameter, toActivate);
    
    console.log(parameter + "   :   " + toActivate);
  
    this.setState({ toto : !this.state.toto });
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
  let dataProductName = ['Athéna', 'Phoenix', 'Phoenix mémoire','Réverse convertible'];
  return (
            <View style={{
                        height: (getConstant('width')*0.925-20)/3, 
                        width: (getConstant('width')*0.925-20)/3, 
                        marginLeft : 5,  
                        marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  'white' ,
                        borderRadius : 10,
                        shadowColor: setColor('shadow'),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        borderWidth : 1,
                        borderColor : isAndroid() ? 'lightgray' :  'white',
                                                        

                        }}
            >
                <TouchableOpacity style={{flexDirection: 'column', height: 2*(getConstant('width')*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                  onPress={() => {
                                    
                                    this._dropdown['type'].show();
                                  }}
                >
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                              <MaterialCommunityIcons name={"beaker-outline"}  size={30} style={{color: this.request.isActivated('type') ? setColor('') : setColor('lightBlue')}}/> 
                          </View>
                          <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                            onPress={() => {
                                              this.currentParameter = 'type';
                                              this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                            }}
                          >
                            <MaterialCommunityIcons name={'plus'}  size={14} style={{color: setColor('lightBlue')}}/>
                          </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <FLModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : setColor('lightBlue'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, setColor(''), 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
                                    renderRow={(value) => {
                                      return(
                                        <View style={{flex : 1, justifyContent : 'center', alignItems : 'flex-start', height : 40, paddingLeft : 10, paddingRight  :  5 }}>
                                            <Text style={setFont('300', 16, setColor(''), 'Regular')}>{value}</Text>
                                        </View>
                                      );
                                     }}
                                    onSelect={(index, value) => {
                                      
                                      switch (Number(index))  {
                                         case 0 :   //autocall
                                            this._updateValue('type', 'AUTOCALL_INCREMENTAL', value);
                                            //this._updateValue('barrierPhoenix', 1, "100%");
                                            //this._updateValue('isIncremental', true, "incremental");
                                            this._updateValue('isMemory', true, "Effet mémoire");
                                            this.request.setActivation('typeAirbag', true);
                                            this.request.setActivation('degressiveStep', true);
                                            //this.request.setActivation('barrierPhoenix', false);
                                            break;
                                         case 1 : //phoenix
                                            //this._updateValue('nncp', 12, '1 an');
                                            this._updateValue('type', 'PHOENIX', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('typeAirbag', 'NA', 'Non airbag');
                                            //this._updateValue('barrierPhoenix', 0.9, "Protégé jusqu'à -10%");
                                            this.request.setActivation('typeAirbag', false);
                                            this.request.setActivation('degressiveStep', false);
                                            //this.request.setActivation('barrierPhoenix', true);
                                            break;
                                          case 2 : //phoenix mémoire
                                            //this._updateValue('nncp', 12, '1 an');
                                            this._updateValue('type', 'PHOENIX', value);
                                            this._updateValue('isMemory', true, "mémoire");
                                            //this._updateValue('autocallLevel', 99.99, 'pas de rappel');
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('typeAirbag', 'NA', 'Non airbag');
                                            //this._updateValue('freq', '1M', "1 mois");
                                            //this.request.setActivation('barrierPhoenix', false);
                                            this.request.setActivation('typeAirbag', false);
                                            this.request.setActivation('degressiveStep', false);
                                            break;
                                          case 3: //reverse
                                            //this._updateValue('nncp', 12, '1 an');
                                            this._updateValue('type', 'REVERSE', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('autocallLevel', 99.99, 'pas de rappel');
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('typeAirbag', 'NA', 'Non airbag');
                                            this._updateValue('freq', '1M', "1 mois");
                                            this.request.setActivation('barrierPhoenix', false);
                                            this.request.setActivation('typeAirbag', false);
                                            this.request.setActivation('degressiveStep', false);
                                
                                            break;
                                      }
                                      this.setState({ toto : !this.state.toto});
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        width: getConstant('width')/2,
                                        height: Math.min(getConstant('height')/3, dataProductName.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                        borderWidth : 1,
                                        borderColor : 'gray',
                                        borderRadius : 5
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
                                </FLModalDropdown>
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : 'lightgray', padding: 2, justifyContent: 'center', alignItems: 'center'}}>
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
                        height: (getConstant('width')*0.925-20)/3, 
                        width: (getConstant('width')*0.925-20)/3, 
                        marginLeft : 5,  
                        opacity : this.request.isActivated(criteria) ? 1 : 0.7,
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  this.request.isActivated(criteria) ? 'white' : setColor('') ,
                        borderRadius : 10,
                        shadowColor: setColor('shadow'),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        borderWidth : 1,
                        borderColor : isAndroid() ? 'lightgray' :  'white',
                        }}
            >
                <TouchableOpacity style={{flexDirection: 'column', height: 2*(getConstant('width')*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
                                  onPress={() => {
                                    this.currentParameter = criteria;
                                    this.request.setActivation(this.currentParameter, true);
                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[(criteria === 'type' || criteria === 'typeAirbag' || criteria === 'degressiveStep'  || criteria === 'underlying')  ? 0 : 1] });
                                  }}
                >
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                              <MaterialCommunityIcons name={this.request.getIcon(criteria)}  size={30} style={{color: this.request.isActivated(criteria) ? setColor('') : setColor('lightBlue')}}/> 
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
                              ? <MaterialCommunityIcons name={'plus'}  size={14} style={{color: setColor('lightBlue')}}/>
                              : null
                          }

                          </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                        {this.request.isActivated(criteria) ? 
                            <Text style={[setFont('300', 14, this.request.isActivated(criteria) ? setColor('') : setColor('lightBlue')), {textAlign: 'center', paddingHorizontal : 10}]}>
                                    { this.request.getValueLabel(criteria) } 
                            </Text>
                            :
                            <View style={{backgroundColor : 'white', padding: 10, borderRadius: 30, marginBottom: 3, justifyContent: 'center', alignItems: 'center'}}>
                              <Image style={{width: 30, height: 30}} source={logo} />
                              <Text style={setFont('200', 8, setColor('darkBlue'))}>AUTO</Text>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : this.request.isActivated(criteria) ? 1 : 0, borderTopColor : 'lightgray', padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated(criteria) ? setColor('') : 'white', 'Regular' ), {textAlign: 'center'}]}>
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
                          height: (getConstant('width')*0.925-20)/3, 
                          width: 2*(getConstant('width')*0.925-20)/3 + 5, 
                          marginLeft : 5,  
                          //marginRight :0, 
                          marginBottom: 5, 
                          backgroundColor:  (this.request.isActivated('freq') || this.request.isActivated('nncp') ) ? 'white' : setColor(''),
                          borderRadius : 10,
                          shadowColor: setColor('shadow'),
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          borderWidth : 1,
                          borderColor : isAndroid() ? 'lightgray' :  'white',
                          }}
              >
                  <View style={{flexDirection: 'row', height: 2*(getConstant('width')*0.925-20)/3/3, flexGrow: 1}}>
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
                                    <MaterialCommunityIcons name={this.request.getIcon('freq')}  size={30} style={{color: this.request.isActivated('freq') ? setColor('') : setColor('lightBlue')}}/> 
                                </View>
                                <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                                  
                                </View>
                          </View>
                          <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>

                              {this.request.isActivated('freq') 
                                      ? 
                                          <Text style={[setFont('300', 14, this.request.isActivated('freq') ? setColor('') : setColor('lightBlue')), {textAlign: 'left'}]}>
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
                                    <MaterialCommunityIcons name={this.request.getIcon('nncp')}  size={30} style={{color: this.request.isActivated('freq') ? setColor('') : setColor('lightBlue')}}/> 
                                </View>
                                <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                                onPress={() => {
                                                    this.currentParameter = 'freq';
                                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                            }}
                              >
                                 <MaterialCommunityIcons name={'plus'}  size={14} style={{color: setColor('lightBlue')}}/>
                              </TouchableOpacity>
                          </View>
                          <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start', marginLeft : 3}}>
                              {this.request.isActivated('nncp') 
                                      ? 
                                          <Text style={[setFont('300', 14, this.request.isActivated('nncp') ? setColor('') : setColor('lightBlue')), {textAlign: 'left'}]}>
                                            {this.request.isActivated('nncp') ? '1er rappel\ndans ' + this.request.getNNCPLabel() : String('optimisé').toUpperCase()}
                                          </Text>
                                      :   <View style={{backgroundColor : 'white', padding: 10, borderRadius: 30, marginBottom: 3}}>
                                            <Image style={{width: 30, height: 30}} source={logo} />
                                          </View>
                              }
  
                          </View>
                      </TouchableOpacity>
 
                  </View>
                  <View style={{height: 35, borderTopWidth : this.request.isActivated('freq') ? 1 : 0, borderTopColor : this.request.isActivated('freq') ? 'lightgray' : setColor('lightBlue'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={[setFont('300', 14, this.request.isActivated('freq') ? setColor('') : setColor('lightBlue'), 'Regular' ), {textAlign: 'center'}]}>
                        {this.request.getTitle('freq')}
                    </Text>
                  </View>
             </View>
          
    );
  }


_renderTiles() {
  //console.log("Type : "+this.request.getValue('type'));

  //console.log("RENDER TILES / "+ this.request.getValue('type') );
  return (
     <View style={{opacity : this.state.bottomPanelPosition !== SNAP_POINTS_FROM_TOP[2]  ? 0.3 : 1, borderWidth : 0}}>
        <View style={{marginBottom : 5, marginLeft : 7, borderWidth : 0}}>
                <Text style={setFont('400', 20, setColor(''), 'Regular')}>
                  Produit
                </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
  
            {this._renderGenericTile('type')}
            {this._renderGenericTile('underlying')}
            {this._renderGenericTile('maturity')}
            
        </View>
        <View style={{marginBottom : 5, marginLeft : 7, marginTop : 10, borderWidth : 0}}>
                <Text style={setFont('400', 18, setColor(''), 'Light')}>
                  Barrières
                </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderWidth : 0}}>

          { ["AUTOCALL_INCREMENTAL", "PHOENIX", "PHOENIX_MEMORY", "REVERSE"].includes(this.request.getValue('type')) ? this._renderGenericTile('barrierPDI') : null}
          { ["PHOENIX", "PHOENIX_MEMORY"].includes(this.request.getValue('type')) ? this._renderGenericTile('barrierPhoenix') : null}
          { ["AUTOCALL_INCREMENTAL"].includes(this.request.getValue('type')) ? this._renderGenericTile('typeAirbag') : null}
          { ["AUTOCALL_INCREMENTAL"].includes(this.request.getValue('type')) ? this._renderGenericTile('degressiveStep') : null}

        </View>
        <View style={{marginBottom : 5, marginLeft : 7, marginTop : 10, borderWidth : 0}}>
                <Text style={setFont('400', 18, setColor(''), 'Light')}>
                  Fréquences
                </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          { ["AUTOCALL_INCREMENTAL", "PHOENIX", "PHOENIX_MEMORY"].includes(this.request.getValue('type'))  ? this._renderGenericTile('freq') : null}
          { ["AUTOCALL_INCREMENTAL"].includes(this.request.getValue('type'))  ? this._renderGenericTile('nncp') : null}
          
          
        </View>
  

        <View style={{height: 150}}>
            
        </View>
      </View>
   );
 }


_renderCalculateButton(position='right') {
  return (
    <TouchableOpacity style ={{  position: "absolute" , top : sizeByDevice(80, 80, 80) - 70, left : position==='right' ? (0.9*getConstant('width')-50) : (0.9*getConstant('width')-50) , height: 70, width: 70, flexDirection: 'column',  borderWidth : 1, borderColor: setColor('subscribeBlue'), borderRadius: 35, padding : 10, backgroundColor: setColor('subscribeBlue')}}
          onPress={() => {
            this.calculateProducts();
          }}  
      >
        <View style={{marginTop: -5, alignItems: 'center', justifyContent: 'center'}}>
          <Image style={{width: 40, height: 40}} source={logo_white} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center'}}>
        <Text style={setFont('400', 10, 'white', 'Regular')}>{String('évaluer').toUpperCase()}</Text>
        </View>
    </TouchableOpacity>
  )
}


render() {
    if (this.state.isLoading) {
          return (
            <View style={{justifyContent: 'center', alignItems: 'center', padding : 10, backgroundColor:'white', height : 300}}>
              <WebView source={{uri: URL_AWS + '/svg?page=robotFlash'}} style={{  width : 150, height : 100, marginTop: isAndroid() ? -60 : -70, marginLeft : -50}} scalesPageToFit={false}
                startInLoadingState={true}
                //renderLoading={() => <RobotBlink width={120} height={120} />}
                />
              
              <Text>{this.state.messageLoading}</Text>
            </View>
          );
    }

    
    
    return (
      <View style={{flex:1, height: getConstant('height')  , opacity : (this.state.showModalDropdown ) ? 0.3 : 1}}> 
          <View style={{flex:1, borderWidth:0, justifyContent: 'space-between', marginTop:  isAndroid() ? 0 : getConstant('statusBar'), backgroundColor : setColor('background'), opacity : this.state.bottomPanelPosition !== SNAP_POINTS_FROM_TOP[2] ? 0.2 : 1}}>
            <View style={{width : 0.9*getConstant('width'), marginTop : 10, justifyContent: 'space-between', marginLeft : 0.05*getConstant('width') + 5, alignItems: 'stretch', flexDirection: 'row'}}>
                <View style={{ height: 70, flexDirection : 'row', justifyContent : 'center', alignItems :  'center', borderWidth : 0}}>
                      <TextInput 
                              style={{    
                                        display: 'flex',
                                        backgroundColor: 'white',
                                        height : 30,
                                        width  : 0.5*getConstant('width'),
                                        fontSize: 20,
                                        color: setColor('lightBlue'),
                                        borderColor : setColor(''),
                                        borderWidth: 1,
                                        borderRadius: 4,
                                        paddingRight: 5,
                                        //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                        textAlign: 'right',
                                        textAlignVertical: 'center',
                                      }}
                              placeholder={"EUR"}
                              placeholderTextColor={'lightgray'}
                              underlineColorAndroid={'#fff'}
                              autoCorrect={false}
                              keyboardType={'numeric'}
                              returnKeyType={'done'}
                              onFocus={() => {
                                this.setState({ nominal : ''});
                                
                              }}
                              onBlur={() => {
                                let nom = this.state.nominal;
                                if (this.state.nominal === '' || this.state.nominal < 10000) {
                                  nom = 100000;
                                  alert("Vous ne pouvez évaluer un produit qu'avec un nominal minimum \nde 10 000 EUR");
                                  this.setState({ nominal : 10000 });
                                }
                                this._updateValue('nominal', nom, currencyFormatDE(nom));
                              }}
                              //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                              value={this.state.nominal === 0 ? '' : currencyFormatDE(Number(this.state.nominal),0)}
                              ref={(inputNominal) => {
                                this.inputNominal = inputNominal;
                              }}
                              onChangeText={e => {
                                //console.log(Number(e));
                                this.setState({ nominal : e === '' ? 0 : Numeral(e).value()  });
                                ;
                              }}
                      />
                      <Text style={setFont('400', 18, setColor(''), 'Regular')}>
                         {' '} EUR
                      </Text>
                  </View>

            </View>
            <ScrollView contentContainerStyle={{justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: 5}}> 
            <View style={{marginTop : 20,  width : 0.9*getConstant('width')}}>
                <SwitchSelector
                          initial={this.state.positionProduct}
                          onPress={obj => {
  
                            if (obj.value === 'PP') {
                              this.setState({ positionProduct : 0 });
                              
                            } else if (obj.value === 'CTF') {
                              this.setState({ positionProduct : 1 });
                            } else if (obj.value === 'APE') {
                              this.setState({ positionProduct : 2 });
                            }
                            this._updateValue("typeAuction", obj.value, obj.label);
                            //this.setState({ gender: value });
                          }}
                          textColor={setColor('lightBlue')} 
                          selectedColor={'white'}
                          buttonColor={setColor('')} 
                          borderColor={'lightgray'} 
                          returnObject={true}
                          hasPadding={true}
                          options={[
                            { label: "Placement privé", value: "PP", customIcon: null}, 
                            { label: "Certificat", value: "CTF", customIcon: null} ,
                            { label: "Appel Public à l'Epargne", value: "APE" , customIcon:null}, 
                          ]}
                  />
            </View>
            <View style={{marginTop : 10, padding: 4, width : 0.95*getConstant('width'), marginLeft : 0.025*getConstant('width')}}>
                <Collapsible collapsed={this.state.isCollapsed}>
                    <View style={{marginBottom : 5, marginLeft : 7, borderWidth : 0}}>
                            <Text style={setFont('400', 20, setColor(''), 'Regular')}>
                              Mes conditions
                            </Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', borderWidth : 0, opacity : this.state.bottomPanelPosition !== SNAP_POINTS_FROM_TOP[2]  ? 0.3 : 1}}>
                        {this._renderGenericTile('UF')}
                        {this._renderGenericTile('coupon')}
                        
                    </View>
                </Collapsible>
   
            </View>
            <TouchableOpacity style={{zIndex: 10, position : 'absolute', top : 80, right : 0.05*getConstant('width'), borderWidth : 0, width : getConstant('width')/3, alignItems: 'flex-end', justifyContent : 'center'}}
                                  onPress={() => this.setState({ isCollapsed : !this.state.isCollapsed })}
                >
                    <MaterialCommunityIcons name={this.state.isCollapsed ? 'eye-outline' : 'eye-off'} size={20} color={'lightgray'}/>
            </TouchableOpacity>

            
              {this._renderTiles()}
            </ScrollView>

            {this._renderCalculateButton()}

                
          </View>
 
          <FLBottomPanel  position={this.state.bottomPanelPosition} 
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
  withUser,

);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(PricerScreen);


