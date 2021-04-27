import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
                borderColor: 'midnightblue', borderWidth: 1, paddingVertical: 10,
                paddingHorizontal: 10, marginVertical: 10
            }}>
                <Text style={{ fontSize: 20, color: 'midnightblue' }}>Scénario favorable:</Text>
            </View>
            <View style={{}}>
                <Text style={{ fontSize: 16, color: 'midnightblue' }}>
                    hausse du sous-jacent en année 1, mise en évidence du plafonnement du gain.
                  </Text>
            </View>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: 300, }}>
                        <Text style={{ fontSize: 16, color: 'dimgrey', textDecorationLine: 'underline', }}>
                            Exemple:
                  </Text>
                        <Text style={{ fontSize: 16, color: 'dimgrey' }}>
                            Hausse de {remb - 100}% du sous jacent
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
                    L’investisseur ne reçoit que la hausse partielle du sous-jacent: 100% + coupon ({coupon}%) du fait du plafonnement du gain:
              </Text>
            </View>
            <View style={{
                backgroundColor: 'green', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {100 + coupon}%</Text>
                <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
                    Retour sur investissement annualisé {coupon}%</Text>
            </View>
        </>
    )

}
