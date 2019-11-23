import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import { FLSlider2 } from '../../../Components/commons/FLSlider2';

import { globalStyle, blueFLColor, backgdColor, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLMaturityDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            maturities : this.props.initialValue,
            toto : true,
        }

        //console.log("MATS 0 : "+this.state.maturities);
    }



    componentWillReceiveProps(props) {
      this.setState({ toto : !this.state.toto });
    }

    _getMaturityTitle=() => {

      let title = "";
      let ans = " ans";

      if (this.state.maturities[1] <= 1) {
        ans = " an";
      }
      if (this.state.maturities[0] < this.state.maturities[1]) {
        title=title.concat(this.state.maturities[0] + " à " + this.state.maturities[1] + ans);
      } else {
        title=title.concat(this.state.maturities[1] + ans);
      }
      return title;

    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}>
        
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 20}}>
                  <Text style={{fontSize: 16, fontWeight: '400', fontFamily : FLFontFamily}}>Maturité minimum (années): </Text> 
                </View>
                <View style={{alignItems:'center', justifyContents: 'center', borderWidth: 0}}>  
                    <FLSlider2
                          min={1}
                          max={10}
                          step={1}
                          //value={this.state.product['UF'].value*100}
                          value={this.state.maturities[0]}
                          isPercent={false}
                          spreadScale={1}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={DEVICE_WIDTH*0.9}
                          callback={(value) => {
                            console.log("ON EST DANS LE CALLBACK MIN");
                              this.setState({ maturities : [Math.trunc(value) <= this.state.maturities[1] ? Math.trunc(value) : this.state.maturities[1]-1, this.state.maturities[1]] }, () => {
                                this.props.updateValue("maturity", this.state.maturities, this._getMaturityTitle());
                                
                            });
                            this.setState({ toto : !this.state.toto });
                            
                          }}
                          single={true}
                        />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', marginTop : 25, borderWidth: 0}}>
                  <Text style={{fontSize: 16, fontWeight: '400', fontFamily : FLFontFamily}}>Maturité maximum (années): </Text> 
                </View>
                <View style={{alignItems:'center', justifyContents: 'center', borderWidth: 0,  paddingBottom : 15}}>  
                    <FLSlider2
                          min={1}
                          max={10}
                          step={1}
                          //value={this.state.product['UF'].value*100}
                          value={this.state.maturities[1]}
                          isPercent={false}
                          spreadScale={1}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={DEVICE_WIDTH*0.9}
                          callback={(value) => {
                            console.log("ON EST DANS LE CALLBACK MAX");
                              this.setState({ maturities : [this.state.maturities[0], Math.trunc(value) >= this.state.maturities[0] ? Math.trunc(value) : this.state.maturities[0] + 1] }, () => {
                                this.props.updateValue("maturity", this.state.maturities, this._getMaturityTitle());
                                
                            });
                            this.setState({ toto : !this.state.toto });
                          }}
                          single={true}
                        />
                </View>
            </View>
        );
    }


}

