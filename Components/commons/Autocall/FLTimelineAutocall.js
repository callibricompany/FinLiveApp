import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle';
import { getConstant, currencyFormatDE, isAndroid } from '../../../Utils';


import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';



export function FLTimelineAutocall ({autocall, underlyings}) {
        //autocall.getAutocallLevel()
        var barrierPDI = autocall.getBarrierPDI();
        var barrierPhoenix = autocall.getBarrierPhoenix();
        var strikingLevels = autocall.getStrikingLevels();
        var udlsTickers = autocall.getUnderlyingTickers();

        var spotLevels = {};
        
        //recuperation des spots
        underlyings.forEach((udl) => {
            if (udl.hasOwnProperty('ticker') && udl.hasOwnProperty('closeprice')) {
                if (Object.keys(strikingLevels).includes(udl['ticker'])) {
                    spotLevels[udl['ticker']] = udl['closeprice'];
                }
            }
        });

        autocall.setSpots(spotLevels);
        var perfs = autocall.getPerformances();
        console.log(perfs);
        console.log(spotLevels);
        
        useEffect(() => {
            //console.log("MAXIMUM DATE CHANGED : " + props.maximumDate);
        }, []);
 
        //console.log(spotLevels);
		return (

            <View style={{flex : 1, borderWidth :1, height : 80}}>
                <View style={{}}>
                
                </View>
                <Text>{barrierPDI}</Text>
                <Text>{barrierPhoenix}</Text>
                <Text>{autocall.getAutocallLevel()}</Text>
			</View>


		);

}




