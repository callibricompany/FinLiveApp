import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';


import { FLSlider2 } from '../../commons/FLSlider2';
import SwitchSelector from "react-native-switch-selector";
import FLRuler from '../../commons/FLRuler';

import { setFont, setColor} from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export class FLPDIDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            barrier : this.props.initialValue,
            isPDIUS : this.props.initialValueIsUS 
        }

        console.log("Barriere PDI : " + this.props.initialValue);
        console.log("Type PDI : " + this.props.initialValueIsUS);
    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
 

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  
                    {/* <FLSlider2
                          min={-70}
                          max={0}
                          step={5}
                          //value={this.state.product['UF'].value*100}
                          value={(this.state.barrier-1)*100}
                          isPercent={true}
                          spreadScale={10}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={getConstant('width')*0.9}
                          callback={(value) => {
                              //console.log("MATS : "+ value);
                              this.setState({ barrier : (value+100)/100 }, () => {
                                this.props.updateValue("barrierPDI", this.state.barrier, "Protégé jusqu'à " + Numeral(this.state.barrier-1).format('0%'));
                                
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
                                this.setState({ barrier : (value+100)/100 }, () => {
                                    this.props.updateValue("barrierPDI", this.state.barrier, "Protégé jusqu'à " + Numeral(this.state.barrier-1).format('0%'));
                                    
                            });
                            }}
                    
                            minimum={-70}
                            maximum={-10}
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
                            unit='%'
                            unitBottom={5}
                            unitFontFamily='System'
                            unitColor='#888888'
                            unitSize={0}
                            defaultValue={100*(this.state.barrier-1)}
                            //vertical={true}
                        />
                </View>
                <View style={{marginTop : 15}}>
                    <SwitchSelector
                            initial={this.state.isPDIUS ? 1 : 0}
                            onPress={obj => {
    
                                this.setState({ isPDIUS : obj.value === 'US' ? true : false }, () => {
                                    this.props.updateValue("isPDIUS", obj.value === 'US', obj.value);
                                });
                            }}
                            textColor={setColor('lightBlue')} 
                            textContainerStyle={{padding :  5}}
                            selectedTextContainerStyle={{borderWidth : 0, padding : 5}}
                            height={60}
                            borderRadius={20}
                            selectedColor={'white'}
                            buttonColor={setColor('')} 
                            borderColor={'lightgray'} 
                            returnObject={true}
                            hasPadding={true}
                            options={[
                                { label: "Activation possible seulement in fine (EU)", value: "EU", customIcon: null}, 
                                { label: "Activation possible à tout moment (US)", value: "US", customIcon: null} ,
                            ]}
                    />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('400', 12, 'black', 'Regular')}>100% du capital protégé jusqu'à une baisse de {Numeral(1 - this.state.barrier).format('0%')} du sous-jacent</Text> 
                </View>

                <View style={{marginTop : 20, borderTopWidth : 1}}>
                        <Text style={setFont('400', 14, 'black', 'Regular')}>
                        {'\n'}Influence
                        </Text>
                        <Text style={setFont('300', 12)}>
                        Votre coupon sera d'autant plus faible que votre protection sera élévée
                        </Text>
                </View>
                <View style={{marginTop : 10, borderTopWidth : 0}}>
                        <Text style={setFont('400', 14, 'black', 'Regular')}>
                        Vérification
                        </Text>
                        <Text style={setFont('300', 12)}>
                        Validez auprès de votre client la compréhension de la notion de perte potentielle de capital 
                        </Text>
                </View>
                <View style={{marginTop : 10, borderTopWidth : 0}}>
                        <Text style={setFont('400', 14, 'black', 'Regular')}>
                        Risques
                        </Text>
                        <Text style={setFont('300', 12)}>
                        En cas de troubles sur le marché, la perte en capital peut s'avérer sévère. Adaptez opportunement son niveau d'activation.
                        </Text>
                </View>
                <View style={{marginTop : 10, borderTopWidth : 0}}>
                        <Text style={setFont('400', 14, 'black', 'Regular')}>
                        Illustration
                        </Text>
    
                </View>
            </View>
        );
    }


}

