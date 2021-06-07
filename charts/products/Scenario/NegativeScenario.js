import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setFont, setColor } from '../../../Styles/globalStyle';
import Numeral from 'numeral';



export default function NegativeScenario(props) {
    var remb = props.remb;
    var coupon = props.coupon;
    var ymin = props.ymin;
    var ymax = props.ymax;
    var xmax = props.xmax;
    var barr_capital = props.barr_capital ;
    var barr_anticipe = props.barr_anticipe ;

    var width_ratio = props.hasOwnProperty('width') ? props.width : 1;

    return (
        <>
            <View style={{
                borderColor: 'midnightblue', borderWidth: 0, marginTop: 20, marginBottom : 5
            }}>
                <Text style={setFont('400', 18, setColor(''), 'Bold')}>Scénario défavorable:</Text>
            </View>
            <View style={{}}>
            <Text style={setFont('300', 14, setColor(''), 'Regular')}>
                    Baisse du sous-jacent de plus de {100 - barr_capital}% à l’échéance des {xmax} ans.
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
                        }} onPress={() => props.rand_func()} >
                            <MaterialCommunityIcons name='recycle' size={30} style={{ color: 'darkgrey' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View>
       
            </View>


        </>
    )

}


