import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import FLRuler from '../../commons/FLRuler';

import { globalStyle, setFont } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export class FLPhoenixBarrierDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            barrier : this.props.initialValue,

        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        this.setState({ barrier : props.initialValue });
    }

    _getProtectionTitle=() => {


      return Numeral(this.state.barrier - 1).format('0%');

    }


    render() {
        let text = this.state.barrier === 1 ? 'Votre coupon sera payé au moment du rappel'
                                            :
                  'Votre coupon est garanti jusqu‘à '+Numeral(this.state.barrier-1).format('0%')+' de baisse.';
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
 

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  


                        <FLRuler
                            style={{ borderRadius: 10, elevation: 3 }}
                            width={getConstant('width')*0.8}
                            height={70}
                            vertical={false}
                            onChangeValue={(value) => {
                                this.setState({ barrier : (value+100)/100 }, () => {
                                    this.props.updateValue("barrierPhoenix", this.state.barrier,"Protégé jusqu'à : " + Numeral(this.state.barrier - 1).format('0%'));           
                                });
                            }}
                    
                            minimum={-70}
                            maximum={0}
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
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={setFont('400', 14, 'black', 'Regular')}>{text}</Text> 
                </View>
  


                    <View style={{marginTop : 20, borderTopWidth : 1}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            {'\n'}Influence
                            </Text>
                            <Text style={setFont('300', 12)}>
                            Si vous choisissez un seuil de paiement de coupons inférieur à celui des rappels : cela augemente la probabilité de paiement des coupons; en contrepartie d'un niveau moins élevé.
                            </Text>
                    </View>
                    <View style={{marginTop : 10, borderTopWidth : 0}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            Vérification
                            </Text>
                            <Text style={setFont('300', 12)}>
                            Adaptez cette sécurité avec le profil de risque attendu.
                            </Text>
                    </View>
                    <View style={{marginTop : 10, borderTopWidth : 0}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            Risques
                            </Text>
                            <Text style={setFont('300', 12)}>
                            Le changement de seuil des coupons n'améliore pas la protection du capital.
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

