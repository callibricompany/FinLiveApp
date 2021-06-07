import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import SwitchSelector from "react-native-switch-selector";
import { FLSlider2 } from '../../commons/FLSlider2';

import { globalStyle, setFont, setColor } from '../../../Styles/globalStyle'
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import DegressivityBarrier from '../../../charts/products/DegressivityBarrier';


export class FLDegressiveDetail extends React.Component{

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
 

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20, marginBottom : 30, borderWidth: 0}}>  
                    {/* <FLSlider2
                          min={0}
                          max={5}
                          step={1}
                          //value={this.state.product['UF'].value*100}
                          value={this.state.barrier}
                          isPercent={true}
                          spreadScale={1}
                          minimumTrackTintColor={setColor('')}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={getConstant('width')}
                          callback={(value) => {
                              this.setState({ barrier : value }, () => {
                                this.props.updateValue("degressiveStep", this.state.barrier, this._getDegressiveTitle());
                                
                            });
                            
                          }}
                          single={true}
                        /> */}
                        <SwitchSelector
                                initial={this.state.barrier}
                                onPress={obj => {
                                  this.props.updateValue("degressiveStep", obj.value, obj.label);
                                  this.setState({ barrier : obj.value });
                                }}
                                textColor={setColor('lightBlue')} 
                                textContainerStyle={{padding :  5}}
                                selectedTextContainerStyle={{borderWidth : 0, padding : 5}}
                                height={50}
                                borderRadius={10}
                                selectedColor={'white'}
                                buttonColor={setColor('')} 
                                borderColor={'lightgray'} 
                                returnObject={true}
                                hasPadding={true}
                                options={[
                                    { label: "0%\npar an", value: "0.0", customIcon: null}, 
                                    { label: "1%\npar an", value: "1.0", customIcon: null}, 
                                    { label: "2%\npar an", value: "2.0", customIcon: null}, 
                                    { label: "3%\npar an", value: "3.0", customIcon: null}, 
                                    { label: "4%\npar an", value: "4.0", customIcon: null},
                                    { label: "5%\npar an", value: "5.0", customIcon: null}, 
                                ]}
                        />   
                </View>

                <DegressivityBarrier request={this.props.request} degressivity={this.state.barrier}/> 

                {/* <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('400', 16, 'black', 'Regular')}>
                     {this._getDegressiveExplanation()}
                  </Text> 
                </View> */}
            </View>
        );
    }


}

