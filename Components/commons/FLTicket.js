import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';

import {  globalSyle, 
    generalFontColor, 
    tabBackgroundColor,
    headerTabColor,
    selectElementTab,
    progressBarColor,
    subscribeColor,
    FLFontFamily,
    FLFontFamilyBold
 } from '../../Styles/globalStyle'

import Dimensions from 'Dimensions';
import Numeral from 'numeral'
import 'numeral/locales/fr'

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import * as TICKET_TYPE from '../../constants/ticket'

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import fullStarImage from '../../assets/star.png'
import emptyStarImage from '../../assets/emptystar.png'
import couponProtectionImage from '../../assets/couponPhoenix.png'
import pdiImage from '../../assets/parapluie.png'
import podiumImage from '../../assets/podium.png'


import UNDERLYINGS from '../../Data/subCategories.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'
import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class FLTicket extends React.Component {


  constructor(props) {
    super(props);

    this.state = {

      isGoodToShow : typeof this.props.isGoodToShow !== 'undefined' ? this.props.isGoodToShow : true,
    }

    //console.log(this.props.item);

  }

  componentWillReceiveProps (props) {
    //console.log("Prop received in FLTicket : " + props.isGoodToShow);
    typeof props.isGoodToShow !== 'undefined' ? this.setState({ isGoodToShow : props.isGoodToShow }) : null;
  }

    //determine le nom du produit
  _getProductTypeName(item) {
    
      let name = 'Autocall';

      if (typeof item !== 'undefined') {
         let product = STRUCTUREDPRODUCTS.filter(({id}) => id === item.product);
         name = product[0].name;
      }

      return name;
  }

    //determine le nom du sous
  _getUnderlyingName(item) {
      let name = 'CAC 40';

      if (typeof item !== 'undefined') {
          let underlying = UNDERLYINGS.filter(({ticker}) => ticker === item.underlying);
          name = underlying[0].name;
      }

      return name;
  }

    //renvoie la maturité 
  _getMaturityName(item) {
      let name = '8 ans';

      if (typeof item !== 'undefined') {
        let ans = " ans";
        if (item.maturity <= 1) {
          ans = " an";
        } 
        name = item.maturity.substring(0,item.maturity.length-1) + ans;
        
      }

      return name;
  }

  //determine le type d'action a realiser en fonction du type de ticket
  _getActionTitle(type) {
        let name = 'voir';
  
        if (type === TICKET_TYPE.BROADCAST) {
            name = 'souscrire';
        }
  
        return name;
  }


//renvoie la barriere PDI formatée
  _getBarrierPDITitle(item) {
      let name = '-50%';

      if (typeof item !== 'undefined') {
        name = Numeral(item.barrierPDI-1).format('0%');
        
      }

      return name;
  }


    //renvoie le type de protection 
    _getBarrierPDITypeTitle(item) {
      let name = 'Protection européenne';

      if (typeof item !== 'undefined') {
        if (item.isPDIUS) {
          name = 'Protection américaine';
        }
        
      }

      return name;
    }

    //renvoie la barriere PDI formatée
    _getBarrierPhoenixTitle(item) {
      let name = '-20%';

      if (typeof item !== 'undefined') {
        item.barrierPhoenix === 99.99 ? name = Numeral(item.levelAutocall-1).format('0%') 
                                      : name = Numeral(item.barrierPhoenix-1).format('0%');
        
      }

      return name;
    }

    //renvoie si airbag ou semi-airbag
    _getBarrierAirbagTitle (item) {
      let name = 'sans airbag';

      if (typeof item !== 'undefined') {
        if (item.airbagLevel !== 99.99) {
           let lastCouponBarrier = Math.min(item.levelAutocall, item.barrierPhoenix);
           if (item.barrierPDI === item.airbagLevel) {
             name = "airbag";
           } else if (item.airbagLevel > item.barrierPDI && lastCouponBarrier > item.airbagLevel) {
             name = "semi-airbag";
           }
        }
        
      }
      return name;
    }

    //renvoie la degressivite des niveaux de rappels
    _getDegressivityCallableTitle (item) {
      let name = '';

      if (typeof item !== 'undefined') {
        if (item.degressiveStep !== 0) {
          name = "Dégressuf de " + Numeral(item.degressiveStep).format('0%');
        }
        
      }
      return name;
    }
    //renvoie le coupon actualisé
    _getCouponTitle (item) {
      let name = '+5.5%';

      if (typeof item !== 'undefined') {
        name = "+" + Numeral(item.coupon).format('0%') 
        
      }
      return name;
    }

    //elebaore le titre du ticket
    _getTitle = (type, item) => {
      let organization = 'INSTITUT DU PATRIMOINE';
      let typePlacement = 'APE';
      let typeProduit = this._getProductTypeName(item).toUpperCase();
      let underlying = this._getUnderlyingName(item).toUpperCase();
      let maturite = this._getMaturityName(item).toUpperCase();

      let title1 =  <View style={{borderWidth:0,flex: 0.3, marginTop: Platform.OS === 'ios' ? 0 : -3, justifyContent: 'center', alignItems: 'flex-start', paddingTop: 4}}>
                      <Text style={{fontFamily:  FLFontFamily, fontWeight: '300', fontSize: 12, color: generalFontColor}}>
                       {organization} / {typePlacement}
                      </Text>
                    </View>
      let title2=   <View style={{borderWidth:0, flex: 0.6, marginTop: Platform.OS === 'ios' ? -2 : -5, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          {typeProduit} {underlying} {maturite}
                        </Text>
                    </View>
      

      //si on est en train de traiter le produit
      if (type === TICKET_TYPE.STURCTUREDPRODUCT_CREATION) {
        title1 =  <View style={{borderWidth:0,flex: 0.9, marginTop: Platform.OS === 'ios' ? 0 : -3, justifyContent: 'center', alignItems: 'flex-start', paddingTop: 8}}>
                     <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                       {typeProduit} {underlying} {maturite}
                    </Text>
                  </View>

        title2=<Text></Text>;
      }

      return (
        <View style={{flex : 0.70, paddingLeft: 5,flexDirection: 'column'}}>
            {title1}
            {title2}
        </View>
      );
    }


    //renvoie la degressivite des niveaux de rappels
    _getBroadcastTitle (type, item) {
      let name = type === TICKET_TYPE.BROADCAST ?
                              <View style={{flex: 0.2, borderWidth: 0,flexDirection: 'row', paddingBottom:10}}>
                                <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center', borderWidth:0  }}>
                                  <Image  style={{width: 30, height: 20}} source={podiumImage} />
                                </View>
                                <View style={{flex: 0.7, borderWidth: 0, justifyContent:'center', alignItems: 'center', paddingLeft : 3, paddingRight: 7}}>
                                  <View style={{position: 'absolute',  zIndex: 0}}>
                                    <Progress.Bar 
                                      progress={0.65} 
                                      width={DEVICE_WIDTH*0.7*0.95-10} 
                                      height={11}
                                      unfilledColor={'lightgray'}
                                      borderColor={'gray'}
                                      borderWidth={2}
                                      color={progressBarColor}
                                      borderRadius={10}
                                      />
                                    </View>
                                    <View style={{position: 'absolute', paddingLeft: 10,width: DEVICE_WIDTH*0.7*0.95-10, zIndex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                                      <Text style={{fontFamily : FLFontFamily, fontWeight:'400', fontSize: 10}}>
                                        65% collecté
                                      </Text>
                                    </View>
                                    <View style={{position: 'absolute', paddingRight: 10, width: DEVICE_WIDTH*0.7*0.95-10, zIndex: 2, justifyContent: 'center', alignItems: 'flex-end'}}>
                                      <Text style={{fontFamily : FLFontFamily, fontWeight:'400', fontSize: 10}}>
                                        {Moment("20190929").format('DD MMMM')}
                                      </Text>
                                    </View>
                                </View>
                                <View style={{flex: 0.1, justifyContent:'center', alignItems: 'center'}}>
                                  <Text style={{fontFamily : FLFontFamily, fontWeight:'300', fontSize: 12}}>
                                    2 M€
                                  </Text>
                                </View>
                              </View>
                      :
                      <View></View>

      return name;
    }


    render () {
        var item = this.props.item;
        var type = this.props.ticketType;

        
        
        let title = this._getTitle(type, item);
        let broadCast = this._getBroadcastTitle(type, item);
        return (
            <View opacity={this.state.isGoodToShow ? 1 : 0.1} style={[styles.item, {flexDirection : 'column', width: DEVICE_WIDTH*0.925, borderBottomWidth : 1}]}>
              <View style={{flex : 0.25, flexDirection : 'row', backgroundColor: tabBackgroundColor}}>
                  <View style={{flex : 0.10, justifyContent: 'center', alignItems: 'center', margin: 5}}>
                    <Image style={{width: 25, height: 25}} source={Math.random() < 0.5 ? fullStarImage : emptyStarImage} />
                  </View>
                  
                    {title}

                  <TouchableOpacity style={{flex: 0.35}} onPress={() => alert("J'EN VEUX PUTAIN DE MERDE")}>
                    <View style={{flex : 1, flexDirection: 'row', backgroundColor : subscribeColor,justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{flex:0.8, paddingLeft: 5, péddingRight: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: Platform.OS === 'ios' ? ifIphoneX() ?  14 : 12 : 14, color: generalFontColor}}>
                          {this._getActionTitle(type).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{flex:0.2, width:20, height:20, borderWidth:0, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          >
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
              </View>
              <View style={{flex : 0.75, flexDirection: 'column'}}>
                <View style={{flex: 0.6, flexDirection: 'row', marginTop:10, marginBottom: 15}}>
                  <View style={{flex: 0.4, flexDirection : 'column', borderWidth: 0}}>
                    <View style={{flex: 0.3, justifyContent: 'center', alignItems: 'center', margin:5}}>
                       <Text style={{fontFamily: FLFontFamily, fontWeight:'600', fontSize: 10, color: 'black'}}>
                          PROTECTION CAPITAL
                       </Text>         
                    </View>
                    <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center', padding:0}}>
    
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 16, color: 'red'}}>
                         {this._getBarrierPDITitle(item)}
                        </Text>
                      </View>
                    </View>
                    <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center', marginLeft:5}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight:'200', fontSize: 9,paddingTop:4}}>
                           {this._getBarrierPDITypeTitle(item)}
                        </Text>
                    </View>
                  </View>
                  <View style={{flex: 0.4, flexDirection : 'column', borderWidth: 0, justifyContent: 'center'}}>
                    <View style={{flex: 0.3, borderWidth: 0,justifyContent: 'flex-start', alignItems: 'flex-start', margin:5, marginLeft: 10}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight:'600', fontSize: 10, color: 'black'}}>
                            PROTECTION COUPON
                        </Text>         
                      </View>
                      <View style={{flex: 0.5, flexDirection: 'row',justifyContent: 'center', alignItems: 'center', padding:0}}>
                        <View style={{flex: 0.4, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 16}}>
                            {this. _getBarrierPhoenixTitle(item)}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                          <Text style={{fontFamily: FLFontFamily, fontWeight:'200', fontSize: 9}}>
                            {this._getBarrierAirbagTitle(item)}
                          </Text>
                        </View>
                      </View>
                      <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-start', marginLeft:10}}>
                          <Text style={{fontFamily: FLFontFamily, fontWeight:'200', fontSize: 9,paddingTop:4}}>
                            {this._getDegressivityCallableTitle(item)}
                          </Text>
                      </View>

                  </View>
                  <View style={{flex: 0.2, flexDirection : 'column', borderWidth: 0, justifyContent: 'center'}}>
                    <View style={{flex: 0.8, justifyContent: 'flex-end', alignItems: 'center'}}>
                      <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 20, color: 'limegreen'}}>
                        {this._getCouponTitle(item)}
                      </Text>
                    </View>
                    <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontFamily: FLFontFamily, fontWeight:'200', fontSize: 9}}>
                        équiv. annuel
                      </Text>
                    </View>

                  </View>
                </View>

                {this._getBroadcastTitle(type, item)}

                <View style={{flex: 0.2, justifyContent: 'center',alignItems: 'center',backgroundColor: 'whitesmoke',borderWidth: 0,flexDirection: 'row', paddingBottom:5, paddingTop: 5}}>
                  <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0 }}>
                      <TouchableOpacity onPress={() => alert('Ouverture du KID')}>
                        <View style={{paddingLeft: 10, paddingRight: 10,marginLeft: 3,marginRight: 3, backgroundColor: '#C0C0C0', borderRadius: 2, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            KID
                          </Text>
                        </View>
                      </TouchableOpacity>                    
                  </View>
                  <View style={{borderWidth: 0, justifyContent:'center', alignItems: 'center', paddingLeft : 3, paddingRight: 7}}>
                      <TouchableOpacity onPress={() => alert('Ouverture de la TS indic')}>
                        <View style={{paddingLeft: 10, paddingRight: 10,marginLeft: 3,marginRight: 3, backgroundColor: '#C0C0C0', borderRadius: 2, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            TS indic
                          </Text>
                        </View>
                      </TouchableOpacity>       
                  </View>
                  <View style={{justifyContent:'center', alignItems: 'center'}}>
                     <TouchableOpacity onPress={() => alert('Ouverture de la TS indic')}>
                        <View style={{paddingLeft: 10, paddingRight: 10, marginLeft: 3,marginRight: 3, backgroundColor: '#C0C0C0', borderRadius: 2, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            Descriptif
                          </Text>
                        </View>
                      </TouchableOpacity>  
                  </View>
                </View>
              </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    wrapper: {
      //paddingLeft: 15,
      //paddingRight: 15,
      //justifyContent : 'center',
      alignItems: 'center',
      marginTop: Platform.OS === 'ios' ? -60+45 : -25+45,
      
    },
    item: {
      //height: 150,
      backgroundColor: '#fff',
      marginBottom: 20,
      shadowColor: 'rgb(75, 89, 101)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,

    }
  })


export default FLTicket;