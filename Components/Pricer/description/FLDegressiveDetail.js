import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';


import { FLSlider2 } from '../../commons/FLSlider2';

import { globalStyle, setFont } from '../../../Styles/globalStyle'
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'




export class FLDegressiveDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            barrier : this.props.initialValue,
        }
    }


    _getDegressiveTitle=() => {

        let title = 'Pas de dégressivité';
        if (this.state.barrier !== 0) {
            title = Numeral(this.state.barrier/100).format('0%') + " par an";
        }
        return title;
    }
    _getDegressiveExplanation=() => {

        let title = 'Les niveaux de rappels seront à 100% durant toute la fin du produit.';
        if (this.state.barrier !== 0) {
            title = 'Les niveaux de rappel décroîtront de '+ Numeral(this.state.barrier/100).format('0%') + " par an.";
        }
        return title;
    }

    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
 

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  
                    <FLSlider2
                          min={0}
                          max={5}
                          step={1}
                          //value={this.state.product['UF'].value*100}
                          value={this.state.barrier}
                          isPercent={true}
                          spreadScale={1}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={getConstant('width')*0.9}
                          callback={(value) => {
                              this.setState({ barrier : value }, () => {
                                this.props.updateValue("degressiveStep", this.state.barrier, this._getDegressiveTitle());
                                
                            });
                            
                          }}
                          single={true}
                        />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('400', 12)}>
                     {this._getDegressiveExplanation()}
                  </Text> 
                </View>
            </View>
        );
    }


}

