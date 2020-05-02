import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';


import { FLSlider2 } from '../../commons/FLSlider2';

import { setFont } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export class FLPDIDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            barrier : this.props.initialValue,
        }

        console.log("Barriere PDI : " + this.props.initialValue);
    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
 

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  
                    <FLSlider2
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
                        />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('400', 12)}>100% du capital protégé jusqu'à une baisse de {Numeral(1 - this.state.barrier).format('0%')} du sous-jacent</Text> 
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

