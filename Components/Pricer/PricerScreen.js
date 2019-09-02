import React from 'react'
import { Modal, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Platform } from 'react-native'
import { ListItem, List, Left, Body, Content, Title, Item, Right, Icon, Input, Button, Thumbnail } from 'native-base'
import { TabView, TabBar, SceneMap, PagerScroll} from 'react-native-tab-view';


import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily, subscribeColor } from '../../Styles/globalStyle'

import { SearchBarProvider } from '../SearchBar/searchBarAnimation';
import SearchBarPricer from './SearchBarPricer';

import { ifIphoneX, ifAndroid } from '../../Utils';

import { maturityToDate, calculateBestCoupon } from '../../Utils/math'
import FLPanel from '../commons/FLPanel'
import FLProductTicket from '../commons/FLProductTicket'

import SwipeGesture from '../../Gesture/SwipeGesture'

import TabPricer from './TabPricer';
import TabResults from './TabResults';
import TabUF from './TabUF';


import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { TextInputMask } from 'react-native-masked-text'
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup, VictoryStack } from 'victory-native'


import { UserContext } from '../../Session/UserProvider';
import FLSearchInput from '../commons/FLSearchInput';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withFirebase } from '../../Database';
import { compose, hoistStatics } from 'recompose';

import { FLBadge } from '../commons/FLBadge'
import botImage from '../../assets/bot.png'

import { searchProducts } from '../../API/APIAWS';

import UNDERLYINGS from '../../Data/subCategories.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'

import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'

import Dimensions from 'Dimensions';


import PRICES from '../../Data/20190517.json';
import FREQUENCYLIST from '../../Data/frequencyList.json'

const Spline = require('cubic-spline');
const dataForge = require('data-forge');

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const initialLayout = {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT
};

class PricerScreen extends React.Component {

  constructor(props) {
    super(props);
    Numeral.locale('fr');
    //console.log("WIDTH : " +DEVICE_WIDTH);
    this.state = {
      index: 0,
      currentTab: 'tabPricerParameters',
      routes: [
        { key: 'tabPricerParameters', title: 'Sur-mesure' },
        { key: 'tabPricerResults', title: 'Résultats' },
        { key: 'tabPricerUF', title: 'Par' }
      ],
      toto : true,

       //les prix ne sont plus bons : un parametre au moins a été touché
       needToRefresh : false,
    }


   
    this.product = {
      'typeAuction': {
        'value': 'PP',
        'valueLabel': 'Placement privé',
        'defaultValueLabel': 'Peu importe',
        'title': 'TYPE DE DEMANDE',
        'isActivated': true,
        'isMandatory': true,
      },
      'type': {
        'value': 'classicAutocall',
        'valueLabel': 'Autocall',
        'defaultValueLabel': 'Peu importe',
        'title': 'CHOIX DU PRODUIT',
        'isActivated': false,
        'isMandatory': false,
      },
      'underlying': {
        'value': ['CAC','SX5E'],
        'valueLabel': 'CAC 40\nEurostoxx 50',
        'defaultValueLabel': 'Peu importe',
        'title': 'SOUS-JACENT',
        'isActivated': true,
        'isMandatory': false,
      },
      'maturity': {
        'value': [4,10],
        'valueLabel': '4 à 10 ans',
        'defaultValueLabel': 'Peu importe',
        'title': 'MATURITE',
        'isActivated': true,
        'isMandatory': false,
      },
      'barrierPDI': {
        'value': 0.6,
        'isActivated': false,
        'defaultValueLabel': 'Peu importe',
        'title': 'PROTECTION DU CAPITAL',
        'valueLabel': Numeral(0.6).format('0%'),
        'isMandatory': false,
      },
      'freq': {
        'value': "1Y",
        'isActivated': false,
        'defaultValueLabel': 'Peu importe',
        'title': 'FREQUENCE',
        'valueLabel': '1 an',
        'isMandatory': false,
      },
      'barrierPhoenix': {
        'value': 1,
        'isActivated': false,
        'defaultValueLabel': 'Peu importe',
        'valueLabel': Numeral(1).format('0%'),
        'title': 'PROTECTION DES COUPONS',
        'isMandatory': false,
      },
      'airbagLevel': {
        'value': "NA", //NA : pas d airbag   SA : semi-airbag   FA : full airbag
        'isActivated': false,
        'defaultValueLabel': 'Peu importe',
        'valueLabel': 'Aucun airbag',
        'title': 'EFFET AIRBAG',
        'isMandatory': false,
      },
      'degressiveStep': {
        'value': 0,
        'isActivated': false,
        'defaultValueLabel': 'Peu importe',
        'valueLabel': 'Pas de dégressivité',
        'title': 'DEGRESSIVITE',
        'isMandatory': false,
      },

//pas de choix pour le user
      'nominal': {
        'value': 100000,
        'isActivated': true,
        'defaultValueLabel': 'Peu importe',
        'isMandatory': false,
      },
      'currency': {
        'value': 'EUR',
        'isActivated': true,
        'defaultValueLabel': 'Peu importe',
        'isMandatory': false,
      },
      'UF': {
        'value': 0.02,
        'isActivated': true,
        'defaultValueLabel': 'Peu importe',
        'isMandatory': false,
      },
      'UFAssoc': {
        'value': 0.002,
        'isActivated': true,
        'defaultValueLabel': 'Peu importe',
        'isMandatory': false,
      },
    };





    this.bestProducts = [];
    

  }


