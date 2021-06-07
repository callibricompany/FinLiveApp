import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setFont, setColor } from '../../../Styles/globalStyle';
import Numeral from 'numeral';


export default function MedianScenarioPhoenix({
    remb,
    coupon,
    ymin,
    ymax,
    xmax,
    barr_capital,
    barr_anticipe,
    xrel,
    rand_func,
    data,
}) {

    function sj_above_coupon() {
        let coup = data.flux;
        let ok = [];
        let nbcoupon = 0;
        let investisseur = '';

        for (let i = 1; i < coup.length; i++) {
            // if (i == coup.length - 1) {
            //     if (coup[i] == 100 + coupon) {
            //         ok.push(i);
            //     }
            // } else {
            //     if (coup[i] == coupon) {
            //         ok.push(i)
            //         nbcoupon++;
            //     }
            // }

                coup[i] = (coup[i] - 100)/100;
          
            if (coup[i] > 0) {
                ok.push(i)
                nbcoupon++;
            }
        }

        let message;
        if (ok.length > 0) {
            message = 'Aux années ' + ok.join(', ') + ', la barrière de coupon est dépassée.';
            investisseur = "L'investisseur recoit " + nbcoupon + " coupon(s) de " + 
            Numeral(coupon).format('0.00%')+ "% et un remboursement final de " +Numeral((100+coup[coup.length -1])/100).format('0.00%') + ".";
        } else {
            message = "La barrière de coupon n'est jamais dépassée."
            investisseur = "L'investisseur recoit uniquement un remboursement final de " +Numeral(coup[coup.length -1]).format('0.00%') + ".";
        }

        return { message, investisseur };
    }

    let { message, investisseur } = sj_above_coupon()

    return (
        <>
            <View style={{
                borderColor: 'midnightblue', borderWidth: 0, marginTop: 20, marginBottom : 5
            }}>
                 <Text style={setFont('400', 18, setColor(''), 'Bold')}>Scénario médian:</Text>
            </View>
            <View style={{}}>
            <Text style={setFont('300', 14, setColor(''), 'Regular')}>
                    Baisse du sous-jacent de moins de {Numeral((100 - barr_capital)/100).format('0%')} à l’échéance des {xmax} ans.
                </Text>
            </View>
            <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' , marginTop : 10}}>
                    <View style={{ flex : 1}}>
                        <Text style={[setFont('300', 14, 'gray', 'Regular'), {textDecorationLine: 'underline', }]}>
                            Exemple:
                </Text>
                <Text style={setFont('300', 12, 'gray', 'Regular')}>
                            Perte de {Numeral((100 - remb)/100).format('0%')} du sous jacent.
                </Text>
                <Text style={setFont('300', 12, 'gray', 'Regular')}>
                            {message}
                        </Text>
                        <Text style={setFont('300', 12, 'gray', 'Regular')}>
                            {investisseur}
                        </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity style={{
                            padding: 8, borderRadius: 100, borderWidth: 1,
                            borderColor: 'darkgrey'
                        }} onPress={() => rand_func()} >
                            <MaterialCommunityIcons name='recycle' size={30} style={{ color: 'darkgrey' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
 


        </>
    )

}