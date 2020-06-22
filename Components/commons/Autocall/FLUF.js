import React, { useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";


import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

import Slider from 'react-native-slider';

import { FLDatePicker } from '../FLDatePicker';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export function FLUF (props) {

        const totalUF = props.UF + props.UFAssoc;
        const [UF, setUF] = useState(() => props.hasOwnProperty('UF') ? props.UF : 0);
        const [UFAssoc, setUFAssoc] = useState(() => props.hasOwnProperty('UFAssoc') ? props.UFAssoc : 0);
        const [splitValue, setSplitValue] = useState(() => {
           return Math.round(100*UF/(UF+UFAssoc))
        });

        return (
            <>
             


            <View style={{flexDirection : 'row'}}>
                <View style={{flex : 0.5}}>
                    <View style={{marginBottom : 5}}>
                        <Text style={setFont('200', 12, 'gray')}>{props.company}</Text>
                    </View>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>{currencyFormatDE(props.nominal*UF)} {props.currency}</Text>
                </View>
               
                <View style={{flex : 0.5}}>
                    <View style={{marginBottom : 5}}>
                        <Text style={setFont('200', 12, 'gray')}>Nom Association</Text>
                    </View>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>{currencyFormatDE(props.nominal*UFAssoc)} {props.currency}</Text>
                </View>
            </View>
            {props.isEditable
            ?
                <View style={{flex : 1, marginTop : 25, marginRight : 20}}>

                        <Slider
                            trackStyle={{
                                height: 18,
                                borderRadius: 1,
                                backgroundColor: '#d5d8e8',
                            }}
                            thumbStyle={{
                                width: 15,
                                height: 35,
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
                        />

                </View>
            : null
            }
            
          </>
        );

}




