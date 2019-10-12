import React from 'react';
import { View, ScrollView, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Platform, Switch} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { FLScrollView } from '../SearchBar/searchBarAnimation';
import FLBottomPanel from '../commons/FLBottomPanel'

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
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

import { FLAuctionDetail } from './description/FLAuctionDetail';
import { FLProductDetail } from './description/FLProductDetail';
import { FLUnderlyingDetail } from './description/FLUnderlyingDetail';
import { FLMaturityDetail } from './description/FLMaturityDetail';
import { FLPDIDetail } from './description/FLPDIDetail';
import { FLFreqDetail } from './description/FLFreqDetail';
import { FLPhoenixBarrierDetail } from './description/FLPhoenixBarrierDetail';
import { FLAirbagDetail } from './description/FLAirbagDetail';
import { FLDegressiveDetail } from './description/FLDegressiveDetail';

import { SNAP_POINTS_FROM_TOP } from '../commons/FLBottomPanel';

import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'

import * as TICKET_TYPE from '../../constants/template'
import { isNull } from 'util';





const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabPricer extends React.PureComponent {
  
    constructor(props) {
      super(props);

      this.state = {
        toto : true,
        
        //position du bottomPanel
        bottomPanelPosition : SNAP_POINTS_FROM_TOP[2],
      };

      //current product parameter used for bootom panel
      this.currentParameters = 'typeAuction';
      this.product = this.props.product;

      //console.log("0 : " + SNAP_POINTS_FROM_TOP[0]);
      //console.log("1 : " + SNAP_POINTS_FROM_TOP[1]);
      //console.log("2 : " + SNAP_POINTS_FROM_TOP[2]);

      //recuperation de la liste des sous-jacents
      this.underlyings = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
      

      this.dataSource = Array(9).fill().map((_, index) => ({id: index}));
    }
  
    //on recoit les props a nouveau
    componentWillReceiveProps (props) {
      //console.log("PROPS RECEIVED");
      this.product = props.product;
      
      //pour rafraichir l'affichage
      this.setState({toto : !this.state.toto})
    }


    _updateValue=(id, value, valueLabel) =>{
        console.log(id + "  :  "+value+"  :  "+valueLabel);
        this.product[id].value = value;
        this.product[id].valueLabel = valueLabel;


        //mise a jour de produit dans pricerScreen
        this.props.parameterProductUpdated(this.product);
        
        /*if (Array.isArray(value)  &&  value.length === 0) {
          this._activateParameter(false);
        }*/

        //on indique qu'un refresh est necesssire
        this.props.needToRefresh();
    }

    _snapChange=(bottomPanelPosition) => {
      //console.log(bottomPanelPosition);
      this.setState({ bottomPanelPosition });
    }

    _activateParameter=(toActivate) => {
      this.product[this.currentParameters].isActivated = toActivate;

      //mise a jour de produit dans pricerScreen
      this.props.parameterProductUpdated(this.product);
      this.props.needToRefresh();
      //fermeture du panel
      //this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[2] });
    }

    _renderFLBottomPanel=() => {
      switch (this.currentParameters) {
        case 'typeAuction' : return  <FLAuctionDetail updateValue={this._updateValue} initialValue={this.product['typeAuction'].value}/>
        case 'type' : return  <FLProductDetail updateValue={this._updateValue} initialValue={this.product['type'].value}/>
        case 'underlying' : return  <FLUnderlyingDetail underlyings={this.underlyings} updateValue={this._updateValue} initialValue={this.product['underlying'].value}/>
        case 'maturity' : return  <FLMaturityDetail updateValue={this._updateValue} initialValue={this.product['maturity'].value}/>
        case 'barrierPDI' : return  <FLPDIDetail updateValue={this._updateValue} initialValue={this.product['barrierPDI'].value}/>
        case 'barrierPhoenix' : return  <FLPhoenixBarrierDetail updateValue={this._updateValue} initialValue={this.product['barrierPhoenix'].value}/>
        case 'freq' : return  <FLFreqDetail updateValue={this._updateValue} initialValue={this.product['freq'].value}/>
        case 'airbagLevel' : return  <FLAirbagDetail updateValue={this._updateValue} initialValue={this.product['airbagLevel'].value}/>
        case 'degressiveStep' : return  <FLDegressiveDetail updateValue={this._updateValue} initialValue={this.product['degressiveStep'].value}/>

        default : return  <View>
                            <Text style={{padding : 15, fontSize : 24, fontFamily : 'FLFontTitle'}}>F i n l i v e</Text>
                          </View>;
      }
    }

    _renderParameter = ({ item , id}) => {
      //console.log("item : " +id)
      let col1 = id % 3 === 0 ? '1er col' : (id-2) % 3 === 0 ? '3eme col' : '';

      //evalue le nombre de sous-jacents selectionné pour le pricing
      //pour calculer la hauteur de la tuile et decaler ainsi les autres 
      let nbUnderlyings = this.product['underlying'].value.length;
      let shift = 15 * Math.max(0, nbUnderlyings - 4)
      let hShift = id === 2 ?  shift : 0;
      let marginShift = (id > 2 && (id%3 === 0 || (id-1)%3 === 0)) ? -shift : 0;
      //console.log(col1 +" BN UNDERLYING : " + nbUnderlyings + "  margin : " + marginShift + "   id : "+id );

    
      let valueLabel = this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated ? this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].valueLabel : this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].defaultValueLabel;
  
      let isActivated = this.props.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated;
      let isMandatory = this.props.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isMandatory;
      let isLocked = this.props.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isLocked; 

      return (
        <View style={{flexDirection: 'column',height: (DEVICE_WIDTH*0.925-20)/3 +hShift, width: (DEVICE_WIDTH*0.925-20)/3, marginLeft : id % 3 === 0 ? 0 : 5,  marginRight : (id -2) % 3 === 0 ? 0 : 5, marginBottom: 5, marginTop : marginShift,
                      backgroundColor: isLocked ? 'pink' : isMandatory ? tabBackgroundColor : isActivated ? tabBackgroundColor : 'lightsteelblue'
                    }}
        >
          <View style={{height: 35, borderBottomWidth : 1, borderBottomColor : 'aliceblue', padding: 2, justifyContent: 'center', alignItems: 'center',flexGrow: 1}}>
             <Text style={{fontFamily: FLFontFamily, fontWeight: '600', fontSize: 12, color: 'white', textAlign: 'center'}}>
                {PARAMETERSSTRUCTUREDPRODUCT[id].title.toUpperCase()}
             </Text>
          </View>
          <TouchableOpacity onPress={() => {
              //on souleve ou abaisse le bottom panel si on e-active sinon on desactive le panneau
              //console.log("Current posiion : "+ this.state.bottomPanelPosition);
              if (!isLocked) {
                
              
                  if (isMandatory) {
                    this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[this.state.bottomPanelPosition === SNAP_POINTS_FROM_TOP[2] ? 1 : this.currentParameters === PARAMETERSSTRUCTUREDPRODUCT[id].name ? 2 : 1] });
                  } else {
                    if (this.state.bottomPanelPosition === SNAP_POINTS_FROM_TOP[2]) {
                      //le panel est en bas et on le remonte et on active le produit
                      this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[1] });
                      this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated  =true;
                    } else {
                      //le panel est deja remonte 
                      //on a appuye sur l'element en cours on cache le panel et on desactive
                      if (this.currentParameters === PARAMETERSSTRUCTUREDPRODUCT[id].name) {
                        this.setState({ bottomPanelPosition : SNAP_POINTS_FROM_TOP[2] });
                        //this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated = !isActivated;
                      } else {
                        this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated  =true;
                      }
                    }
                  }
      
                  //on indique quel est le parametre en cours
                  setTimeout(() => {
                    this.currentParameters = PARAMETERSSTRUCTUREDPRODUCT[id].name;
                    //forcage re-render pour bug
                    this.setState({ toto : !this.state.toto })
                  }, 100);
                  

                  //mise a jour de produit dans pricerScreen
                  this.props.parameterProductUpdated(this.product);

                  //on indique qu'un refresh est necesssire
                  //this.props.needToRefresh();
              }
            }} 
            style={{height: hShift + 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 7, justifyContent: 'flex-start', alignItems: 'center',flexGrow: 1}}
          >
             <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 12, color: 'white', textAlign: 'center'}}>
              {valueLabel}
            </Text>
            {PARAMETERSSTRUCTUREDPRODUCT[id].name === 'barrierPDI'? <Text style={{marginTop: 25, fontFamily: FLFontFamily, fontWeight: '300', fontSize: 10, color: 'midnightblue', textAlign: 'center'}}>Barrière européenne</Text> : null}
          </TouchableOpacity>
          
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
          <View style={{flex: 1, flexDirection: 'column',justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: 0 }}>
           
       
              <View style={{marginTop: 10, marginBottom: Platform.OS === 'ios' ? 10 : 10 , borderWidth: 0}}>
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
              <View style={{flex : 1, height: 150}}>
                
              </View>
              </View>

               <FLBottomPanel position={this.state.bottomPanelPosition} 
                              snapChange={this._snapChange} 
                              renderFLBottomPanel={this._renderFLBottomPanel()} 
                              renderTitle={this.product[this.currentParameters].title}
                              activateParameter={this._activateParameter}
                              isActivated={this.product[this.currentParameters].isActivated}
                />
             
          </View>

      );
    }
  }


const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabPricer);