  static navigationOptions = {
    header: null
  }

  //au chargemnt de la page recupération des meilleurs resultats
  async componentDidMount () {
   
    this.calculateProducts();

  }

  async calculateProducts() {
    console.log([...new Set(PRICES.map(x => x.maturity))]);
    this.setState({ isLoading : true });

    //chagrgement des prix depuis le serveur
    /*let criteria ={};
    criteria['underlying'] = ["CAC","SX5E"];
    criteria['maturity'] = ["3Y","5Y","8Y"];
    this.props.firebase.doGetIdToken()
    .then(token => {
      console.log("REPONSE ID TOKEN"+token);


      searchProducts(token, criteria)
      .then((data) => {
        //console.log("USER CREE AVEC SUCCES DANS ZOHO");
        
        //console.log(data);
        //this.onRegisterSuccess();
      })
      .catch(error => {
        console.log("ERREUR recup prix: " + error);
        alert('ERREUR recupération prix', '' + error);
      }) 
    });*/


    //chargement des meilleurs prix
    var allPricesDF = dataForge.fromJSON(JSON.stringify(PRICES));
    let underlyingsList = [];
    let structuredProductsList = [];
    var df = new dataForge.DataFrame(allPricesDF);

    console.log("Taille départ : " +df.toRows().length);

    //retrouve tous les sous jacents distincts
    if (this.product.underlying.isActivated) {
        df= df.where((row) => this.product.underlying.value.includes(row.underlying));
    }

    
    //on filtre les produits
    df= this.product.type.isActivated ? df.where(row => row.product === this.product.type.value) : df;

   

 
    /**  on a la data-frame filtré au maximum, il faut avoir le meilleur prix
     pour chaque sous-jacent et pour chaque produit
     on va retenir :
            - sans effet airbag
            - sans degressivite
            - une frequence la plus faible
            - une periode sans rappel la plus elevée
            - PDI US ou EU : PDI EU
            - isMemory : non
            - la barrirer de protection la plus eleve --> si nombre saisi par user on interpolera
            - la protection des coupons la plus haute --> si nombre saisi par user on interpolera


      on va interpoler les maturités demandées
      on va appliquer les UF + notre marge + un bump trading
      on va sortir le max et les neufs suivants
    */

    //AIRBAG
    if (this.product.airbagLevel.isActivated) {
      switch (this.product.airbagLevel.value) {
        case 'NA' : //pas d'airbag
          df= df.where((row) => row.airbagLevel === 1);
          break;
        case 'SA' : //semi-airbag
          df= df.where((row) => row.airbagLevel === (1 +row.barrierPDI)/2);
          break;
        case 'FA' : // fullairbag
          df= df.where((row) => row.airbagLevel === row.barrierPDI);
          break;
        default : 
          break;
      }
    } else { //on ne garde que les sans airbag
        df= df.where((row) => row.airbagLevel === 1);
    }

    //DEGRESSIVITE ......

    //FREQUENCE
    if (this.product.freq.isActivated) {
      df= df.where((row) => row.freqAutocall === this.product.freq.value);
    } else { //on prend la plus faible parmis les dispos
      let f = [...new Set(PRICES.map(x => x.freqAutocall))];
      freqArray = FREQUENCYLIST.filter(({id}) => f.includes(id));
      freqMin = Math.min(...freqArray.map((x) => x.freq));
      freq = freqArray.filter(id => id.freq === freqMin)[0];
      df= df.where((row) => row.freqAutocall ===freq.id);
    }
    
    //PERIODE SANS RAPPEL ......

    //PDI US ou EU ......

    //IS MEMORY......

    console.log("Taille apres 1ers filtres : " +df.toRows().length);

    //PDI
    if (this.product.barrierPDI.isActivated) {
      //il faut interpoler et distinguer tous 
      let distinctProducts = df.getSeries('product').distinct();
      let distinctUnderlyings = df.getSeries('underlying').distinct();
      let distinctMaturities = df.getSeries('maturity').distinct();
      let distinctBarrierPhoenix = df.getSeries('barrierPhoenix').distinct();
      let distinctFreqAutocall = df.getSeries('freqAutocall').distinct();
      let distinctFreqPhoenix = df.getSeries('freqPhoenix').distinct();
      let distinctAirbagLevel = df.getSeries('airbagLevel').distinct();
      let distinctDegressiveStep = df.getSeries('degressiveStep').distinct();
      let distinctCoupon = df.getSeries('coupon').distinct();
      //coupon
      //isIncremental
      //noCallNbPeriod
      //isPDIUS
      //isMemory

      let dfToAdd = new dataForge.DataFrame();
      //[...new Set(PRICES.map(x => x.maturity))].forEach((mat) => {
      distinctMaturities.forEach((mat) => {
        d = new dataForge.DataFrame(df);
        d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
        d1 = d.where((row) => row.maturity === mat);
        distinctProducts.forEach((prod) => {
          d2 = d1.where((row) => row.product === prod);
          distinctUnderlyings.forEach((udl) => {
            d3 = d2.where((row) => row.underlying === udl);
            distinctBarrierPhoenix.forEach((bPh) => {
              d4 = d3.where((row) => row.barrierPhoenix === bPh);
              distinctFreqAutocall.forEach((freqAut) => {
                d5 = d4.where((row) => row.freqAutocall === freqAut);
                distinctFreqPhoenix.forEach((freqPh) => {
                  d6 = d5.where((row) => row.freqPhoenix === freqPh);
                  distinctAirbagLevel.forEach((abgLavel) => {
                    d7 = d6.where((row) => row.airbagLevel === abgLavel);
                    distinctDegressiveStep.forEach((ds) => {
                      d8 = d7.where((row) => row.degressiveStep === ds);
                      distinctCoupon.forEach((cpn) => {
                        //calcul du prix a cette barriere
                        d9 = d8.where((row) => row.coupon === cpn);
                        if (d9.toRows().length !== 0) {
                          //interpolation
                          xs = d9.getSeries('barrierPDI').distinct().toArray();
                          ys = d9.getSeries('Price').distinct().toArray();
                          
                          splinePDIBarrier = new Spline(xs, ys);
                          
                          console.log("barrierPDI @ "+ this.product.barrierPDI.value +" : "+splinePDIBarrier.at(this.product.barrierPDI.value));
                          console.log("Apres reduction : " + d9.toRows().length);
                          console.log(d9.toString());
                          d10 = d9.head(1);
                          d10 = d10.transformSeries({
                            barrierPDI: value => this.product.barrierPDI.value,
                            Price: value =>splinePDIBarrier.at(this.product.barrierPDI.value)
                          });
                          dfToAdd = dfToAdd.concat(d10);
                          console.log(d9.head(1).toString()); 
                          console.log(d10.head(1).toString()); 
                        }
                      })
                    })
                  })
                })
              })
            })
          })
        })
        
      })
      console.log(dfToAdd.toString());
    } else { //pas d'instruction : on prend le max
      //on prend le min dispo
      let pdi = [...new Set(PRICES.map(x => x.barrierPDI))];
      pdiMax = Math.max(...pdi);
      
      df= df.where((row) => row.barrierPDI === pdiMax);
    }

    /*const distinctUnderlyings = df.getSeries('underlying').distinct();
    distinctUnderlyings.forEach(value => {
      let obj = UNDERLYINGS.filter(({ticker}) => ticker === value);
      underlyingsList.push(obj);
    }); 
    //console.log("LISTE DES SOUS-JACENTS : "+ JSON.stringify(underlyingsList));
 
 
     //retrouve tous les produits distincts
     const distinctStructuredProducts = allPricesDF.getSeries('product').distinct();
     distinctStructuredProducts.forEach(value => {
       let obj = STRUCTUREDPRODUCTS.filter(({id}) => id === value);
       structuredProductsList.push(obj);
     }); 
     //console.log("LISTE DES PRODUITS : "+ JSON.stringify(structuredProductsList));
     
     //calcul des meilleyrs produits
     var df = new dataForge.DataFrame();
     //var filteredDf = allPricesDF.where(row => row.Price < -this.state.product['UF'].value);
     var filteredDf = allPricesDF.where(row => row.Price < -(this.product["UF"].value + this.product["UFAssoc"].value));
 
     //console.log(filteredDf.head(3).toString());
     //console.log("DF FILTRE PRIX UNDER UF : "+filteredDf.toArray().length);
     //on passe sur chaque sous jacent
     underlyingsList.forEach((underlying) => {
       var filteredDfUnderlying = filteredDf.where(row => row.underlying === underlying[0]['ticker']);
       //console.log("SOUS-JACENT : " +  underlying[0]['ticker'] + "   :  "+filteredDfUnderlying.toArray().length);
       //on passe sur tous les produits
       structuredProductsList.forEach((product) => {
         //console.log(product[0]['id']);
         var filteredDfProduct = filteredDfUnderlying.where(row => row.product === product[0]['id']);
         
         var serieCoupon = filteredDfProduct.getSeries('coupon');
         let maxCoupon = serieCoupon.max();
         var dfTemp = filteredDfProduct.where(row => row.coupon === maxCoupon);
 
         var seriePrice = dfTemp.getSeries('Price'); 
         let minPrice = seriePrice.min();    
         df=df.concat(dfTemp.where(row => row.Price === minPrice));
       })
     });
 
     /*df = df.generateSeries({
      SomeNewColumn: row => 'bonjour'
     });*/
     this.bestProducts = df.head(10).toArray();  
     //console.log(this.bestProducts[0]);
     //await setTimeout(() => {
      this.setState({ isLoading : false, needToRefresh : false});
     //}, 500);
  }

