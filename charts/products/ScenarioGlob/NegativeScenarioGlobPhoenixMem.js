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

import NegativeScenarioPhoenixMem from '../Scenario/NegativeScenarioPhoenixMem'
import WrapperGraphPayOutPhoenixMem from '../wrapperGraph/WrapperGraphPayOutPhoenixMem'
import Numeral from 'numeral';

export default function NegativeScenarioGlobPhoenixMem(props) {
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
            dataBar: [ { coupon: [ { x:0, y:100} ], missedCoupon: [ { x:0, y:100} ], getBackCoupon: [ { x:0, y:100} ] }],
            remboursement: { x:0, y:100}
        })

    let xrel = 0;

    useEffect(() => {

        let dataRandom = generePathPhoenixMem(xmax, scenarioNegatif, barr_capital, barr_coupon, xrel);
        let nLastPoint = dataRandom[dataRandom.length - 1].x
        let dataBar = genCouponPhoenixMem(dataRandom, coupon, barr_coupon);
        let remboursement = genRembPhoenixMem(scenarioNegatif, nLastPoint, coupon, barr_coupon, barr_capital,
            dataBar.coupon[dataBar.coupon.length - 1].y + dataBar.getBackCoupon[dataBar.getBackCoupon.length - 1].y);
        let flux = getFluxMem( dataBar.coupon, dataBar.getBackCoupon, remboursement);
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
            <NegativeScenarioPhoenixMem
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
            <WrapperGraphPayOutPhoenixMem
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