import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';


import { FLSlider2 } from '../../commons/FLSlider2';

import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'

import Numeral from 'numeral'
import 'numeral/locales/fr'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLPDIDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            barrier : this.props.initialValue,
        }
    }


    _getProtectionTitle=() => {


      ;

    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}>
 

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  
                    <FLSlider2
                          min={40}
                          max={100}
                          step={5}
                          //value={this.state.product['UF'].value*100}
                          value={(this.state.barrier)*100}
                          isPercent={true}
                          spreadScale={10}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={DEVICE_WIDTH*0.9}
                          callback={(value) => {
                              console.log("MATS : "+ value);
                              this.setState({ barrier : value/100 }, () => {
                                this.props.updateValue("barrierPDI", this.state.barrier, Numeral(this.state.barrier).format('0%'));
                                
                            });
                            
                          }}
                          single={true}
                        />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={{fontSize: 11, fontWeight: '400', fontFamily : FLFontFamily}}>100% du capital protégé jusqu'à une baisse de {Numeral(1 - this.state.barrier).format('0%')} du sous-jacent</Text> 
                </View>
            </View>
        );
    }


}

