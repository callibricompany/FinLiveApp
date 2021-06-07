import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setFont, setColor } from '../../../Styles/globalStyle';
import Numeral from 'numeral';

export default function PositiveScenario(
    {   remb,
        coupon,
        ymin,
        ymax,
        xmax,
        barr_capital,
        barr_anticipe,
        xrel,
        airbag,
        rand_func}
) {

    return (
        <>
            <View style={{
                borderColor: 'midnightblue', borderWidth: 0, marginTop: 20, marginBottom : 5
            }}>
                <Text style={setFont('400', 18, setColor(''), 'Bold')}>Scénario favorable:</Text>
            </View>
            <View style={{}}>
                <Text style={setFont('300', 14, setColor(''), 'Regular')}>
                    Hausse du sous-jacent en année 1, mise en évidence du plafonnement du gain.
                  </Text>
            </View>
            <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' , marginTop : 10}}>
                    <View style={{ flex : 1}}>
                        <Text style={[setFont('300', 14, 'gray', 'Regular'), {textDecorationLine: 'underline', }]}>
                            Exemple:
                        </Text>
                        <Text style={setFont('300', 12, 'gray', 'Regular')}>
                            Hausse de {remb - 100}% du sous jacent
                        </Text>
                        <Text style={setFont('300', 12, 'gray', 'Regular')}>
                            L’investisseur ne reçoit que la hausse partielle du sous-jacent: 100% + coupon ({Numeral(coupon).format('0.00%')}) du fait du plafonnement du gain:
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
