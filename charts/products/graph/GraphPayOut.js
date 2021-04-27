import React from "react";
import { StyleSheet, View } from "react-native";
import {
    VictoryBar, VictoryChart, VictoryTheme, VictoryLine,
    VictoryScatter, VictoryLabel, VictoryArea, VictoryAxis,
} from "victory-native";

import generePath from '../function/generePath';
import genCoupon from '../function/genCoupon';
import genAxisX from '../function/genAxisX';
import genRemb from '../function/genRemb';

import { Dimensions } from "react-native";
const screenWidth = 0.95 * Dimensions.get("window").width;

export default function GraphPayOutAirbag({ end_under, coupon, ymin, ymax, xmax, barr_capital, barr_anticipe, xrel, airbag }) {

    const dataRandom = generePath(xmax, end_under, xrel);
    const nLastPoint = dataRandom[dataRandom.length-1].x

    const dataBar = genCoupon(dataRandom, coupon, barr_anticipe, airbag, barr_capital);
    const remboursement = genRemb(end_under, nLastPoint, coupon, barr_anticipe, airbag, barr_capital);

    if ( remboursement.y + 5 > ymax ) { 
        ymax = Math.round( remboursement.y/10 )*10+10;
    }

    const dataBarrCapital = [
        { x: 0, y: barr_capital },
        { x: xmax + 1, y: barr_capital },
    ];

    const dataLastPoint = [{ x: nLastPoint, y: end_under, symbol: "circle", size: 4 }];

    const axisX = genAxisX(xmax);

    return (
        <View style={styles.container} >
            <VictoryChart
                width={screenWidth}
                height={250}
                theme={VictoryTheme.material}
                domainPadding={20}
                padding={{ top: 10, bottom: 10, left: 40, right: 40 }}
                maxDomain={{ x: xmax + 1, y: ymax }}
                minDomain={{ x: 0, y: ymin }}>
                {/* <VictoryAxis crossAxis
                    tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    offsetY={166}
                /> */}
                <VictoryAxis dependentAxis crossAxis
                />
                <VictoryBar
                    style={{
                        data: {
                            fill: "#2c2682",
                            fillOpacity: 0.7,
                            // strokeWidth: 3
                        },
                    }}
                    data={dataBar}
                    y0={(d) => 100}
                    barRatio={1.2}
                />
                <VictoryLine
                    style={{
                        data: { stroke: "darkgrey" },
                        parent: { border: "1px solid #ccc" }
                    }}
                    data={[
                        { x: 0, y: 100 },
                        { x: xmax + 1, y: 100 }
                    ]}
                />
                <VictoryScatter
                    style={{
                        data: {
                            fill: "darkgray",
                            stroke: "darkgray",
                            fillOpacity: 0.7,
                            strokeWidth: 2
                        },
                        labels: {
                            fontSize: 12,
                            fill: "darkgray"
                        }
                    }}
                    data={axisX}
                    labels={({ datum }) => (datum.x)}
                    labelComponent={
                        <VictoryLabel verticalAnchor='start' textAnchor='middle' dy={5} />
                    }
                />
                <VictoryScatter
                    style={{
                        data: {
                            fill: "darkgray",
                            stroke: "darkgray",
                            fillOpacity: 0.7,
                            strokeWidth: 2
                        },
                        labels: {
                            fontSize: 13,
                            fill: "black"
                        }
                    }}
                    data={[{ x: xmax + 1, y: 100, symbol: "diamond", size: 2 }]}
                    labels={() => ('Année')}
                    labelComponent={
                        <VictoryLabel verticalAnchor='start' textAnchor='middle' dy={5} />
                    }
                />
                <VictoryScatter
                    style={{
                        data: {
                            fill: "darkgray",
                            stroke: "darkgray",
                            fillOpacity: 0.7,
                            strokeWidth: 2
                        },
                        labels: {
                            fontSize: 13,
                            fill: "black"
                        }
                    }}
                    data={[{ x: 0, y: ymax, symbol: "diamond", size: 2 }]}
                    labels={() => ('Niveau %')}
                    labelComponent={
                        <VictoryLabel verticalAnchor='start' textAnchor='start' dx={10} />
                    }
                />
                <VictoryArea
                    style={{
                        data: {
                            fill: "#fce3e8",
                        },
                        labels: {
                            fontSize: 15,
                            fontWeight: 'bold',
                            fill: "#c43a31"
                        }
                    }}
                    data={dataBarrCapital}
                    labels={({ datum }) => (datum.x == 0 ? ['↓Perte en', '    capital'] : '')}
                    labelComponent={
                        <VictoryLabel
                            verticalAnchor="middle" textAnchor="start" dy={20}
                        />
                    }
                />
                <VictoryLine
                    interpolation="natural"
                    style={{
                        data: { stroke: "#CCC" }
                    }}
                    data={dataRandom}
                />
                <VictoryScatter
                    style={{
                        data: { fill: "#CCC" },
                        labels: {
                            fontSize: 12,
                            fill: "darkgrey",
                            fontWeight: 'bold'
                        }
                    }}
                    size={7}
                    data={dataLastPoint}
                    labels={() => (end_under < barr_capital ? '' : end_under + '%')}
                    labelComponent={
                        <VictoryLabel
                            verticalAnchor='start'
                            textAnchor='start'
                            dx={10}
                            dy={-8}
                        />
                    }
                />
                <VictoryLine
                    style={{
                        data: { stroke: "#c43a31", strokeDasharray: "3,3" },
                        parent: { border: "1px solid #ccc" }
                    }}
                    data={[
                        { x: 0, y: barr_capital },
                        { x: xmax + 1, y: barr_capital }
                    ]}
                />
                <VictoryLine
                    style={{
                        data: { stroke: "orange", strokeDasharray: "3,3" },
                        parent: { border: "1px solid #ccc" }
                    }}
                    data={[
                        { x: 0, y: barr_anticipe },
                        { x: xmax - 1, y: barr_anticipe }
                    ]}
                />
                <VictoryScatter
                    style={{
                        data: {
                            fill: "gold",
                            stroke: "gold",
                            fillOpacity: 0.85,
                            strokeWidth: 2
                        },
                        labels: {
                            fontSize: 15,
                            fontWeight: 'bold',
                            fill: "#f0c200"
                        }
                    }}
                    data={[
                        {
                            x: remboursement.x, y: remboursement.y, symbol: "star", size: 5
                        }
                    ]}
                    labels={({ datum }) => (end_under < 100 || nLastPoint > xmax/2 ? "Remboursement final:" + datum.y + "%   " :
                        "    Remboursement final:" + datum.y + "%")}
                    labelComponent={
                        <VictoryLabel
                            verticalAnchor={() => ("middle")}
                            textAnchor={() => (end_under < 100 || nLastPoint > xmax / 2 ? "end" : "start")}
                            dx={() => (remboursement.y === 100 ? 35 : 0)}
                            dy={() => (remboursement.y === 100 ? -20 : 0)}
                        />
                    }
                />
            </VictoryChart>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
    }
});