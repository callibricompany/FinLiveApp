import React, { useState, useRef} from 'react';
import { ScrollView, Text, View, Image, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';



import Moment from 'moment';

import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

import { FLDatePicker } from '../FLDatePicker';
import FLTemplateAutocall from '../Autocall/FLTemplateAutocall';
import { FLUF } from "../Autocall/FLUF";

import * as TEMPLATE_TYPE from '../../../constants/template';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export function FLChat ({ticket}) {

        return (
            <View style={{flex : 1, borderWidth : 4}}>

            </View>

        )
}




