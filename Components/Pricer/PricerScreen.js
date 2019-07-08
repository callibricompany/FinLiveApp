import React from 'react'
import { Modal, SafeAreaView, TouchableWithoutFeedback, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Platform } from 'react-native'
import { ListItem, List, Left, Body, Content, Title, Item, Right, Icon, Input, Button, Thumbnail } from 'native-base'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily } from '../../Styles/globalStyle'

import { SearchBarProvider } from '../SearchBar/searchBarAnimation';
import SearchBarPricer from './SearchBarPricer';

import { ifIphoneX, ifAndroid } from '../../Utils';

import { maturityToDate, calculateBestCoupon } from '../../Utils/math'
import FLPanel from '../commons/FLPanel'
import FLProductTicket from '../commons/FLProductTicket'

import SwipeGesture from '../../Gesture/SwipeGesture'


import { FLSlider } from '../../Components/commons/FLSlider'
import { FLSlider2 } from '../../Components/commons/FLSlider2'


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
import helpImage from '../../assets/help.png'
import calculateImage from '../../assets/calculate.png'
import productTicketImage from '../../assets/productTicket.jpg'
import FontAwesomeI from 'react-native-vector-icons/FontAwesome'



import UNDERLYINGS from '../../Data/subCategories.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'
import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'

import Dimensions from 'Dimensions';

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
    this.state = {
      index: 0,
      currentTab: 'tabPricerBests',
      routes: [
        { key: 'tabPricerBests', title: 'Les meilleurs' },
        { key: 'tabPricer', title: 'Sur-mesure' },
        { key: 'tabParameter', title: 'Paramètres' }
      ],


      expertMode: false,
      isLoadingBestProduct: true,
      isLoadingTheBestProduct: true,
      showModalOptions: false,
      isExpertPricable: false,
      activeOptionsSlide: 0,
      isRecalculationNeeded: false,
      product: {
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


      },
    }

    this.allPricesDF;
    this.underlyingsList = [];
    this.structuredProductsList = [];
    this.bestProducts = [];
    this.theBestProduct = [];

    this.desactivatedParameters = [];
    this.desactivatedParameterSelected = {};

  }


  static navigationOptions = {
    header: null
  }

  //affichage de l'en-tete de la page
  _renderHeader = () => props => (
    <View style={{
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 1,
      ...ifIphoneX({
        top: 0
      }, {
        top: STATUSBAR_HEIGHT
      }),
      //backgroundColor: 'red',
    }}>
        <TabBar
          getLabelText={this._getLabelText}
          indicatorStyle={{ backgroundColor: backgdColor, height: 35 }}
          style={{ backgroundColor: tabBackgroundColor, elevation: 0, height: 35 }}
          labelStyle={{ flexWrap: "wrap",fontFamily: FLFontFamily, margin: 0, marginTop: 0, marginBottom: 0, fontWeight: '200', height: 35 }}
          //labelStyle={{ color:  'black', margin: 0, marginTop: 0, marginBottom: 0, fontWeight: '200', height: 35 }}
          activeColor={tabBackgroundColor}
          inactiveColor={backgdColor}
          {...props}
        />
    </View>
  );

  _renderScene = ({ route, jumpTo }) => {

    switch (route.key) {
      case 'tabPricerBests':
        //return <TabHome  route={route} jumpTo={jumpTo} />;
        return <View style={{ flex: 1, borderWidth:4 }}><Text>Meilleurs prix</Text></View>
      case 'tabPricer':
        return <View><Text>Evaluer</Text></View>
      case 'tabParameter':
        return <View><Text>Evaluer</Text></View>
        
      default:
        return null;
    }
  };

  _handleIndexChange = index => {
    this.setState({
      currentTab: this.state.routes[index].key,
      index
    });
  }
  _getLabelText = ({ route }) => route.title.toUpperCase();



  render() {
    return (
      <SafeAreaView style={{ backgroundColor: tabBackgroundColor }}>

            <View style={{height: DEVICE_HEIGHT-250}}>
 
              <TabView
                style={[globalStyle.bgColor, { flex: 1, borderWidth:10 }]}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderTabBar={this._renderHeader()}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
                swipeEnabled={true} 
                useNativeDriver
              />

       
            </View>



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
