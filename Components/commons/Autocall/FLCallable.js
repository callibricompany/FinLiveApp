import React, { useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";


import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

import Numeral from 'numeral';
import 'numeral/locales/fr';

import Moment from 'moment';





export function FLCallable ({autocalldatas}) {

    let alreadyBreaked = false;
    return (
                    <View style={{ marginRight : 10}}>
                            <View style={{flex: 1, justifyContent: 'flex-start', borderWidth: 0, marginTop : 5, marginBottom: 5}}>
                                    <Text style={setFont('400', 12, 'black')}>
                                    Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal au niveau de rappel alors le produit s'arrête et est remboursé à son niveau de remboursement.
                                    </Text>
                            </View>

                            <View style={{flexDirection: 'row', marginTop : 5}}>
                                <View style={{flex: 0.333, padding : 5}}>
                                    <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>Date de constatation</Text>
                                </View>
                                <View style={{flex: 0.334, padding : 5}}>
                                    <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                                    Niveau de rappel
                                    </Text>
                                </View>
                                <View style={{flex: 0.333, padding : 5}}>
                                    <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                                    Remboursement
                                    </Text>
                                </View>
                            </View>


                            {
                                
                                autocalldatas.map((obj, i) => {
                                    if (autocalldatas.length > 10 && i > 5 && i < (autocalldatas.length - 3)) {
                                    if (alreadyBreaked) { 
                                        return null;
                                    }
                                    alreadyBreaked = true;
                                    return (
                                        <View style={{flexDirection: 'row'}} key={i}>
                                            <View style={{flex: 0.333}}>
                                            <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                                                ...
                                            </Text>
                                            </View>
                                            <View style={{flex: 0.334}}>
                                            <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                                                ...
                                            </Text>
                                            </View>
                                            <View style={{flex: 0.333}}>
                                            <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                                                ...
                                            </Text>
                                            </View>
                                        </View>
                                    )
                                    }
                                    return (
                                    <View style={{flexDirection: 'row'}} key={i}>
                                        <View style={{flex: 0.333}}>
                                            <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                                                {Moment(obj["date"]).format('DD/MM/YYYY')}
                                            </Text>
                                        </View>
                                        <View style={{flex: 0.334}}>
                                            <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                                                {Numeral(obj['level']).format('0%')}
                                            </Text>
                                        </View>
                                        <View style={{flex: 0.333}}>
                                            <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                                                {Numeral(obj['coupon']).format('0.00%')}
                                            </Text>
                                        </View>
                                    </View>
                                    )
                                })
                            }
                        </View>
                        );

}




