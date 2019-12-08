import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { FLSlider2 } from '../../commons/FLSlider2';

import { globalStyle, blueFLColor, setFont, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'

import Numeral from 'numeral'
import 'numeral/locales/fr'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLPhoenixBarrierDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            barrier : this.props.initialValueBP,
            isMemory : this.props.initialValueIM,
        }
    }


    _getProtectionTitle=() => {


      return Numeral(this.state.barrier - 1).format('0%');

    }


    render() {
        let text = this.state.barrier === 1 ? 'Votre coupon sera payé au moment du rappel'
                                            :
                  'Votre coupon est garanti jusqu‘à '+Numeral(this.state.barrier-1).format('0%')+' de baisse.';
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}>
 

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  
                    <FLSlider2
                          min={-70}
                          max={-10}
                          step={5}
                          //value={this.state.product['UF'].value*100}
                          value={(this.state.barrier-1)*100}
                          isPercent={true}
                          spreadScale={10}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={DEVICE_WIDTH*0.9}
                          callback={(value) => {
                              //console.log("MATS : "+ value);
                              this.setState({ barrier : (value+100)/100 }, () => {
                                this.props.updateValue("barrierPhoenix", this.state.barrier,"Protégé jusqu'à : " + Numeral(this.state.barrier - 1).format('0%'));
                                
                            });
                            
                          }}
                          single={true}
                        />
                </View>
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 40}}>
                  <Text style={{fontSize: 11, fontWeight: '400', fontFamily : FLFontFamily}}>{text}</Text> 
                </View>
  
                {/*<TouchableWithoutFeedback style={{marginTop: 35}}
                                    onPress={() => {
                                        this.setState({ isMemory: !this.state.isMemory }, () => {
                                          this.props.updateValue("isMemory", this.state.isMemory, this.state.isMemory ? 'Coupon mémoire' : '');
                                        });
                                    }}
                >
                    <View style={{flexDirection: 'row'}}>
                    <View>
                        <MaterialIcons name={this.state.isMemory ? 'check-box' : 'check-box-outline-blank'} size={20} />
                    </View>
                    <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                        <Text style={[setFont('500', 18)]}>
                            {String('mémoire').toUpperCase()}
                        </Text>
                    </View>
                    </View>
                                </TouchableWithoutFeedback>*/}

                    <View style={{marginTop : 20, borderTopWidth : 1}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            {'\n'}Influence
                            </Text>
                            <Text style={setFont('300', 12)}>
                            Choisissez un seuil de paiement de coupons inférieur à celui des rappels : cela augemente la probabilité de paiement des coupons; en contrepartie d'un niveau moins élevé.
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

