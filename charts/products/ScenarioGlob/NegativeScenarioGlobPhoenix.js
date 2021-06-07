import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import getRandomInt from '../function/getRandomInt'
import generePathPhoenix from '../function/generePathPhoenix';
import genCouponPhoenix from '../function/genCouponPhoenix';
import genRembPhoenix from '../function/genRembPhoenix';
import getFlux from '../function/getFlux';
import IRR from '../function/IRR';

import NegativeScenarioPhoenix from '../Scenario/NegativeScenarioPhoenix'
import WrapperGraphPayOutPhoenix from '../wrapperGraph/WrapperGraphPayOutPhoenix'

export default function NegativeScenarioGlobPhoenix(props) {
    var coupon = props.coupon;
    var ymin = props.ymin;
    var ymax = props.ymax;
    var xmax = props.xmax;
    var barr_capital = props.barr_capital * 100;
    var barr_anticipe = props.barr_anticipe * 100;
    var barr_coupon = props.barr_coupon * 100;

    var width_ratio = props.hasOwnProperty('width') ? props.width : 1;

    const [scenarioNegatif, setScenarioNegatif] = useState(getRandomInt(barr_capital*0.6, barr_capital*0.97));
    const [data, setData] = useState({
           tri: 0,
           flux: [-100,100],
           dataRandom: [],
           xdataRandom: [],
           ydataRandom: [],
           nLastPoint: 0,
           dataBar: [],
           remboursement: { x:0, y:100}
        })

    let xrel = 0;

    useEffect(() => {
        let dataRandom = generePathPhoenix(xmax, scenarioNegatif, barr_capital, barr_coupon, xrel);
        let nLastPoint = dataRandom[dataRandom.length - 1].x
        let dataBar = genCouponPhoenix(dataRandom, coupon, barr_coupon);
        let remboursement = genRembPhoenix(scenarioNegatif, nLastPoint, coupon, barr_coupon, barr_capital);
        let flux = getFlux( dataBar, remboursement);
        let tri = IRR(flux,0);
        
        setData({
            tri: tri,
            flux: flux,
            dataRandom: dataRandom,
            nLastPoint: nLastPoint,
            dataBar: dataBar,
            remboursement: remboursement
         });

      }, [ scenarioNegatif ]);

    function newScenarioNegatif() {
        let newValue = getRandomInt(barr_capital*0.6, barr_capital*0.97);
        setScenarioNegatif(newValue);
    }

    return (
        <View style={{ paddingBottom: 10 }}>
            <NegativeScenarioPhoenix
                remb={scenarioNegatif}
                coupon={coupon}
                ymin={ymin}
                ymax={ymax}
                xmax={xmax}
                barr_capital={barr_capital}
                barr_anticipe={barr_anticipe}
                barr_coupon={barr_coupon}
                rand_func={() => newScenarioNegatif()}
                data={data}
            />
            <WrapperGraphPayOutPhoenix
                remb={scenarioNegatif}
                coupon={coupon}
                ymin={ymin}
                ymax={ymax}
                xmax={xmax}
                barr_capital={barr_capital}
                barr_anticipe={barr_anticipe}
                barr_coupon={barr_coupon}
                data={data}
                width={width_ratio}
            />
            <View style={{
                backgroundColor: 'red', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10, marginRight : 5
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {scenarioNegatif}%</Text>
                <Text style={{ fontSize: 13, color: 'white' }}>
                    Retour sur investissement annualisé {((Math.pow(scenarioNegatif / 100, 1 / xmax) - 1) * 100).toFixed(1)}%</Text>
            </View>
        </View>
    )

}