  //parameter du produit changé et donc updaté
  parameterProductUpdated=(productParameters) => {
    this.product = productParameters;

    //pour rafraichir l'affichage
    this.setState({toto : !this.state.toto})
  }

  //demande le calcul au serveur et affichage des résultats 
  launchPricing=(param) => {
      //console.log("CA AKHZAHZJAHZJAHZ " + productParameters);
      
      //changement d'onglet si necessaire
      if (this.state.currentTab !== 'tabPricerResults') {
        this._handleIndexChange(1);
      }  
      this.calculateProducts();
  }

   //les prix ne sont plus bons : un parametre au moins a été touché
   needToRefresh=() => {
     //console.log("Besoin de refresh");
     this.setState({ needToRefresh: true });
   }


  //les UF ont été changés
  updateUF=(UF, UFAssoc) => {
    //console.log("UF Updated " + UF + "   et    " + UFAssoc);
    this.product["UF"].value = UF;
    this.product["UFAssoc"].value = UFAssoc;
   
  }



    _getLabelText = ({ route }) => route.title.toUpperCase();

    //affichage de l'en-tete de la page
    _renderHeader2 = () => props => (              
      <TabBar
        onTabPress={({route}) => {
          console.log("ROUTE : " + JSON.stringify(route));
          }
        }

        getLabelText={this._getLabelText}
        
        //indicatorStyle={{backgroundColor: backgdColor, height: 45, width: this.state.currentTab === 'tabPricerUF' ? 50 : (DEVICE_WIDTH -50)/2 , borderWidth: 1}}
        //style={{zIndex: 1, 'pink': tabBackgroundColor, elevation: 0, height: 45 , justifyContent: 'center'}}
        style={{height: 0}}
        //tabStyle={[this._getTabWidth, {height:100}]}
        //contentContainerStyle={{height:100, DEVICE_WIDTH , borderWidth: 5}}
        //indicatorContainerStyle={{height: 80, width:50, backgroundColor:'pink', borderWidth: 1}}
        //labelStyle={{flexWrap: "nowrap",fontFamily: FLFontFamily, margin: 0, fontWeight: '200'}}
        //labelStyle={{ color:  'black', margin: 0, marginTop: 0, marginBottom: 0, fontWeight: '200', height: 35 }}
        activeColor={tabBackgroundColor}
        inactiveColor={backgdColor}
        {...props}
      />
  );

