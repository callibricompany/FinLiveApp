import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";



import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

import  { FLDatePicker } from  '../FLDatePicker';

import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';


export function FLStrike ({isEditable, updateProduct, autocall}) {
 
        var strikedate = autocall.getStrikingDate();
        var maximumDate = autocall.getIssueDate();
        var minimumDate = new Date(Date.now());
        var strikingLevels = autocall.getStrikingLevels();
        var underlyingsNames = autocall.getUnderlyingsList();
        var lastConstatDate =autocall.getLastConstatDate();
 
        useEffect(() => {
            //console.log("MAXIMUM DATE CHANGED : " + props.maximumDate);
        }, [autocall]);

        return (
            <>
             

            <View style={{ flexDirection : 'row', marginTop : 25}}>
                <View style={{flex : 0.5, borderWidth : 0}}>
                    <View style={{flex : 1}}>
                        <View style={{marginBottom : 5}}>
                            <Text style={setFont('200', 12, 'gray')}>Date de constation initiale</Text>
                        </View>
                        <FLDatePicker   date={strikedate} 
                                        onChange={(d) =>  updateProduct('strikingDate', d, "Striking date : "+d, false)} 
                                        isEditable={isEditable} 
                                        maximumDate={strikedate}
                                        minimumDate={strikedate}
                                    />
                    </View>
                    {autocall.isStruck()
                    ?
                        <View style={{flex : 1}}>
                            <View style={{marginBottom : 5, marginTop : 10}}>
                                <Text style={setFont('200', 12, 'gray')}>Niveau{underlyingsNames.length > 1 ? 'x initiaux' : ' initial'}</Text>
                            </View>
                            {Object.keys(underlyingsNames).map((udl) => {
                                return (
                                    <View style={{flexDirection : 'row', marginBottom : 2}} key={udl}>
                                        <View style={{flex : 0.6}}>
                                            <Text style={setFont('200', 12, 'black')}>{underlyingsNames[udl]}</Text>
                                        </View>
                                        <View style={{flex : 0.4}}>
                                            <Text style={setFont('200', 12, 'black')}>{Numeral(strikingLevels[udl]).format("0.00")}</Text>
                                        </View>
                                    </View>
                                );
                            })
                            }
                        </View>
                    : null
                    }
                </View>
                <View style={{flex : 0.5, borderWidth : 0}}>
                    <View style={{flex : 1}}>
                        <View style={{marginBottom : 5}}>
                            <Text style={setFont('200', 12, 'gray')}>Dernière date de constatation</Text>
                        </View>
                        <FLDatePicker   date={lastConstatDate} 
                                        onChange={(d) =>  updateProduct('strikingDate', d, "Striking date : "+d, false)} 
                                        isEditable={isEditable} 
                                        maximumDate={lastConstatDate}
                                        minimumDate={lastConstatDate}
                                    />
                    </View>
                </View>
            </View>

            </>
        );

}




