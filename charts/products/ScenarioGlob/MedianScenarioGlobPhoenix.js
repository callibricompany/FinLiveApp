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

import MedianScenarioPhoenix from '../Scenario/MedianScenarioPhoenix'
import WrapperGraphPayOutPhoenix from '../wrapperGraph/WrapperGraphPayOutPhoenix'

export default function MedianScenarioGlobPhoenix({
    coupon,
    ymin,
    ymax,
    xmax,
    barr_capital,
    barr_anticipe,
    barr_coupon,
}) {

    const [scenarioNeutre, setScenarioNeutre] = useState(getRandomInt(61, 90));
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
        let dataRandom = generePathPhoenix(xmax, scenarioNeutre, barr_capital, barr_coupon, xrel);
        let nLastPoint = dataRandom[dataRandom.length - 1].x
        let dataBar = genCouponPhoenix(dataRandom, coupon, barr_coupon);
        let remboursement = genRembPhoenix(scenarioNeutre, nLastPoint, coupon, barr_coupon, barr_capital);
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

      }, [ scenarioNeutre ]);

    function newScenarioNeutre() {
        let newValue = getRandomInt(61, 90);
        setScenarioNeutre(newValue);
    }

    return (
        <View style={{ paddingBottom: 10 }}>
            <MedianScenarioPhoenix
                remb={scenarioNeutre}
                coupon={coupon}
                ymin={ymin}
                ymax={ymax}
                xmax={xmax}
                barr_capital={barr_capital}
                barr_anticipe={barr_anticipe}
                barr_coupon={barr_coupon}
                rand_func={() => newScenarioNeutre()}
                data={data}
            />
            <WrapperGraphPayOutPhoenix
                remb={scenarioNeutre}
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