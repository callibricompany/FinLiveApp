import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
                borderColor: 'midnightblue', borderWidth: 1, paddingVertical: 10,
                paddingHorizontal: 10, marginVertical: 10
            }}>
                <Text style={{ fontSize: 20, color: 'midnightblue' }}>Scénario défavorable:</Text>
            </View>
            <View style={{}}>
                <Text style={{ fontSize: 16, color: 'midnightblue' }}>
                    baisse du sous-jacent de plus de {100 - barr_capital}% à l’échéance des {xmax} ans.
                </Text>
            </View>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: 300, }}>
                        <Text style={{ fontSize: 16, color: 'dimgrey', textDecorationLine: 'underline', }}>
                            Exemple:
                </Text>
                        <Text style={{ fontSize: 16, color: 'dimgrey' }}>
                            Perte de {100 - remb}% du sous jacent
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
            <View>
                <Text style={{ fontSize: 16, color: 'midnightblue', fontWeight: 'bold' }}>
                    L’investisseur reçoit un remboursement partiel de son capital.
            </Text>
            </View>

            <View style={{
                backgroundColor: 'red', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {remb}%</Text>
                <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
                    Retour sur investissement annualisé {((Math.pow(remb / 100, 1 / xmax) - 1) * 100).toFixed(1)}%</Text>
            </View>
        </>
    )

}


