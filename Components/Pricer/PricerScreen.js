import React from 'react'
import { Modal, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Platform } from 'react-native'
import { ListItem, List, Left, Body, Content, Title, Item, Right, Icon, Input, Button, Thumbnail } from 'native-base'
import { TabView, TabBar, SceneMap, PagerScroll } from 'react-native-tab-view';

import AnimatedProgressWheel from 'react-native-progress-wheel';

import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily, subscribeColor, setFont, headerTabColor } from '../../Styles/globalStyle'

import { SearchBarProvider } from '../SearchBar/searchBarAnimation';
import SearchBarPricer from './SearchBarPricer';

import { ifIphoneX, ifAndroid } from '../../Utils';
import { interpolateBestProducts } from '../../Utils/interpolatePrices';

import SwipeGesture from '../../Gesture/SwipeGesture';
import { CPSRequest } from '../../Classes/Products/CPSRequest';

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

import Dimensions from 'Dimensions';


import PRICES from '../../Data/20190517.json';
import FREQUENCYLIST from '../../Data/frequencyList.json'

const Spline = require('cubic-spline');
var polynomial = require('everpolate').polynomial;
var interpolator = require('../../Utils/spline.js');

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
    this.initialMessageLoading = 'Interrogation du marché...';
    this.state = {
      isLoading: false,
      index: 0,
      currentTab: 'tabPricerParameters',
      routes: [
        { key: 'tabPricerParameters', title: 'Sur-mesure' },
        { key: 'tabPricerResults', title: 'Propositions' },
        { key: 'tabPricerUF', title: 'Par' }
      ],
      messageLoading : this.initialMessageLoading,

      //les prix ne sont plus bons : un parametre au moins a été touché
      needToRefresh: false,
    }



   

    this.request = new CPSRequest();
    //console.log(this.request.getProduct());


    //this.parameterProductUpdated(this.product);
    this.bestProducts = [];
  }


  static navigationOptions = {
    header: null
  }

  //au chargemnt de la page recupération des meilleurs resultats
  async componentDidMount() {

   // this.calculateProducts();
   this.needToRefresh();

  }


  async calculateProducts() {

    this.state.isLoading === false ? this.setState({ isLoading: true }) : null;
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
      this.setState({ isLoading: false });
    
    })
    .catch(error => {
      console.log("ERREUR recup prix: " + error);
      alert('ERREUR calcul des prix', '' + error);
      this.setState({ isLoading : false , messageLoading : ''});
    });


    //});
  }


  //parameter du produit changé et donc updaté
  parameterProductUpdated = (productParameters) => {
    //console.log(productParameters);
    this.request.updateProduct(productParameters);
    this.request.refreshFields();

    //this.needToRefresh();
    //pour rafraichir l'affichage
    //this.setState({toto : !this.state.toto})
  }

  //demande le calcul au serveur et affichage des résultats 
  launchPricing = () => {
    //console.log("CA AKHZAHZJAHZJAHZ " + productParameters);

    //changement d'onglet si necessaire
    if (this.state.currentTab !== 'tabPricerResults') {
      this._handleIndexChange(1);
    }
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



  _getLabelText = ({ route }) => route.title.toUpperCase();

  //affichage de l'en-tete de la page
  _renderHeader2 = () => props => (
    <TabBar
      onTabPress={({ route }) => {
        console.log("ROUTE : " + JSON.stringify(route));
      }
      }

      getLabelText={this._getLabelText}

      //indicatorStyle={{backgroundColor: backgdColor, height: 45, width: this.state.currentTab === 'tabPricerUF' ? 50 : (DEVICE_WIDTH -50)/2 , borderWidth: 1}}
      //style={{zIndex: 1, 'pink': tabBackgroundColor, elevation: 0, height: 45 , justifyContent: 'center'}}
      style={{ height: 0 }}
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
        return <TabResults route={route} jumpTo={jumpTo} products={this.bestProducts} isGoodToShow={!this.state.needToRefresh} />;
      case 'tabPricerParameters':
        return <TabPricer route={route} jumpTo={jumpTo} launchPricing={this.launchPricing} product={this.request.getProduct()} needToRefresh={this.needToRefresh} isGoodToShow={!this.state.needToRefresh}  parameterProductUpdated={this.parameterProductUpdated} />;
      //return <View style={{ flex: 1, borderWidth:4 }}><Text>Meilleurs prix</Text></View>
      case 'tabPricerUF':
        return <TabUF route={route} jumpTo={jumpTo} launchPricing={this.launchPricing} needToRefresh={this.needToRefresh} isGoodToShow={!this.state.needToRefresh} updateUF={this.updateUF} product={this.request.getProduct()}/>;
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
    var render = <View style={{

      width: DEVICE_WIDTH,
      height: DEVICE_HEIGHT,
      flexDirection: 'column'
    }}>
      <View style={{ flexDirection: 'row', height: 37, width: DEVICE_WIDTH, borderBottomWidth: 4, borderBottomColor: backgdColor }}>
        <TouchableOpacity style={[tabStyle(this.state.index === 0), { width: (DEVICE_WIDTH - 50) / 2 }]}
          onPress={() => this._handleIndexChange(0)}>
          <Text style={[texTabStyle(this.state.index === 0)]}>
            Structuration
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tabStyle(this.state.index === 1), { width: (DEVICE_WIDTH - 50) / 2 }]}
          onPress={() => this._handleIndexChange(1)}>
          <Text style={[texTabStyle(this.state.index === 1)]}>
            Propositions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tabStyle(this.state.index === 2), { width: 50 }]}
          onPress={() => this._handleIndexChange(2)}>
          <Icon name='ios-settings' size={20} style={{ color: this.state.index === 2 ? tabBackgroundColor : backgdColor }} />
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: backgdColor, height: 10 }}>
      </View>
      <TabView
        style={globalStyle.bgColor}
        navigationState={this.state}
        /*navigationState={{index: this.state.index,   
          routes: [
            { key: 'tabPricerResults', title: 'Résultats' },
            { key: 'tabPricerParameters', title: 'Sur-mesure' },
            { key: 'tabPricerUF', title: 'Paramètres' }
          ],
        }}*/

        renderScene={this._renderScene}
        renderPager={(props) => <PagerScroll {...props} />}
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
      render = 
      <View style={{width :DEVICE_WIDTH, height: DEVICE_HEIGHT, justifyContent: 'center', alignItems: 'center'}}>
        <AnimatedProgressWheel 
            size={120} 
            width={10} 

            //progress={45}
            //backgroundColor={'orange'}
            progress={100}
            animateFromValue={0}
            duration={5000}
            color={'white'}
            fullColor={headerTabColor}
        />
        <View style={{marginTop: 20}}>
          <Text style={setFont('300', 14, 'white')}>{this.state.messageLoading}</Text>
        </View>
      </View>
   /*   <View style={globalStyle.loading}>
        <ActivityIndicator size='large' />
        <View style={{ position: 'absolute', top: 2 * DEVICE_HEIGHT / 3,top: DEVICE_HEIGHT/5,left : 0, width: DEVICE_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{this.state.messageLoading}</Text>
        </View>
      </View>   */
    }

    return (
      <SafeAreaView style={{ backgroundColor: tabBackgroundColor }}>
        {render}
      </SafeAreaView>
    );
  }
}


function tabStyle(focused) {
  return {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: focused ? backgdColor : tabBackgroundColor,
  }
};

function texTabStyle(focused) {
  return {
    flexWrap: "nowrap",
    fontFamily: FLFontFamily,
    margin: 0,
    fontWeight: '400',
    fontSize: 16,
    color: focused ? tabBackgroundColor : backgdColor,
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
