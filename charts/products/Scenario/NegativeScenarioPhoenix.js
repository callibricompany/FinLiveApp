import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setFont, setColor } from '../../../Styles/globalStyle';
import Numeral from 'numeral';

export default function NegativeScenario(
    {
        remb,
        coupon,
        ymin,
        ymax,
        xmax,
        barr_capital,
        barr_anticipe,
        xrel,
        airbag,
        rand_func }
) {

    return (
        <>
            <View style={{
                borderColor: 'midnightblue', borderWidth: 0, marginTop: 20, marginBottom : 5
            }}>
                <Text style={setFont('400', 18, setColor(''), 'Bold')}>Scénario défavorable:</Text>
            </View>
            <View style={{}}>
            <Text style={setFont('300', 14, setColor(''), 'Regular')}>
                    Baisse du sous-jacent de plus de {Numeral((100 - barr_capital)/100).format('0%')} à l’échéance des {xmax} ans. Le sous-jacent
                    est systématiquement en dessous de la barrière de coupon aux dates d'observation.
                </Text>
            </View>
            <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' , marginTop : 10}}>
                    <View style={{ flex : 1}}>
                            <Text style={[setFont('300', 14, 'gray', 'Regular'), {textDecorationLine: 'underline', }]}>
                                    Exemple:
                        </Text>
                        <Text style={setFont('300', 12, 'gray', 'Regular')}>
                                    Perte de {100 - remb}% du sous jacent
                        </Text>
                        <Text style={setFont('300', 12, 'gray', 'Regular')}>
                    L’investisseur reçoit un remboursement partiel de son capital.
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


