import React, { useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";



import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export function FLPDI (props) {


        return (
            <View style={{}}
                      
            >
              <View style={{justifyContent: 'flex-start',  margin: 5, marginRight : 10}}>
                        <Text style={setFont('400', 12, 'black','Regular')}>
                          100% de votre capital est protégé jusqu'à ce que le sous-jacent atteigne le niveau de protection. En-dessous, votre capital remboursé sera amputé de l'éventuelle baisse du sous-jacent à l'échéance.
                        </Text>
              </View>
      
              <View style={{flexDirection: 'row', marginTop : 20}}>
                    <View style={{flex: 0.5}}>
                       <Text style={setFont('400', 12, 'black','Bold')}>Niveau de protection :</Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={setFont('400', 12)}>
                         {Numeral(props.barrierPDI).format('0.00%')}
                      </Text>
                    </View>
              </View>
              {/* <Slider
                        trackStyle={{
                            height: 18,
                            borderRadius: 1,
                            backgroundColor: '#d5d8e8',
                        }}
                        thumbStyle={{
                            width: 20,
                            height: 30,
                            borderRadius: 1,
                            backgroundColor: '#838486',
                        }}
                        
                        minimumTrackTintColor={setColor('')}
                        maximumValue={100}
                        minimumValue={0}
                        value={splitValue}
                        step={1}
                        onValueChange={(v) => {
                            setUF(v*totalUF/100);
                            setUFAssoc((100-v)*totalUF/100);
                            setSplitValue(v);
                        }}
                        onSlidingComplete={(v) => {
                            setUF(v*totalUF/100);
                            setUFAssoc((100-v)*totalUF/100);
                            setSplitValue(v);
                            props.updateProduct('UF', UF, currencyFormatDE(UF), false);
                            props.updateProduct('UFAssoc', UFAssoc, currencyFormatDE(UFAssoc), false);
                        }}
            /> */}
              <View style={{flexDirection: 'row', marginTop : 10}}>
                    <View style={{flex: 0.5}}>
                        <Text style={setFont('400', 12, 'black','Bold')}>Désactivation de la protection :</Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={setFont('400', 12)}>
                        {props.isPDIUS ? 'A tout moment' : 'Déterminé par le cours de clotûre du dernier jour'}
                      </Text>
                    </View>
              </View>
           </View>
          );

}




