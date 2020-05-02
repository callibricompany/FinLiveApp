import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { FLSlider2 } from '../../commons/FLSlider2';

import { globalStyle, setFont } from '../../../Styles/globalStyle'
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'




export class FLMemoryDetail extends Component{

    constructor(props) {
        super(props);


    }





    render() {

        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
 

       
                    <View style={{marginTop : 20, borderTopWidth : 1}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            {'\n'}Influence
                            </Text>
                            <Text style={setFont('300', 12)}>
                            L'effet mémoire vous permettra de récupérer tous les coupons que vous avez raté dès que vous en aurez activé un.
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
                            Rajouter un effet mémoire affectera drastiquement le niveau du coupon.
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

