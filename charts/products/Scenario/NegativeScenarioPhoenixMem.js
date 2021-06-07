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
                    Baisse du sous-jacent de plus de {Numeral((100 - barr_capital)/100).format('0.00%')} à l’échéance des {xmax} ans. Le sous-jacent
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
                                    Perte de {Numeral((100 - remb)/100).format('0%')} du sous jacent
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
  
{/* 
            <View style={{
                backgroundColor: 'red', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {remb}%</Text>
                <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
                    Retour sur investissement annualisé {((Math.pow(remb / 100, 1 / xmax) - 1) * 100).toFixed(1)}%</Text>
            </View> */}
        </>
    )

}


