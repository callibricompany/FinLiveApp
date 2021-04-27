import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';


import { FLSlider2 } from '../../commons/FLSlider2';
import FLRuler from '../../commons/FLRuler';

import { setFont } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export class FLUFDetail extends React.Component{

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
                    {/* <FLSlider2
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
                        /> */}

                <FLRuler
                    style={{ borderRadius: 10, elevation: 3 }}
                    width={getConstant('width')*0.8}
                    height={70}
                    vertical={false}
                    onChangeValue={(value) => {
                        //console.log("MATS : "+ value);
                        this.setState({ UF : (value)/1000 }, () => {
                          this.props.updateValue("UF", this.state.UF, Numeral(this.state.UF).format('0.00%'));
                       });
                    }}
             
                    minimum={0}
                    maximum={60}
                    segmentWidth={2}
                    segmentSpacing={10}
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
                    unit=''
                    unitBottom={5}
                    unitFontFamily='System'
                    unitColor='#888888'
                    unitSize={0}
                    defaultValue={1000*this.state.UF}
                    //vertical={true}
                />
                        
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 10, marginLeft : 20}}>
                  <Text style={setFont('400', 14, 'black', 'Regular')}>Rétocession :  {Numeral(this.state.UF).format('0.00%')}</Text> 
                </View>

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 60}}>  
                    {/* <FLSlider2
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
                        /> */}

                  <FLRuler
                    style={{ borderRadius: 10, elevation: 3 }}
                    width={getConstant('width')*0.6}
                    height={40}
                    vertical={false}
                    onChangeValue={(value) => {
                      this.setState({ UFAssoc : (value)/1000 }, () => {
                        this.props.updateValue("UFAssoc", this.state.UFAssoc, Numeral(this.state.UFAssoc).format('0.00%'));
                      });
                    }}
             
                    minimum={0}
                    maximum={20}
                    segmentWidth={2}
                    segmentSpacing={10}
                    indicatorColor='#FF0000'
                    indicatorWidth={50}
                    indicatorHeight={20}
                    indicatorBottom={10}
                    step={10}
                    stepColor='#333333'
                    stepHeight={20}
                    normalColor='#999999'
                    normalHeight={10}
                    backgroundColor='#FFFFFF'
                    numberFontFamily='System'
                    numberSize={20}
                    numberColor='#000000'
                    unit=''
                    unitBottom={5}
                    unitFontFamily='System'
                    unitColor='#888888'
                    unitSize={0}
                    defaultValue={1000*this.state.UFAssoc}
                    //vertical={true}
                />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 10, marginLeft : 20}}>
                    <Text style={setFont('400', 12, 'black', 'Regular')}>Rétocession pour votre assoxciation :  {Numeral(this.state.UFAssoc).format('0.00%')}</Text> 
                </View>
            </View>
        );
    }


}

