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

export default function NegativeScenarioGlobPhoenix({
    coupon,
    ymin,
    ymax,
    xmax,
    barr_capital,
    barr_anticipe,
    barr_coupon,
}) {

    const [scenarioNegatif, setScenarioNegatif] = useState(getRandomInt(44, 58));
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
        let newValue = getRandomInt(44, 58);
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
            />
        </View>
    )

}