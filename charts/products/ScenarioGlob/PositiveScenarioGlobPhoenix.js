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

import PositiveScenarioPhoenix from '../Scenario/PositiveScenarioPhoenix';
import WrapperGraphPayOutPhoenix from '../wrapperGraph/WrapperGraphPayOutPhoenix';
import Numeral from 'numeral';

export default function PositiveScenarioGlobPhoenix(props) {
    var coupon = props.coupon;
    var ymin = props.ymin;
    var ymax = props.ymax+10;
    var xmax = props.xmax;
    var barr_capital = props.barr_capital * 100;
    var barr_anticipe = props.barr_anticipe * 100;
    var barr_coupon = props.barr_coupon * 100;

    var width_ratio = props.hasOwnProperty('width') ? props.width : 1;

    const [scenarioPositif, setScenarioPositif] = useState(getRandomInt(1.05*barr_anticipe, 1.15*barr_anticipe));
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

    let xrel = 1;

    useEffect(() => {
        let dataRandom = generePathPhoenix(xmax, scenarioPositif, barr_capital, barr_coupon, xrel);
        let nLastPoint = dataRandom[dataRandom.length - 1].x
        let dataBar = genCouponPhoenix(dataRandom, coupon, barr_coupon);
        let remboursement = genRembPhoenix(scenarioPositif, nLastPoint, coupon, barr_coupon, barr_capital);
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

      }, [ scenarioPositif ]);

    function newScenarioPositif() {
        let newValue = getRandomInt(1.05*barr_anticipe, 1.15*barr_anticipe);
        setScenarioPositif(newValue);
    }

    return (
        <View style={{ paddingBottom: 10 }}>
            <PositiveScenarioPhoenix
                remb={scenarioPositif}
                coupon={coupon}
                ymin={ymin}
                ymax={ymax}
                xmax={xmax}
                barr_capital={barr_capital}
                barr_anticipe={barr_anticipe}
                barr_coupon={barr_coupon}
                rand_func={() => newScenarioPositif()}
                data={data}
            />
            <WrapperGraphPayOutPhoenix
                remb={scenarioPositif}
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
                backgroundColor: 'green', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10, marginRight : 5
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {Numeral(1 + coupon).format('0.00%')}</Text>
                <Text style={{ fontSize: 13, color: 'white' }}>
                    Retour sur investissement annualisé {Numeral(coupon).format('0.00%')}</Text>
            </View>
        </View>
    )

}