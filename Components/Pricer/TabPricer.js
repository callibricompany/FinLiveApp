import React from 'react';
import { View, ScrollView, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Platform, Switch} from 'react-native'; 

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { FLScrollView } from '../SearchBar/searchBarAnimation';
import FLBottomPanel from '../commons/FLBottomPanel'

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import { withNavigation } from 'react-navigation';
import { withAuthorization } from '../../Session';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import SwitchSelector from "react-native-switch-selector";

import Moment from 'moment';
import localization from 'moment/locale/fr'

import botImage from '../../assets/bot.png'

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Dimensions from 'Dimensions';

import {  globalSyle, 
  backgdColor,
  setFont, 
  blueFLColor,
  setColor,
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
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json';

import * as TICKET_TYPE from '../../constants/template'
import { isNull } from 'util';


import Carousel from 'react-native-snap-carousel';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabPricer extends React.PureComponent {
  
    constructor(props) {
      super(props);

      //current product parameter used for bootom panel
      this.currentParameters = 'typeAuction';
      this.product = this.props.product;


      let productSelected = STRUCTUREDPRODUCTS.filter(({id}) => id === this.product['type'].value)[0];
      this.state = {
        toto : true,
        needToRefresh : !this.props.isGoodToShow,
        
        currentProductIndex : STRUCTUREDPRODUCTS.indexOf(productSelected),

        //position du bottomPanel
        bottomPanelPosition : SNAP_POINTS_FROM_TOP[2],
      };


      //console.log("0 : " + SNAP_POINTS_FROM_TOP[0]);
      //console.log("1 : " + SNAP_POINTS_FROM_TOP[1]);
      //console.log("2 : " + SNAP_POINTS_FROM_TOP[2]);

      //recuperation de la liste des sous-jacents
      this.underlyings = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
      
      
      //mise en place des carrés
      this.dataSource = Array(7).fill().map((_, index) => ({id: index}));
    }
  
    //on recoit les props a nouveau
    componentWillReceiveProps (props) {
      //console.log("PROPS RECEIVED");
      this.product = props.product;

      this.setState({ needToRefresh : !props.isGoodToShow});
      //pour rafraichir l'affichage
      this.setState({toto : !this.state.toto})
    }


    _updateValue=(id, value, valueLabel) =>{
        console.log(id + "  :  "+value+"  :  "+valueLabel);
        this.product[id].value = value;
        this.product[id].valueLabel = valueLabel;
        //patch is Incremental bijectif avec is Memory
        if (id === 'isIncremental') {
          this.product['isMemory'].value = value;
          this.product['isMemory'].valueLabel = value ? 'Effet mémoire' : 'Non mémoire';
        }


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


    _displayProductList = ({ item }) => {
	    return (
              <View style={{ justifyContent : 'center', alignItems: 'center', borderWidth:0}}>
	              <Text numberOfLines={2} style={[setFont('400', 16, item.isLocked ? 'gray' : 'black'), {textAlign: 'center', textAlignVertical: 'center'}]}>{item.name}</Text>
	           </View>
	    )
	  }
    _renderFLBottomPanel=() => {
      switch (this.currentParameters) {
        case 'typeAuction' : return  <FLAuctionDetail updateValue={this._updateValue} initialValue={this.product['typeAuction'].value}/>
        case 'type' : return  <FLProductDetail updateValue={this._updateValue} initialValue={this.product['type'].value}/>
        case 'underlying' : return  <FLUnderlyingDetail underlyings={this.underlyings} updateValue={this._updateValue} initialValue={this.product['underlying'].value}/>
        case 'maturity' : return  <FLMaturityDetail updateValue={this._updateValue} initialValue={this.product['maturity'].value}/>
        case 'barrierPDI' : return  <FLPDIDetail updateValue={this._updateValue} initialValue={this.product['barrierPDI'].value}/>
        case 'barrierPhoenix' : return  <FLPhoenixBarrierDetail updateValue={this._updateValue} initialValueBP={this.product['barrierPhoenix'].value} initialValueIM={this.product['isMemory'].value}/>
        case 'freq' : return  <FLFreqDetail updateValue={this._updateValue} initialValueFreq={this.product['freq'].value} initialValueNNCP={this.product['nncp'].value}/>
        case 'airbagLevel' : return  <FLAirbagDetail updateValue={this._updateValue} initialValueAB={this.product['airbagLevel'].value} initialValueDS={this.product['degressiveStep'].value} initialValueII={this.product['isIncremental'].value}/>
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
      if (this.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated) {
        if (PARAMETERSSTRUCTUREDPRODUCT[id].name === 'freq' ) {
            let nncp = this.product['nncp'].valueLabel
            valueLabel = valueLabel + '\n\n1er rappel : ' + nncp;
        } else if (PARAMETERSSTRUCTUREDPRODUCT[id].name === 'airbagLevel' ) {
          let ii = this.product['isIncremental'].valueLabel;
          let ds = this.product['degressiveStep'].valueLabel;
          valueLabel = valueLabel + '\n'+ ii  + '\n'+ ds;
        } else if (PARAMETERSSTRUCTUREDPRODUCT[id].name === 'barrierPhoenix' ) {
          let im = this.product['isMemory'].valueLabel;
          valueLabel = valueLabel + '\n'+ im;
        }
        
      }
      let isActivated = this.props.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isActivated;
      let isMandatory = this.props.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isMandatory;
      let isLocked = this.props.product[PARAMETERSSTRUCTUREDPRODUCT[id].name].isLocked; 

      return (
        <View style={{flexDirection: 'column',
                      height: (DEVICE_WIDTH*0.925-20)/3 +hShift, 
                      width: (DEVICE_WIDTH*0.925-20)/3, 
                      marginLeft : id % 3 === 0 ? 0 : 5,  
                      marginRight : (id -2) % 3 === 0 ? 0 : 5, 
                      marginBottom: 5, marginTop : marginShift,
                      backgroundColor: isLocked ? 'pink' : isMandatory ? 'white' : isActivated ? 'white' : setColor('gray'),
                      borderRadius : 4
                    }}
        >

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
            style={{flexDirection: 'column', height: hShift + 2*(DEVICE_WIDTH*0.925-20)/3/3, borderWidth: 0, paddingTop: 2, justifyContent: 'space-between', alignItems: 'center',flexGrow: 1}}
          >
            <View style={{flexDirection : 'row'}}>
                <View style={{flex: 0.6, justifyContent : 'center', alignItems: 'center'}}>
                    <MaterialCommunityIconsIcon name={PARAMETERSSTRUCTUREDPRODUCT[id].icon}  size={30} style={{color: isActivated ? 'black' : setColor('light')}}/> 
                </View>
                <View style={{flex: 0.4, justifyContent : "flex-start", alignItems: 'flex-end', paddingRight: 8, borderWidth: 0}}>
                  <Ionicons name={'ios-more'}  size={14} style={{color: setColor('light')}}/>
                </View>
            </View>
            <View style={{flex: 1, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={[setFont('300', 12), {textAlign: 'left'}]}>
                  {valueLabel}
                </Text>
            </View>
          {/*PARAMETERSSTRUCTUREDPRODUCT[id].name === 'barrierPDI'? <Text style={[setFont('300', 10, 'white'), {marginTop: 25, textAlign: 'center'}]}>Barrière européenne</Text> : null*/}
          </TouchableOpacity>
          <View style={{height: 35, borderTopWidth : 1, borderTopColor : setColor('gray'), padding: 2, justifyContent: 'center', alignItems: 'center'}}>
             <Text style={[setFont('300', 12, ), {textAlign: 'center'}]}>
                {PARAMETERSSTRUCTUREDPRODUCT[id].title.toUpperCase()}
             </Text>
          </View>
        </View>
      );
    }


    render() {
      
      return (
         <ScrollView contentContainerStyle={{justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: 20}}> 
                <FlatList
                  contentContainerStyle={{flex: 1}}
                  data={this.dataSource}
                  //renderItem={this._renderRow}
                  keyExtractor={(item) => item.id.toString()}
                  
                  numColumns={3}
                  renderItem={({item}) => (
                    this._renderParameter(item)    
            
                  )}
                />
               <FLBottomPanel position={this.state.bottomPanelPosition} 
                              snapChange={this._snapChange} 
                              renderFLBottomPanel={this._renderFLBottomPanel()} 
                              renderTitle={this.product[this.currentParameters].title}
                              activateParameter={this._activateParameter}
                              isActivated={this.product[this.currentParameters].isActivated}
                />
             
          </ScrollView>

      );
    }
  }

const condition = authUser => !!authUser;

const composedWithNav = compose(
    withAuthorization(condition),
     withNavigation,
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabPricer);

/*

               <View style={{width: DEVICE_WIDTH*0.95}}>
                      <SwitchSelector
                        initial={0}
                        onPress={obj => {
                          
                          this._updateValue("typeAuction", obj.value, obj.label);
                          //this.setState({ gender: value });
                        }}
                        textColor={blueFLColor} 
                        selectedColor={'white'}
                        buttonColor={blueFLColor}
                        borderColor={blueFLColor}
                        returnObject={true}
                        hasPadding
                        options={[
                          { label: "Placement Privé", value: "PP" , customIcon: <Ionicons name="ios-contact" style={{paddingRight: 5, color : this.props.product['typeAuction'].value === 'PP' ? 'white' : blueFLColor}} size={20} />}, 
                          { label: "Appel public à l'épargne", value: "APE", customIcon: <Ionicons name="ios-contacts" style={{paddingRight: 5, color :  this.props.product['typeAuction'].value === 'APE' ? 'white' : blueFLColor}} size={20} />} 
                        ]}
                      />
                  </View>
                  <View style={{ height : 80, alignItems:'center', justifyContent:'center', marginTop: 10, marginBottom : 10}}>
                        <Ionicons name="md-arrow-dropdown"  size={20} style={{color : blueFLColor}}/>
                        <Carousel
                            ref={'carousel'}
                            data={STRUCTUREDPRODUCTS}
                            renderItem={this._displayProductList.bind(this)}
                            sliderWidth={0.85*DEVICE_WIDTH*0.95}
                            itemWidth={0.8*DEVICE_WIDTH/3}
                            //itemHeight={400}
                            //sliderHeight={120}
                            //slideStyle={{backgroundColor: 'pink', height : 100, borderWidth: 2}}
                            //containerCustomStyle={{ backgroundColor : 'green', justifyContent: 'center'}}
                            //contentContainerCustomStyle={{ backgroundColor : 'red'}}
                            firstItem={this.state.currentProductIndex}
                            onSnapToItem={(currentProductIndex) => {
                              //console.log(STRUCTUREDPRODUCTS[this.state.currentProductIndex]);
                              if (!STRUCTUREDPRODUCTS[currentProductIndex].isLocked) {
                                this.setState({ currentProductIndex }, () => this._updateValue("type", STRUCTUREDPRODUCTS[this.state.currentProductIndex].id,STRUCTUREDPRODUCTS[this.state.currentProductIndex].name))
                              } else {
                                this.refs['carousel'].snapToItem(this.state.currentProductIndex);
                              }
                            }}
                        />
                        <Ionicons name="md-arrow-dropup"  size={20} style={{color : blueFLColor}}/>
                  </View>

              */