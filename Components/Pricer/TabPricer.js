import React from 'react';
import { View, ScrollView, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Platform, Switch} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { FLScrollView } from '../SearchBar/searchBarAnimation';
import FLBottomPanel from '../commons/FLBottomPanel'

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import botImage from '../../assets/bot.png'

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Dimensions from 'Dimensions';

import {  globalSyle, 
  generalFontColor, 
  tabBackgroundColor,
  headerTabColor,
  selectElementTab,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';


import UNDERLYINGS from '../../Data/subCategories.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'
import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'

import * as TICKET_TYPE from '../../constants/ticket'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabPricer extends React.PureComponent {
  
    constructor(props) {
      super(props);

      this.state = {
        toto : true,
      };
      //current product parameter used for bootom panel
      this.currentParameters = 'help';
      this.product = this.props.product;

      this.dataSource = Array(10).fill().map((_, index) => ({id: index}));
    }
  
    //on recoit les props a nouveau
    componentWillReceiveProps (props) {
      //console.log("PROPS RECEIVED");
      this.product = props.product;
      
      //pour rafraichir l'affichage
      this.setState({toto : !this.state.toto})
    }

    _renderFLBottomPanel=() => {
      return (
        <ScrollView>
          <Text>TOTO</Text>
        </ScrollView>
      );
    }

    _renderParameter = ({ item , id}) => {
      //console.log("item : " +id)
      let col1 = id % 3 === 0 ? '1er col' : (id-2) % 3 === 0 ? '3eme col' : '';
      
      let title = '';
      let value = '';
      let help = '';
      let isActivated = false;
      switch (id) {
          case 0 : 

            break;
          default : break;
      }
      return (
        <View style={{flexDirection: 'column',height: (DEVICE_WIDTH*0.925-20)/3, width: (DEVICE_WIDTH*0.925-20)/3, marginLeft : id % 3 === 0 ? 0 : 5,  marginRight : (id -2) % 3 === 0 ? 0 : 5, marginBottom: 5, marginTop : 5,
                      backgroundColor: this.props.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated ? tabBackgroundColor : 'lightsteelblue'
                    }}
        >
          <View style={{flex: 0.3, borderWidth: 0, padding: 3, justifyContent: 'flex-start', alignItems: 'center',flexGrow: 1}}>
             <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 12, color: 'white', textAlign: 'center'}}>
                {PARAMETERSSTRUCTUREDPRODUCT[id].title.toUpperCase()}
             </Text>
          </View>
          <TouchableOpacity onPress={() => {
              
              isActivated = this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated;
              this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated = !isActivated;
              this.props.parameterProductUpdated(this.product);
              console.log("hghghghg : " + isActivated);
            }} 
            style={{flex: 0.5, borderWidth: 1, paddingTop: 1, justifyContent: 'flex-start', alignItems: 'center',flexGrow: 1}}
          >
             <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 14, color: 'white', textAlign: 'center'}}>
              {this.props.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].valueLabel}
            </Text>
          </TouchableOpacity>
          <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-start', alignItems: 'center',flexGrow: 1}}>
             <View style={{flex : 0.35, justifyContent: 'center', alignItems: 'center'}}>
                  <Ionicons name="md-options" size={20} color='white'/>
             </View>
             <View style={{flex : 0.65, justifyContent: 'flex-start', alignItems: 'center'}}>
               <Switch style={{ transform: [{ scaleX: 0.7 }, { scaleY: .7 }] }} />
             </View>
          </View>
        </View>
      );
    }

    render() {
      //console.log("RENDER TAB PRICER");
      return (
  /*        <FLScrollView 
          contentContainerStyle={{justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: Platform.OS === 'ios' ? -60+35 : -25+35 }}
                tabRoute={this.props.route.key}
          > */
          <View style={{flex: 1, flexDirection: 'column',justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: Platform.OS === 'ios' ? 100 : 100+35 }}>
           
              <View style={{borderWidth: 0, flexDirection: 'row',  width : DEVICE_WIDTH*0.925, marginTop: 10, alignSelf: 'center'}}>
                <View style={{flex:0.6, borderWidth: 0, height: 35, justifyContent:'center', alignItems:'flex-start'}}>
                  <View>
                    <Text style={{fontFamily: FLFontFamily, fontWeight: '500', fontSize: 16}}>
                      {String("Produit structuré").toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={{flex:0.15, borderWidth: 0, height: 35, justifyContent:'center', alignItems:'center'}}>
                  <View>
                     <Image style={{width: 25, height: 25}} source={botImage} />
                  </View>
                </View>    
                <View style={{flex:0.25, justifyContent:'center', alignItems:'center'}}>
                  <View>
                    <Button style={{borderRadius : 4, height: 35,  backgroundColor: subscribeColor}}
                            onPress={() => {
                                this.props.launchPricing('toto');
                            }}
                    >
                      <Text style={{paddingLeft: 3, paddingRight: 3, fontFamily: FLFontFamily, fontWeight: '300', fontSize: 12, color: 'white'}}>
                        CHERCHER
                      </Text>
                    </Button>
                  </View>
                </View>            
              </View>

              <ScrollView style={{marginTop: 10, marginBottom: Platform.OS === 'ios' ? 10 : 10 , borderWidth: 0}}>
                  <FlatList
                    contentContainerStyle={{}}
                    data={this.dataSource}
                    //renderItem={this._renderRow}
                    keyExtractor={(item) => item.id.toString()}
                    //tabRoute={this.props.route.key}
                    numColumns={3}
                    renderItem={({item}) => (
                      this._renderParameter(item)    
              
                    )}
                  />
              <View style={{flex : 1, height: 150, backgroundColor: 'green'}}>
              </View>
              </ScrollView>

               <FLBottomPanel renderFLBottomPanel={this._renderFLBottomPanel()}/>
              
          </View>

      );
    }
  }


const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabPricer);

