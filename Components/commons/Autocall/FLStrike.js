import React, { useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";


import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

import { FLDatePicker } from '../FLDatePicker';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export function FLStrike (props) {



        const refAuctionDropDown = useRef();
        const refNominal = useRef();

        return (
            <>
             

            <View style={{flexDirection : 'row', marginTop : 25}}>
                <View style={{flex : 1}}>
                    <View style={{marginBottom : 5}}>
                        <Text style={setFont('200', 12, 'gray')}>Date de constation initiale</Text>
                    </View>
                    <FLDatePicker date={props.strikedate} onChange={() =>  console.log("en attente fin de dev pricer")} isEditable={props.isEditable} />
                </View>
               
  
            </View>

            </>
        );

}




