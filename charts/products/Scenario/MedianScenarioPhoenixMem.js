import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        let nbcouponrec = 0 ;
        let investisseur = '';

        for (let i = 1; i < coup.length; i++) {
            if (i == coup.length - 1) {
                if (coup[i] > 100 + coupon) {
                    ok.push(i);
                    nbcouponrec = nbcouponrec + (coup[i] -100 - coupon) / coupon
                }
            } else {
                if (coup[i] >= coupon) {
                    ok.push(i)
                    nbcoupon++;
                    nbcouponrec = nbcouponrec + (coup[i] - coupon) / coupon
                } 
            }
        }

        let message;
        if (ok.length > 0) {
            if (ok.length === 1) {
            message = "A l'année " + ok.join(',') + ', la barrière de coupon est dépassée.';
            } else {
            message = 'Aux années ' + ok.join(',') + ', la barrière de coupon est dépassée.';
            }
            
            let listCoupon=[]
            if ( nbcoupon == 1 ) {
            investisseur = "L'investisseur recoit un coupon: "
            } else {
            investisseur = "L'investisseur recoit " + nbcoupon + " coupons: "
            }
            if (ok[ok.length-1] == xmax) {
                ok.pop()
            }
            ok.forEach((val) => { listCoupon.push(coup[val] + "% "); })
            investisseur = investisseur + listCoupon.join(',');
            investisseur = investisseur + "et un remboursement final de " +coup[coup.length -1] + "%. ";
            if ( nbcouponrec == 1 ) {
                investisseur = investisseur + "Un coupon de " + coupon + 
                "% a donc pu être récupéré grâce à l'effet mémoire."
            } else if ( nbcouponrec == 0 ) {
                investisseur = investisseur + "Aucun coupon n'a " +
                "pu être récupéré grâce à l'effet mémoire."
            } else {
                investisseur = investisseur + nbcouponrec + " coupons de " + coupon + 
                "% ont donc pu être récupérés grâce à l'effet mémoire."
            }
        } else {
            message = "La barrière de coupon n'est jamais dépassée."
            investisseur = "L'investisseur recoit uniquement un remboursement final de " +coup[coup.length -1] + "%.";
        }

        return { message, investisseur };
    }

    let { message, investisseur } = sj_above_coupon()

    return (
        <>
            <View style={{
                borderColor: 'midnightblue', borderWidth: 1, paddingVertical: 10,
                paddingHorizontal: 10, marginVertical: 10
            }}>
                <Text style={{ fontSize: 20, color: 'midnightblue' }}>Scénario médian:</Text>
            </View>
            <View style={{}}>
                <Text style={{ fontSize: 16, color: 'midnightblue' }}>
                    baisse du sous-jacent de moins de {100 - barr_capital}% à l’échéance des {xmax} ans.
                </Text>
            </View>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: 300, }}>
                        <Text style={{ fontSize: 16, color: 'dimgrey', textDecorationLine: 'underline', }}>
                            Exemple:
                </Text>
                        <Text style={{ fontSize: 16, color: 'dimgrey' }}>
                            Perte de {100 - remb}% du sous jacent.
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
                <Text style={{ fontSize: 16, color: 'dimgrey' }}>
                {message}
                </Text>
                <Text style={{ fontSize: 16, color: 'midnightblue', fontWeight: 'bold' }}>
                {investisseur}
            </Text>
            </View>

            <View style={{
                backgroundColor: 'darkgrey', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {data.remboursement.y}%</Text>
                <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
                    Retour sur investissement annualisé {(data.tri * 100).toFixed(1)}%</Text>
            </View>
        </>
    )

}