import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";


import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

//import Slider from 'react-native-slider';
import Slider from '@react-native-community/slider';


import Numeral from 'numeral'
import 'numeral/locales/fr'







export function FLUF (props) {

        const totalUF = props.UF + props.UFAssoc;

        const [UF, setUF] = useState(() => props.hasOwnProperty('UF') ? props.UF : 0);
        const [UFAssoc, setUFAssoc] = useState(() => props.hasOwnProperty('UFAssoc') ? props.UFAssoc : 0);
        const [splitValue, setSplitValue] = useState(() => {
           //return Math.round(100*UF/(UF+UFAssoc))
           return UF;
        });
        const [isLocked, setIsLocked] = useState(() => props.hasOwnProperty('locked') ? props.locked : false);
        const [ showSlider, setShowSlider ] = useState(() => props.hasOwnProperty('showSlider') ? props.showSlider : true);


        useEffect(() => {
            setIsLocked(props.hasOwnProperty('locked') ? props.locked : false);
            setShowSlider(props.hasOwnProperty('showSlider') ? props.showSlider : true);
          }, [props]);
          
        return (
            <>
             


            <View style={{flexDirection : 'row'}}>
                <View style={{flex : 0.5}}>
                    <View style={{marginBottom : 5}}>
                        <Text style={setFont('200', 12, 'gray')}>{props.company}</Text>
                    </View>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>{currencyFormatDE(props.nominal*UF)} {props.currency} <Text style={setFont('400', 12, 'gray', 'Regular')}> ({Numeral(UF).format('0.00%')})</Text></Text>
                </View>
               
                <View style={{flex : 0.5}}>
                    <View style={{marginBottom : 5}}>
                        <Text style={setFont('200', 12, 'gray')}>Nom Association</Text>
                    </View>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>{currencyFormatDE(props.nominal*UFAssoc)} {props.currency}<Text style={setFont('400', 12, 'gray', 'Regular')}>  ({Numeral(UFAssoc).format('0.00%')})</Text></Text>
                </View>
            </View>
            {showSlider
            ?
                <View style={{flex : 1, marginTop : 10, marginRight : 20}}>

                        <Slider
                            trackStyle={{
                                height: 12,
                                borderRadius: 1,
                                backgroundColor: isLocked ? 'gainsboro' : '#d5d8e8',
                            }}
                            thumbStyle={{
                                width: 10,
                                height: 35,
                                borderRadius: 1,
                                backgroundColor: isLocked ? 'lightgray' : '#838486',
                            }}
                            
                            minimumTrackTintColor={isLocked ? 'gray' : setColor('')}
                            // maximumValue={100}
                            // minimumValue={0}
                            // value={splitValue}
                            // step={1}
                            // onValueChange={(v) => {
                            //     setUF(v*totalUF/100);
                            //     setUFAssoc((100-v)*totalUF/100);
                            //     setSplitValue(v);
                            // }}
                            // onSlidingComplete={(v) => {
                            //     setUF(v*totalUF/100);
                            //     setUFAssoc((100-v)*totalUF/100);
                            //     setSplitValue(v);
                            //     props.updateProduct('UF', UF, currencyFormatDE(UF), false);
                            //     props.updateProduct('UFAssoc', UFAssoc, currencyFormatDE(UFAssoc), false);
                            // }}
                            maximumValue={totalUF}
                            minimumValue={0}
                            value={totalUF}
                            step={0.001}
                            onValueChange={(v) => {
                                setUF(v);
                                setUFAssoc(totalUF-v);
                                setSplitValue(v);
                            }}
                            onSlidingComplete={(v) => {
                                setUF(v);
                                setUFAssoc(totalUF-v);
                                setSplitValue(v);
                                props.updateProduct('UF', UF, currencyFormatDE(UF), false);
                                props.updateProduct('UFAssoc', UFAssoc, currencyFormatDE(UFAssoc), false);
                            }}
                            disabled={isLocked}
                        />

                </View>
            : null
            }
            
          </>
        );

}