  _renderScene = ({ route, jumpTo }) => {

    switch (route.key) {
      case 'tabPricerResults':
        //return <View style={{ flex: 1, borderWidth:4 }}><Text>Meilleurs prix</Text></View>
        return <TabResults  route={route} jumpTo={jumpTo} products={this.bestProducts} isGoodToShow={!this.state.needToRefresh} />;
      case 'tabPricerParameters':
        return <TabPricer  route={route} jumpTo={jumpTo} launchPricing={this.launchPricing} product={this.product} needToRefresh={this.needToRefresh} parameterProductUpdated={this.parameterProductUpdated}/>;
        //return <View style={{ flex: 1, borderWidth:4 }}><Text>Meilleurs prix</Text></View>
      case 'tabPricerUF':
        return <TabUF  route={route} jumpTo={jumpTo} launchPricing={this.launchPricing} needToRefresh={this.needToRefresh} updateUF={this.updateUF}/>;
        //return <View style={{ flex: 1, borderWidth:4 }}><Text>Meilleurs prix</Text></View>
        
      default:
        return null;
    }
  };

  _handleIndexChange = index => {
    this.setState({
      index,
      currentTab: this.state.routes[index].key,
    });
  }

  


  render() {

    let render =     <View style={{
                                    
                                    width: DEVICE_WIDTH,
                                    height: DEVICE_HEIGHT}}>
                          <View style={{flexDirection: 'row',height : 37, width: DEVICE_WIDTH, borderBottomWidth : 4, borderBottomColor : backgdColor }}>
                            <TouchableOpacity style={[tabStyle(this.state.index === 0), {width : (DEVICE_WIDTH - 50)/2}]}
                                              onPress={() => this._handleIndexChange(0)}>
                                              <Text style={[texTabStyle(this.state.index === 0)]}>
                                              Construction
                                              </Text>

                            </TouchableOpacity>
                            <TouchableOpacity style={[tabStyle(this.state.index === 1), {width : (DEVICE_WIDTH - 50)/2}]}
                                              onPress={() => this._handleIndexChange(1)}>
                                              <Text style={[texTabStyle(this.state.index === 1)]}>
                                              Résultats
                                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tabStyle(this.state.index === 2), {width :50}]}
                                              onPress={() => this._handleIndexChange(2)}>
                                                <Icon name='ios-settings' size={20} style={{color : this.state.index === 2 ? tabBackgroundColor : backgdColor}}/>
                            </TouchableOpacity>
                          </View>
                          <View style={{backgroundColor: backgdColor, height: 10}}>
                          </View>
                          <View style={{flexDirection: 'row', backgroundColor: backgdColor, height: 45, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{flex:0.5, borderWidth: 0, height: 35, justifyContent:'center', alignItems:'center'}}>
                              <Text style={{fontFamily: FLFontFamily, fontWeight: '500', fontSize: 16}}>
                                {String("Produit structuré").toUpperCase()}
                              </Text>
                            </View>
                            <View style={{flex:0.5, justifyContent:'center', alignItems: this.state.needToRefresh  ? 'center' : 'flex-start'}}>
                                  {
                                    this.state.needToRefresh ?  <TouchableOpacity style={{backgroundColor : subscribeColor, borderRadius : 4, height : 40, justifyContent: 'center', alignItems: 'center'}}
                                                                  onPress={() => this.launchPricing('toto')}>
                                                                  <Text style={{paddingLeft: 12, paddingRight: 12, fontFamily: FLFontFamily, fontWeight: '300', fontSize: 14, color: 'white'}}>
                                                                    ELABORER MES PRODUITS
                                                                  </Text>
                                                                </TouchableOpacity>
                                                                : <View style={{height : 40, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                                    <Text style={{paddingLeft: 10,  fontFamily: FLFontFamily, fontWeight: '200', fontSize: 12, color: 'black'}}>
                                                                      {this.bestProducts.length} résultat(s)
                                                                    </Text>
                                                                  </View>
                                  }
                              </View>
                          </View>
                          <TabView
                              style={[globalStyle.bgColor, {flex: 1}]}
                              navigationState={this.state}
                              /*navigationState={{index: this.state.index,   
                                routes: [
                                  { key: 'tabPricerResults', title: 'Résultats' },
                                  { key: 'tabPricerParameters', title: 'Sur-mesure' },
                                  { key: 'tabPricerUF', title: 'Paramètres' }
                                ],
                              }}*/

                              renderScene={this._renderScene}
                              renderPager={(props) => <PagerScroll {...props}/>}
                              //renderTabBar={this._renderHeader(animation, canJumpToTab)}
                              renderTabBar={this._renderHeader2()}
                              onIndexChange={this._handleIndexChange}
                              initialLayout={initialLayout}
                              swipeEnabled={false} // TODO ...
                              //canJumpToTab={() => canJumpToTab}
                              useNativeDriver
                        />
                        
                      </View>

        

    if (this.state.isLoading) {
      render =  <View style={globalStyle.loading}>
            <ActivityIndicator size='large' />
          </View>
    }
    
    return(
          <SafeAreaView style={{backgroundColor: tabBackgroundColor}}>
          {render}
          </SafeAreaView>
    );
  }
}


function tabStyle (focused) {
  return {
    height : 35, 
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor: focused ?  backgdColor : tabBackgroundColor,
  }
};

function texTabStyle(focused) {
  return  {
    flexWrap: "nowrap",
    fontFamily: FLFontFamily, 
    margin: 0, 
    fontWeight: '400',
    fontSize : 16,
    color : focused ? tabBackgroundColor : backgdColor,
  }
};


const condition = authUser => !!authUser;


const composedPricerScreen = compose(
  withAuthorization(condition),
  withFirebase,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(PricerScreen);


//<UserContext.Consumer>
//{value => <Label>{value.searchInputText}</Label>}
//</UserContext.Consumer> 
