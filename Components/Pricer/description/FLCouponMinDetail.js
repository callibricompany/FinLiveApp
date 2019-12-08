import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';


import { FLSlider2 } from '../../commons/FLSlider2';

import { setFont, blueFLColor, backgdColor, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'

import Numeral from 'numeral'
import 'numeral/locales/fr'


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLCouponMinDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            couponMin : this.props.initialValueCouponMin,
           
        }

        
    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}>
                
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('300', 14)}>Fixez le coupon annualisé que vous recherchez : </Text> 
                </View>

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  
                    <FLSlider2
                          min={0}
                          max={20}
                          step={0.5}
                          //value={this.state.product['UF'].value*100}
                          value={(this.state.couponMin)*100}
                          isPercent={true}
                          spreadScale={2}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={DEVICE_WIDTH*0.9}
                          callback={(value) => {
                              //console.log("MATS : "+ value);
                              this.setState({ couponMin : (value)/100 }, () => {
                                this.props.updateValue("coupon", this.state.couponMin, Numeral(this.state.couponMin).format('0.00%'));
                                
                            });
                            
                          }}
                          single={true}
                        />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('400', 18, 'Regular')}>{Numeral(this.state.couponMin).format('0.00%')} p.a.</Text> 
                </View>
            </View>
        );
    }


}

