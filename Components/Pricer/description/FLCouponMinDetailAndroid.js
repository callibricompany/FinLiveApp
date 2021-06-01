import React from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableOpacity, StatusBar } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import Ruler from 'react-native-animated-ruler';
import FLRuler from '../../commons/FLRuler';
import { FLSlider2 } from '../../commons/FLSlider2';

import { setFont, setColor } from '../../../Styles/globalStyle';
import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant } from '../../../Utils';

import Numeral from 'numeral';
import 'numeral/locales/fr'







export default class FLCouponMinDetailAndroid extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            couponMin : this.props.initialValueCouponMin,
           
        }

        
    }

    static navigationOptions = {
        //header: null
        headerShown: false
    }


    render() {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center'}} >
              <View style={{position : 'absolute', top : 0, left : 0, flexDirection : 'row', marginTop : getConstant('statusBar')-(isIphoneX() ? 45 : isAndroid() ? 30 : 20) ,height: isAndroid() ? (getConstant('statusBar') +30) :  (40+getConstant('statusBar')), width : getConstant('width'), paddingLeft : 10, paddingRight : 10, backgroundColor: setColor(''), opacity : 0.9, paddingTop : isAndroid() ? 10 : isIphoneX() ? 40 : 20, alignItems : 'center', justifyContent :'space-between'}}  >
                            <TouchableOpacity style={{  flex : 0.25, flexDirection : 'row', borderWidth: 0, padding : 5}}
                                                onPress={() => {
                                                    this.props.navigation.state.params.updateValue("coupon", this.state.couponMin, Numeral(this.state.couponMin).format('0.00%'));
                                                    this.props.navigation.goBack();
                                                }}
                            >
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/>
                                    </View>
                                    <View style={{justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 5}}>
                                        <Text style={setFont('300', 16, 'white', 'Regular')}>Retour</Text>
                                    </View>
                            </TouchableOpacity>
                            <View style={{flex : 0.5, borderWidth : 0, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={setFont('400', 24, 'white', 'Regular')}>
                                    COUPON
                                </Text>
                            </View>

                            <TouchableOpacity style={{flex : 0.25, width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'flex-end', padding: 5}}
                                                                onPress={() => {
                                                
                                                        
                                                                }}
                            >
                                <EvilIcons name={'share-apple'} size={35} style={{color: 'white'}}/>
                            </TouchableOpacity>

                </View>
                
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : getConstant('statusBar') + 40+ (isAndroid() ? 13 : 30), paddingLeft : 20, paddingRight : 20}}>
                  <Text style={setFont('300', 22, 'black', 'Regular')}>Fixez le coupon annualisé minimum que vous recherchez : </Text> 
                </View>

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  

                <FLRuler
                    style={{ borderRadius: 10, elevation: 3 }}
                    width={350}
                    height={170}
                    vertical={false}
                    onChangeValue={(value) => {
                        //console.log("MATS : "+ value);
                        this.setState({ couponMin : (value)/1000 }, () => {
                         // this.props.updateValue("coupon", this.state.couponMin, Numeral(this.state.couponMin).format('0.00%'));
                          
                       });
                    }}
                    minimum={0}
                    maximum={200}
                    segmentWidth={2}
                    segmentSpacing={20}
                    indicatorColor='#FF0000'
                    indicatorWidth={100}
                    indicatorHeight={40}
                    indicatorBottom={20}
                    step={10}
                    stepColor='#333333'
                    stepHeight={40}
                    normalColor='#999999'
                    normalHeight={20}
                    backgroundColor='#FFFFFF'
                    numberFontFamily='System'
                    numberSize={40}
                    numberColor='#000000'
                    unit='%'
                    unitBottom={5}
                    unitFontFamily='System'
                    unitColor='#888888'
                    unitSize={0}
                    defaultValue={0.0}
                    //vertical={true}
                />

                </View>
                <TouchableOpacity style={{backgroundColor: setColor('subscribeBlue'), width : getConstant('width')/2, marginTop : 70, alignItems: 'center', justifyContent: 'center'}}
                                      onPress={() => {
                                        this.props.navigation.state.params.updateValue("coupon", this.state.couponMin, Numeral(this.state.couponMin).format('0.00%'));
                                        this.props.navigation.goBack();
                                      }}
                    >
                      <Text style={[setFont('400',20,'white', 'Bold'), {margin : 5}]}>VALIDER</Text>
                </TouchableOpacity>
            </View>
        );
    }


}


{/* <FLSlider2
min={0}
max={20}
step={0.5}
//value={this.state.product['UF'].value*100}
value={(this.state.couponMin)*100}
isPercent={true}
spreadScale={2}
//activated={!this.state.product["UF"].isActivated}
sliderLength={getConstant('width')*0.9}
callback={(value) => {
    //console.log("MATS : "+ value);
    this.setState({ couponMin : (value)/100 }, () => {
      this.props.updateValue("coupon", this.state.couponMin, Numeral(this.state.couponMin).format('0.00%'));
      
  });
}}
single={true}
/> */}
