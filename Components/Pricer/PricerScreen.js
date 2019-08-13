import React from 'react'
import { Modal, SafeAreaView, TouchableWithoutFeedback, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Platform } from 'react-native'
import { ListItem, List, Left, Body, Content, Title, Item, Right, Icon, Input, Button, Thumbnail } from 'native-base'
import { TabView, TabBar, SceneMap, PagerScroll} from 'react-native-tab-view';


import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily } from '../../Styles/globalStyle'

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


import UNDERLYINGS from '../../Data/subCategories.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'
import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'

import Dimensions from 'Dimensions';


import PRICES from '../../Data/20190517.json';



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
    console.log("WIDTH : " +DEVICE_WIDTH);
    this.state = {
      index: 0,
      currentTab: 'tabPricerResults',
      routes: [
        { key: 'tabPricerResults', title: 'Résultats' },
        { key: 'tabPricerParameters', title: 'Sur-mesure' },
        { key: 'tabPricerUF', title: 'Par' }
      ],
      toto : true,

       //les prix ne sont plus bons : un parametre au moins a été touché
       needToRefresh : false,
    }


   
    this.product = {
      'type': {
        'value': 'classicAutocall',
        'valueLabel': 'Autocall',
        'isActivated': false,
        'icon': 'TP'
      },
      'nominal': {
        'value': 100000,
        'isActivated': true,
        'icon': 'N'
      },
      'currency': {
        'value': 'EUR',
        'isActivated': true,
        'icon': 'T'
      },
      'UF': {
        'value': 0.02,
        'isActivated': true,
        'icon': 'UF'
      },
      'UFAssoc': {
        'value': 0.002,
        'isActivated': true,
        'icon': 'UF'
      },
      'underlying': {
        'value': 'CAC',
        'valueLabel': 'CAC 40',
        'isActivated': false,
        'icon': 'SJ'
      },
      'maturity': {
        'valueMin': 6,
        'valueMax': 10,
        'value': '',
        'valueLabel': '6 à 10 ans',
        'isActivated': true,
        'icon': 'M'
      },
      'barrierPDI': {
        'value': 0.3,
        'isActivated': false,
        'valueLabel': Numeral(0.3).format('0.00 %'),
        'icon': 'PDI'
      },
      'typePDI': {
        'value': 'EU',
        'isActivated': false,
        'valueLabel': 'Européen',
        'icon': 'PDI'
      },
      'freqAutocall': {
        'value': 0.5,
        'isActivated': false,
        'icon': 'FA'
      },
      'degressiveStep': {
        'value': 0.5,
        'isActivated': false,
        'icon': 'DS'
      },
      'airbagLevel': {
        'value': 0.5,
        'isActivated': false,
        'icon': 'EA'
      },
      'barrierPhoenix': {
        'value': 0.5,
        'isActivated': false,
        'icon': 'BP'
      },
      'freqPhoenix': {
        'value': 0.5,
        'isActivated': false,
        'icon': 'FP'
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
    this.setState({ isLoading : true });
    //chargement des meilleurs prix
    let allPricesDF = dataForge.fromJSON(JSON.stringify(PRICES));
    let underlyingsList = [];
    let structuredProductsList = [];
 
    //retrouve tous les sous jacents distincts
    const distinctUnderlyings = allPricesDF.getSeries('underlying').distinct();
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
     this.bestProducts = df.toArray();  
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
        this._handleIndexChange(0);
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

  //affichage de l'en-tete de la page
  _renderHeader = (animation, canJumpToTab) => props => (
      <SearchBarPricer
        animation={animation}
        //category={this.props.category}
        currentTab={this.state.currentTab}

        renderTabBar={() => (
                <TabBar
                  onTabPress={({route}) => {
                    //console.log("ROUTE : " + JSON.stringify(route));
                    if(route.key != this.state.currentTab && canJumpToTab) {
                      animation.onTabPress(route);
                    }
                  }}
                  getLabelText={this._getLabelText}
                  indicatorStyle={{ backgroundColor: backgdColor, height: 45 }}
                  style={{ zIndex: 1, backgroundColor: tabBackgroundColor, elevation: 0, height: 45 , justifyContent: 'center'}}
                  labelStyle={{flexWrap: "nowrap",fontFamily: FLFontFamily, margin: 0, fontWeight: '200'}}
                  //labelStyle={{ color:  'black', margin: 0, marginTop: 0, marginBottom: 0, fontWeight: '200', height: 35 }}
                  activeColor={tabBackgroundColor}
                  inactiveColor={backgdColor}
                  {...props}
                />
            )}
      />
  );

    _getLabelText = ({ route }) => route.title.toUpperCase();
    _getTabWidth = ({ route }) => {
      console.log(route.key);
      return {width: 90};//route.key === 'tabPricerUF' ? 50 : (DEVICE_WIDTH -50)/2 ;
    }
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
        return <TabPricer  route={route} jumpTo={jumpTo} launchPricing={this.launchPricing} product={this.product} parameterProductUpdated={this.parameterProductUpdated}/>;
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
    let render =    <SearchBarProvider currentTab={this.state.currentTab} adjustFullHeight={-20}>
                      {(animation, { canJumpToTab }) => 
                        <View style={initialLayout}>
                          {/*Platform.OS === 'android' && 
                            <StatusBar
                              translucent={false}
                              backgroundColor={'black'}
                              barStyle={'dark-content'}
                              animated={false}
                            />*/
                          }
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
                            renderTabBar={this._renderHeader(animation, canJumpToTab)}
                            onIndexChange={this._handleIndexChange}
                            initialLayout={initialLayout}
                            swipeEnabled={false} // TODO ...
                            //canJumpToTab={() => canJumpToTab}
                            useNativeDriver
                          />

                          
                        </View>
                      }
                    </SearchBarProvider>
                    

      let render2 =     <View style={{
                                    
                                    width: DEVICE_WIDTH,
                                    height: DEVICE_HEIGHT}}>
                          <View style={{flexDirection: 'row',height : 35, width: DEVICE_WIDTH, backgroundColor: 'pink'}}>
                            <TouchableOpacity style={{height : 35, width : (DEVICE_WIDTH - 50)/2, backgroundColor: 'purple'}}
                                              onPress={() => this._handleIndexChange(0)}>
                                              <Text>A</Text>

                            </TouchableOpacity>
                            <TouchableOpacity style={{height : 35, width : (DEVICE_WIDTH - 50)/2, backgroundColor: 'green'}}
                                              onPress={() => this._handleIndexChange(1)}>
                                              <Text>A</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{height : 35, width : 50, backgroundColor: 'blue'}}
                                               onPress={() => this._handleIndexChange(2)}>
                                              <Text>A</Text>
                            </TouchableOpacity>
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
          render2 = render;
        }
    return(
          <SafeAreaView style={{backgroundColor: tabBackgroundColor}}>
          {render2}
          </SafeAreaView>
    );
  }
}







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
