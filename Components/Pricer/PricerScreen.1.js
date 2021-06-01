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
import logo_white from '../../assets/LogoWithoutTex_white.png';










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

      hideCC : false,

      //recherche aussi les produits SRP
      searchSRP : false,

      showModalDropdown : false,
 
      positionOptimizer : 1,

      nominal : 1000000,
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
    //header: null
    headerShown: false
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
  /*componentWillUpdate() {
    let r = this.props.navigation.getParam('request', '...');
    console.log("R : "+ r);
    if (r !== '...'){
      console.log("Request non null");
      this.request = r;
      this.setState({ toto : !this.state.toto });
    } 
    console.log("component will update");
  }*/
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
      case 'type' : return  <FLProductDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)} />
      case 'underlying' : return  <FLUnderlyingDetail underlyings={this.underlyings} updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)} />
      case 'maturity' : return  <FLMaturityDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'barrierPDI' : return  <FLPDIDetail updateValue={this._updateValue} initialValue={this.request.getValue(this.currentParameter)}/>
      case 'barrierPhoenix' : return  <FLPhoenixBarrierDetail updateValue={this._updateValue} initialValueBP={this.request.getValue('barrierPhoenix')} initialValueIM={this.request.getValue('isMemory')}/>
      case 'freq' : return  <FLFreqDetail updateValue={this._updateValue} initialValueFreq={this.request.getValue('freq')} initialValueNNCP={this.request.getValue('nncp')}/>
      case 'typeAirbag' : return  <FLAirbagDetail updateValue={this._updateValue} initialValueAB={this.request.getValue('typeAirbag')} initialValueDS={this.request.getValue('degressiveStep')}/>
      case 'degressiveStep' : return  <FLDegressiveDetail updateValue={this._updateValue} initialValue={this.product['degressiveStep'].value}/>
      case 'UF' : return  <FLUFDetail updateValue={this._updateValue} initialValueUF={this.request.getValue('UF')} initialValueUFAssoc={this.request.getValue('UFAssoc')}/>
      case 'coupon' : return  <FLCouponMinDetail updateValue={this._updateValue} initialValueCouponMin={this.request.getValue('coupon')}/>
      case 'isMemory' : return  <FLMemoryDetail />

      default : return  <View>
                          <Text style={{padding : 15, fontSize : 24, fontFamily : 'FLFont'}}>F i n l i v e</Text>
                        </View>;
    }

  }

  async calculateProducts(optimizer) {
    //optimzer = 'CPN'  --> c'esst le coupon qui est recherché la marge étant fixé : valeur par défaut
    //optimzer = 'CC'  --> c'est la marge qui est recherchée le coupon étant minipimé

    //this.state.isLoading === false ? this.setState({ isLoading: true }) : null;
    this.setState({ isLoading: true }) ;
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
      /*console.log("APRES RETOUR SERVEUR : ");
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

      //let isIncremental = [...new Set(data.map(x => x.isIncremental))];
      //console.log("isIncremental : " + isIncremental);

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
      */
      //calcul du produit

      //this.bestProducts = interpolateBestProducts(data, this.request, optimizer);
      //console.log(this.bestProducts);
      this.setState({ isLoading: false }, () => {
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
    if (this.currentParameter === 'typeAirbag') {
      this.request.setActivation('degressiveStep', toActivate);
    }
    if (this.currentParameter === 'degressiveStep') {
      this.request.setActivation('typeAirbag', toActivate);
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
  let dataProductName = ['Athéna', 'Phoenix','Réverse convertible'];
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
                                    onSelect={(index, value) => {
                                      this.request.setTitle('freq', String("fréquence de rappel").toUpperCase());
                                      switch (Number(index))  {
                                         case 0 :   //autocall
                                            this._updateValue('type', 'AUTOCALL_INCREMENTAL', value);
                                            this._updateValue('barrierPhoenix', 1, "100%");
                                            //this._updateValue('isIncremental', true, "incremental");
                                            this._updateValue('isMemory', true, "Effet mémoire");
                                            this.request.setActivation('typeAirbag', true);
                                            this.request.setActivation('degressiveStep', true);
                                            this.request.setActivation('barrierPhoenix', false);
                                            break;
                                         case 1 : 
                                            this._updateValue('type', 'PHOENIX', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('typeAirbag', 'NA', 'Non airbag');
                                            this._updateValue('barrierPhoenix', 0.9, "Protégé jusqu'à -10%");
                                            this.request.setActivation('typeAirbag', false);
                                            this.request.setActivation('degressiveStep', false);
                                            this.request.setActivation('barrierPhoenix', true);
                                            break;
                                          case 2 :
                                            this._updateValue('nncp', 12, '1 an');
                                            this._updateValue('type', 'REVERSE', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('autocallLevel', 99.99, 'pas de rappel');
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('typeAirbag', 'NA', 'Non airbag');
                                            this._updateValue('freq', '1M', "1 mois");
                                            this.request.setActivation('barrierPhoenix', false);
                                            this.request.setActivation('typeAirbag', false);
                                            this.request.setActivation('degressiveStep', false);
                                            this.request.setTitle('freq', String("fréquence").toUpperCase());
                                            break;
                                      }
                                      //this.setState({ toto : !this.state.toto});
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
                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
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
                            <View style={{backgroundColor : 'white', padding: 10, borderRadius: 30, marginBottom: 3}}>
                              <Image style={{width: 30, height: 30}} source={logo} />
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : this.request.isActivated(criteria) ? 1 : 0, borderTopColor : 'lightgray', padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated(criteria) ? setColor('') : setColor('lightBlue'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle(criteria)}
                  </Text>
                </View>
           </View>
        
  );
}

//choix de la fréquence et du no call périod
_renderPhoenixTile=() => {
  //console.log("TOTO : " + this.request.getValue('type').includes('PHOENIX'));
  let dataMemoryAutocall = ['Effet mémoire','Non mémoire'];
  //console.log("PHOENIX ACTIVE : "+ this.request.isActivated('barrierPhoenix') + "    :     " +this.request.getValue('barrierPhoenix'));
  //determination de la couleur backgound
  let bgColorPhoenix = 'white';
  let iconColorPhoenix = this.request.getValue('type').includes('PHOENIX') ? setColor('') : setColor('lightBlue');
  /*if (this.request.getValue('type') !== 'phoenix') {
    bgColorPhoenix = setColor('gray');
    iconColorPhoenix = setColor('lightBlue');
  } else {
    if (!this.request.isActivated('barrierPhoenix')) {
      bgColorPhoenix = setColor('');
      iconColorPhoenix = setColor('lightBlue');
    }
  }*/
  
  return (
            <View style={{
                        height: (getConstant('width')*0.925-20)/3, 
                        width: 2*(getConstant('width')*0.925-20)/3 + 5, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  'white',
                        borderRadius : 10,
                        shadowColor: setColor('shadow'),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        borderWidth : 1,
                        borderColor : isAndroid() ? 'lightgray':  'white',
                        }}
            >
                <View style={{flexDirection: 'row', height: 2*(getConstant('width')*0.925-20)/3/3, borderWidth : 0, padding: 2, flexGrow: 1}}>
                    <TouchableOpacity style={{flexDirection: 'column', width :(getConstant('width')*0.925-20)/3 +5, borderWidth: 0,  justifyContent: 'space-between', alignItems: 'center'}}
                                      onPress={() => {
                                        if (this.request.getValue('type').includes('PHOENIX')){
                                            this.currentParameter = 'barrierPhoenix';
                                            //this.request.setActivation(this.currentParameter, true);
                                  
                                            this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                        }
                                      }}
                                      activeOpacity={this.request.getValue('type').includes('PHOENIX') ? 0.2 : 1}
                    >
                        <View style={{flexDirection: 'row', borderWidth : 0}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIcons name={this.request.getIcon('barrierPhoenix')}  size={30} style={{color: iconColorPhoenix}}/> 
                              </View>

                              <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                                onPress={() => {
                                                  if (this.request.getValue('type').includes('PHOENIX')) {
                                                    this.currentParameter = 'barrierPhoenix';
                                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                                    }
                                                
                                                }}
                                                activeOpacity={this.request.getValue('type').includes('PHOENIX') ? 0.2 : 1}
                              >
                              {this.request.getValue('type').includes('PHOENIX') ?
                                  <MaterialCommunityIcons name={'plus'}  size={14} style={{color: setColor('lightBlue')}}/>
                                : null
                              }
                              </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start', marginLeft : -30}}>
                            
                          <Text style={[setFont('300', 14, this.request.isActivated('barrierPhoenix') ? setColor('') : setColor('lightBlue')), {textAlign: 'center', paddingHorizontal : 30}]} >
                                 {!this.request.getValue('type').includes('PHOENIX') ? Numeral(this.request.getValue('autocallLevel')).format('0%') : this.request.getValueLabel('barrierPhoenix') }
                          </Text>

                            
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection: 'column', width :(getConstant('width')*0.925-20)/3 +5, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center'}}
                                      onPress={() => {
                                        this._dropdown['isMemory'].show();
                                      }}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIcons name={"memory"}  size={30} style={{color: this.request.isActivated('isMemory') ? setColor('') : setColor('lightBlue')}}/> 
                              </View>
 
                              <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 15, borderWidth: 0}}
                                                onPress={() => {
                                                    this.currentParameter = 'isMemory';
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
                                        onSelect={(index, value) => {
                                          this._updateValue('isMemory', index == 0  ? true : false, value);

                                          //this.setState({ toto : !this.state.toto});
                                        }}
                                        adjustFrame={(f) => {
                                          return {
                                            width: getConstant('width')/2,
                                            height: Math.min(getConstant('height')/3, dataMemoryAutocall.length * 40),
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
                                </FLModalDropdown>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : this.request.isActivated('freq') ? 'lightgray' : setColor('lightBlue'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
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

  //choix du airbag et stepdown
_renderAirbagTile() {
   //determination de la couleur backgound
   let bgColor = 'white';
   let iconColor = setColor('');
   if (this.request.getValue('type') !== 'athena') {
    bgColor = setColor('gray');
    iconColor = setColor('lightBlue');
   } else {
     if (!this.request.isActivated('typeAirbag')) {
      bgColor = setColor('');
      iconColor = setColor('lightBlue');
     }
   }

  return (
            <View style={{
                        height: (getConstant('width')*0.925-20)/3, 
                        width: 3*(getConstant('width')*0.925-20)/3 +10, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  bgColor,
                        borderRadius : 10,
                        shadowColor: setColor('shadow'),
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        borderWidth : 1,
                        borderColor : isAndroid() ? 'lightgray' :  'white',
                        }}
            >
                <View style={{flexDirection: 'row', paddingTop: 2, flexGrow: 1}}>
                    <TouchableOpacity style={{flex: 0.333, flexDirection: 'column', height: 2*(getConstant('width')*0.925-20)/3/3, borderWidth: 0, justifyContent: 'space-between', alignItems: 'center'}}
                                      onPress={() => {
                                        if (this.request.getValue('type') === 'athena'){
                                            this.currentParameter = 'typeAirbag';
                                            this.request.setActivation(this.currentParameter, true);
                                            this.request.setActivation('degressiveStep', true);
                                            this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                        }
                                      }}
                                      activeOpacity={this.request.getValue('type') === 'athena' ? 0.2 : 1}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIcons name={this.request.getIcon('typeAirbag')}  size={30} style={{color: this.request.isActivated('typeAirbag') ? setColor('') : setColor('lightBlue')}}/> 
                              </View>
                              <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                                
                              </View>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                            <Text style={[setFont('300', 14, this.request.isActivated('typeAirbag') ? setColor('') : setColor('lightBlue')), {textAlign: 'left'}]}>
                                        {this.request.getValue('type') === 'athena' ?
                                                              this.request.isActivated('typeAirbag') ? this.request.getValueLabel('typeAirbag') : ''
                                                                  : <Text style={[setFont('300', 14, this.request.isActivated('typeAirbag') ? setColor('') : setColor('lightBlue')), {textAlign: 'center'}]}>-</Text>}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 0.334, flexDirection: 'column', height: 2*(getConstant('width')*0.925-20)/3/3, borderWidth: 0, justifyContent: 'space-between', alignItems: 'center'}}
                                  onPress={() => {
                                    if (this.request.getValue('type') === 'athena'){
                                        this.currentParameter = 'typeAirbag';
                                        this.request.setActivation(this.currentParameter, true);
                                        this.request.setActivation('degressiveStep', true);
                                        this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                                    }
                                  }}
                                  activeOpacity={this.request.getValue('type') === 'athena' ? 0.2 : 1}
                    >
                        <View style={{flexDirection: 'row'}}>
                              <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIcons name={this.request.getIcon('degressiveStep')}  size={30} style={{color: this.request.isActivated('degressiveStep') ? setColor('') : setColor('lightBlue')}}/> 
                              </View>
                              <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                               
                              </View>
                        </View>
                        <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                            {this.request.isActivated('degressiveStep') ? 
                                <Text style={[setFont('300', 14, this.request.isActivated('typeAirbag') ? setColor('') : setColor('lightBlue')), {textAlign: 'left'}]}>
                                  {this.request.getValueLabel('degressiveStep') === '' ? 'Sans stepdown' : this.request.getValueLabel('degressiveStep')}
                                </Text>
                                :  this.request.getValue('type') === 'athena' ?
                                        <View style={{backgroundColor : 'white', padding: 10, borderRadius: 30, marginBottom: 3}}>
                                          <Image style={{width: 30, height: 30}} source={logo} />
                                        </View>
                                        : <Text style={[setFont('300', 14, this.request.isActivated('typeAirbag') ? setColor('') : setColor('lightBlue')), {textAlign: 'center'}]}>-</Text>
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 0.333, flexDirection: 'column', height: 2*(getConstant('width')*0.925-20)/3/3, borderWidth: 0, justifyContent: 'space-between', alignItems: 'center'}}>
                          <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                                    <MaterialCommunityIcons name={this.request.getIcon('autocallLevel')}  size={30} style={{color: setColor('lightBlue')}}/> 
                                </View>
                                <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                                  onPress={() => {
                                                    this.currentParameter = 'typeAirbag';
                                                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[0] });
                                                  }}
                                >
                                { this.request.getValue('type') === 'athena' ?
                                  <MaterialCommunityIcons name={'plus'}  size={14} style={{color: setColor('lightBlue')}}/>
                                  : null 
                                }
                                </TouchableOpacity>
                          </View>
                          <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                              <Text style={[setFont('300', 14, setColor('lightBlue')), {textAlign: 'left'}]}>
                                          {Numeral(this.request.getValue('autocallLevel')).format('0%') }
                              </Text>
                          </View>
                      </View>
                </View>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : 'lightgray', padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated('typeAirbag') ? setColor('') : setColor('lightBlue'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('typeAirbag')}
                  </Text>
                </View>
           </View>
        
  );
}

//choix du tipe de produit
_renderAuctionTile() {
  let dataAuction = ["Appel public à l'épargne",'Placement Privé'];
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
                                    this._dropdown['typeAuction'].show();
                                  }}
                >
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                              <Ionicons name={this.request.getValue('typeAuction') === 'PP' ? "ios-contact" : "ios-contacts"}  size={30} style={{color: this.request.isActivated('typeAuction') ? setColor('') : setColor('lightBlue')}}/> 
                          </View>
                          <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                            
                          </View>
                    </View>
                    <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                          <FLModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : setColor('lightBlue'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, setColor(''), 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
                                    onSelect={(index, value) => {
                                      this._updateValue('typeAuction', index == 0  ? 'APE' : 'PP', value);

                                      //this.setState({ toto : !this.state.toto});
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        //width: getConstant('width')/2,
                                        height: Math.min(getConstant('height')/3, dataAuction.length * 40),
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
                                </FLModalDropdown>
                    </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : 1, borderTopColor : 'lightgray', padding: 2, justifyContent: 'center', alignItems: 'center'}}>
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
                        height: (getConstant('width')*0.925-20)/3, 
                        width: (getConstant('width')*0.925-20)/3, 
                        marginLeft : 5,  
                        //marginRight :0, 
                        marginBottom: 5, 
                        backgroundColor:  this.request.isActivated('isMemory') ? 'white' : setColor('') ,
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
                                    this._dropdown['isMemory'].show();
                                  }}
                >
                    <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                              <MaterialCommunityIcons name={this.request.getIcon('isMemory')}  size={30} style={{color: this.request.isActivated('isMemory') ? setColor('') : setColor('lightBlue')}}/> 
                          </View>
                          <TouchableOpacity style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}
                                          onPress={() => {
                                          
                                              this.currentParameter = 'isMemory';
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
                                        onSelect={(index, value) => {
                                          this._updateValue('isMemory', index == 0  ? true : false, value);

                                          //this.setState({ toto : !this.state.toto});
                                        }}
                                        adjustFrame={(f) => {
                                          return {
                                            width: getConstant('width')/2,
                                            height: Math.min(getConstant('height')/3, dataMemoryAutocall.length * 40),
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
                                    </FLModalDropdown>
                        </View>
                </TouchableOpacity>
                <View style={{height: 35, borderTopWidth : this.request.isActivated('isMemory') ? 1 : 0, borderTopColor : 'lioghtgray', padding: 2, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[setFont('300', 14, this.request.isActivated('isMemory') ? setColor('') : setColor('lightBlue'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle('isMemory')}
                  </Text>
                </View>
           </View>
        
  );
}

_renderTiles() {
  //console.log("Type : "+this.request.getValue('type'));


  let renderPhoenix = this._renderPhoenixTile();
  /*if (this.request.getValue('type') !== 'phoenix'){
      renderPhoenix = <View style={{flexDirection: 'row'}}>
                            <View style={{height: (getConstant('width')*0.925-20)/3, width: (getConstant('width')*0.925-20)/3, marginLeft : 5, marginBottom: 5 ,borderRadius : 4}}>
                                  
                            </View> 
                            {this._renderMemoryTile()}
                      </View>
  } else if(!this.request.isActivated('barrierPhoenix')) {
    renderPhoenix = <View style={{flexDirection: 'row'}}>
        {this._renderGenericTile('barrierPhoenix')}
        {this._renderMemoryTile()}
      </View>
  }*/

  //console.log("RENDER TILES / "+ this.request.getValue('type') );
  return (
     <View style={{opacity : this.state.bottomPanelPosition !== SNAP_POINTS_FROM_TOP[2]  ? 0.3 : 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            {this._renderAuctionTile()}
            {this._renderProductTile()}
            {this._renderGenericTile('underlying')}
            
            
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          {this._renderGenericTile('barrierPDI')}
          {this.request.getValue('type') === 'reverse' ? this._renderGenericTile('maturity') : renderPhoenix}
          {this.request.getValue('type') === 'reverse' ? this._renderGenericTile('freq') : null}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
           {this.request.getValue('type') !== 'reverse' ? this._renderFreqTile() : null}
           {this.request.getValue('type') !== 'reverse' ? this._renderGenericTile('maturity') : null}
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
                <MaterialCommunityIcons name={"play-circle"}  size={60} style={{color: setColor('subscribeBlue')}}/> 
                            </TouchableOpacity>*/}
      </View>
   );
 }

_renderUFOrCoupon(what) {

  return (
      <TouchableOpacity style={{width : 0.85*getConstant('width') - 80 , flexDirection : 'row', justifyContent: 'center', 
                                padding: 10, backgroundColor : 'white', 
                                borderWidth : 1, 
                                borderColor : isAndroid() ? 'lightgray' :  'white',
                                shadowColor: setColor('shadow'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                borderRadius : 10}}
                        onPress={() => {                          
                            this.currentParameter = what;
                            //console.log('WHAT : '  + what);
                            //what === 'UF' ? this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] }) : this.setState({ showModalBootomPanel : true });
                            if (what === 'UF') {
                              this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                            } else {
                              isAndroid() ? this.props.navigation.navigate('FLCouponMinDetailAndroid', {updateValue: this._updateValue}) : this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                            }
                        }}
      >
          <View style={{justifyContent: 'center', alignItems: 'center', paddinng : 5}}>
               <MaterialCommunityIcons name={this.request.getIcon(what)}  size={30} style={{color: this.request.isActivated(what) ? setColor(''): setColor('lightBlue')}}/> 
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', borderWidth: 0, padding: 10}}>
                <Text style={[setFont('300', 14, this.request.isActivated(what) ? setColor(''): setColor('lightBlue'), 'Regular' ), {textAlign: 'center'}]}>
                      {this.request.getTitle(what)} : {Numeral(this.request.getValue(what)).format('0.00%')}
                </Text>
          </View>
      </TouchableOpacity>
  );
}

_renderCalculateButton(position='right') {
  return (
    <TouchableOpacity style ={{  position: "absolute" , top : position==='right' ? -7 : getConstant('height') -sizeByDevice(230, 170, 180), left : position==='right' ? (0.9*getConstant('width')-80) : (0.9*getConstant('width')-50) , height: 70, width: 70, flexDirection: 'column',  borderWidth : 1, borderColor: setColor('subscribeBlue'), borderRadius: 35, padding : 10, backgroundColor: setColor('subscribeBlue')}}
          onPress={() => {
            this.calculateProducts(this.state.optimizer);
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




              // <View style ={{flex: 1,  backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
              //       <Robot width={200} height={200} />
              //       <Text style={setFont('300', 16)}>
              //         {this.state.messageLoading}
              //       </Text>
              // </View>
          );
    }
    // <FLAnimatedSVG name={'robotFlash'} visible={this.state.isLoading} text={this.state.messageLoading}/>
    
    let dataOptions = ['SRP', 'Shadow'];
    return (
      <View style={{flex:1, height: getConstant('height')  , opacity : (this.state.showModalDropdown) ? 0.3 : 1}}> 
        {/*  <View style={{flexDirection: 'row', height: 40 + getConstant('statusBar'), paddingLeft : 10, backgroundColor: 'white', paddingTop: isAndroid() ? 0 : getConstant('statusBar'), justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{justifyContent: 'center'}}>    
                <Text style={setFont('300', 24, setColor(''), 'FLFont')}>Evaluer</Text>
              </View>
              <TouchableOpacity style={{justifyContent: 'center',  padding: 10}}> 
                <FontAwesome name="gear" size={25} style={{color: setColor('')}}/> 
              </TouchableOpacity>
          </View>
          */}
         
          <View style={{flex:1, borderWidth:0, justifyContent: 'space-between', marginTop:  isAndroid() ? 0 : getConstant('statusBar'), backgroundColor : setColor('background')}}>


   
            <View style={{width : 0.9*getConstant('width'), marginTop : 10, justifyContent: 'space-between', marginLeft : 0.05*getConstant('width') + 5, alignItems: 'stretch', flexDirection: 'row'}}>
                <View style={{flex: 0.9}}>
                      <TextInput 
                              style={{    
                                        display: 'flex',
                                        backgroundColor: 'white',
                                        height : 40,
                                        fontSize: 28,
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
                  </View>
                  <FLModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                    onSelect={(index, value) => {
                                      
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
                                    // renderRow={(rowData,index,isSelected) => {
                                    //   return (
                                    //     <TouchableHighlight underlayColor={setColor('')}>
                                    //       <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingLeft : 5}}>
                                    //         <Text style={setFont('400', 20, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                    //           {rowData}
                                    //         </Text>
                                    //       </View>
                                    //     </TouchableHighlight>
                                    //   )
                                    // }}
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
                                                                          let optimi = this.state.hideCC ? this.state.optimizer : 'CPN';
                                                                          this.setState({ optimizer : optimi, hideCC : !this.state.hideCC });
                                                                        }}
                                                      >
                                                          <FontAwesome name={this.state.hideCC ? "toggle-on" : "toggle-off"}  size={25} style={{color: setColor('')}}/> 
                                                      </TouchableOpacity>
                                                  </View>
                                              );
                                        case 'SRP' :
                                              return (
                                                  <View style={{flexDirection : 'row', height: 40}}>
                                                      <View style={{flex : 0.8, paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                          <Text style={setFont('500', 16, setColor(''), 'Regular')}>Inclure les APE</Text>
                                                      </View>
                                                      <TouchableOpacity style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}
                                                                        onPress={() => {
                                                                            this.setState({ searchSRP : !this.state.searchSRP });
                                                                        }}
                                                      >
                                                          <FontAwesome name={this.state.searchSRP ? "toggle-on" : "toggle-off"}  size={25} style={{color: setColor('')}}/> 
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
                                    ref={component => this._dropdown['options'] = component}
                                    disabled={false}
                  >
                      <View style={{ borderWidth : 0, width : 0.1*getConstant('width'),  height: 40, justifyContent: 'center', alignItems: 'center'}}>
                          <MaterialCommunityIcons name={'dots-vertical'} size={25} style={{color: setColor('')}}/>
                          {/* <FontAwesome name={'navicon'}  size={25} style={{color: setColor('')}}/>  */}
                      </View>
                  </FLModalDropdown>

              

            </View>

            <ScrollView contentContainerStyle={{justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: 20}}> 
              {this._renderTiles()}
            </ScrollView>
            {!this.state.hideCC ?
              <View style={{width: getConstant('width'), borderTopWidth : 1,  paddingTop : 10, paddingLeft : 0.05*getConstant('width'), paddingRight : 0.05*getConstant('width'),  marginLeft :0, backgroundColor: setColor('background'),
                                    shadowColor: setColor('shadow'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.9,
                                    borderTopColor : isAndroid() ? setColor('') :  'white',
                          }}>
                  
                      <View>
                        <SwitchSelector
                          initial={this.state.positionOptimizer}
                          onPress={obj => {
                            this.setState({ optimizer : obj.value });
                            //console.log(obj);
                            if (obj.value === 'CPN') {
                              this.setState({ positionOptimizer : 1 });
                            } else if (obj.value === 'CC') {
                              this.setState({ positionOptimizer : 0 });
                            }
                            //this._updateValue("typeAuction", obj.value, obj.label);
                            //this.setState({ gender: value });
                          }}
                          textColor={setColor('lightBlue')} 
                          selectedColor={'white'}
                          buttonColor={setColor('')} 
                          borderColor={'lightgray'} 
                          returnObject={true}
                          hasPadding
                          options={[
                            { label: "J'optimise ma marge", value: "CC" , customIcon:null}, 
                            { label: "J'optimise le coupon", value: "CPN", customIcon: null} 
                          ]}
                        />

                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 15, paddingBottom : 10}}>
                          {this.state.optimizer === 'CPN' ? this._renderUFOrCoupon('UF') : this._renderUFOrCoupon('coupon')}
                          {this._renderCalculateButton()}
                        </View>
                      </View>
              </View>
              : this._renderCalculateButton('center')
              
          }
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


