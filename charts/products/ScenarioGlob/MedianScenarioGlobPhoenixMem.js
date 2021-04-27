import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import getRandomInt from '../function/getRandomInt'
import generePathPhoenixMem from '../function/generePathPhoenixMem';
import genCouponPhoenixMem from '../function/genCouponPhoenixMem';
import genRembPhoenixMem from '../function/genRembPhoenixMem';
import getFluxMem from '../function/getFluxMem';
import IRR from '../function/IRR';

import MedianScenarioPhoenixMem from '../Scenario/MedianScenarioPhoenixMem'
import WrapperGraphPayOutPhoenixMem from '../wrapperGraph/WrapperGraphPayOutPhoenixMem'

export default function MedianScenarioGlobPhoenixMem({
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
           dataBar: [ { coupon: [ { x:0, y:100} ], missedCoupon: [ { x:0, y:100} ], getBackCoupon: [ { x:0, y:100} ] }],
           remboursement: { x:0, y:100}
        })

    let xrel = 0;

    useEffect(() => {
        let dataRandom = generePathPhoenixMem(xmax, scenarioNeutre, barr_capital, barr_coupon, xrel);
        let nLastPoint = dataRandom[dataRandom.length - 1].x
        let dataBar = genCouponPhoenixMem(dataRandom, coupon, barr_coupon);
        let remboursement = genRembPhoenixMem(scenarioNeutre, nLastPoint, coupon, barr_coupon, barr_capital, 
            dataBar.coupon[dataBar.coupon.length - 1].y + dataBar.getBackCoupon[dataBar.getBackCoupon.length - 1].y);
        // console.log('last coupon :>> ', dataBar.coupon[dataBar.coupon.length - 1].y + dataBar.getBackCoupon[dataBar.getBackCoupon.length - 1].y);
        let flux = getFluxMem( dataBar.coupon, dataBar.getBackCoupon, remboursement);
        // console.log("flux", flux);
        let tri = IRR(flux,0);
        
        setData({
            tri: tri,
            flux: flux,
            dataRandom: dataRandom,
            nLastPoint: nLastPoint,
            dataBar: dataBar,
            remboursement: remboursement
         });

        //  console.log('data :>> ', data);

      }, [ scenarioNeutre ]);

    function newScenarioNeutre() {
        let newValue = getRandomInt(61, 90);
        setScenarioNeutre(newValue);
    }

    return (
        <View style={{ paddingBottom: 10 }}>
            <MedianScenarioPhoenixMem
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
            <WrapperGraphPayOutPhoenixMem
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