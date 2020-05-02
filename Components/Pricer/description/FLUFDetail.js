import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';


import { FLSlider2 } from '../../commons/FLSlider2';

import { setFont } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export class FLUFDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            UF : this.props.initialValueUF,
            UFAssoc : this.props.initialValueUFAssoc,
        }

        
    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
 

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  
                    <FLSlider2
                          min={0}
                          max={6}
                          step={0.2}
                          //value={this.state.product['UF'].value*100}
                          value={(this.state.UF)*100}
                          isPercent={true}
                          spreadScale={1}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={getConstant('width')*0.9}
                          callback={(value) => {
                              //console.log("MATS : "+ value);
                              this.setState({ UF : (value)/100 }, () => {
                                this.props.updateValue("UF", this.state.UF, Numeral(this.state.UF).format('0.00%'));
                                
                            });
                            
                          }}
                          single={true}
                        />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('400', 12)}>Rétocession :  {Numeral(this.state.UF).format('0.00%')}</Text> 
                </View>

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  
                    <FLSlider2
                          min={0}
                          max={2}
                          step={0.2}
                          //value={this.state.product['UF'].value*100}
                          value={(this.state.UFAssoc)*100}
                          isPercent={true}
                          spreadScale={1}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={getConstant('width')*0.9}
                          callback={(value) => {
                              //console.log("MATS : "+ value);
                              this.setState({ UFAssoc : (value)/100 }, () => {
                                this.props.updateValue("UFAssoc", this.state.UFAssoc, Numeral(this.state.UFAssoc).format('0.00%'));
                                
                            });
                            
                          }}
                          single={true}
                        />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('400', 12)}>Rétocession pour votre assoxciation :  {Numeral(this.state.UFAssoc).format('0.00%')}</Text> 
                </View>
            </View>
        );
    }


}

