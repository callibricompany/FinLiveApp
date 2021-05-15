import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";

import { VictoryScatter, VictoryChart, VictoryBar, VictoryStack, VictoryAxis, VictoryLabel, VictoryLegend } from "victory-native";

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle';
import { getConstant, currencyFormatDE, isAndroid } from '../../../Utils';


import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';



export function FLTimelineAutocall ({autocall, underlyings}) {
        //autocall.getAutocallLevel()
        var barrierPDI = 0;
        var barrierPDIStack = 0;
        var barrierPDILevel = 0;
        var barrierPDILevelDistance = 0;

        var barrierPhoenix = 0;
        var barrierPhoenixStack = 0;
        var barrierPhoenixLevel = 0;
        var barrierPhoenixLevelDistance = 0;

        var barrierAutocall = 0;
        var barrierAutocallStack = 0;
        var barrierAutocallLevel = 0;
        var barrierAutocallLevelDistance = 0;

        var rightStack = 10;
        var perfStack = 1;

        //var barrierPhoenix = autocall.getBarrierPhoenix();
        
        var strikingLevels = autocall.getStrikingLevels();
        //console.log(strikingLevels);
        //var udlsTickers = autocall.getUnderlyingTickers();
        
        var spotLevels = {};
        //recuperation des spots
        underlyings.forEach((udl) => {
            if (udl.hasOwnProperty('ticker') && udl.hasOwnProperty('closeprice')) {
                if (Object.keys(strikingLevels).includes(udl['ticker'])) {
                    spotLevels[udl['ticker']] = udl['closeprice'];
                }
            }
        });


        autocall.setSpots(spotLevels);

        var perfs = autocall.getPerformances();


        var ticker = autocall.getUnderlyingTickers();
        var isMono = autocall.isMono();
        var perfIndexOnMainBar = perfs['GLOBAL_PERF'];
        if (isMono) {
            
            if (spotLevels.hasOwnProperty(ticker)) {
                perfIndexOnMainBar = spotLevels[ticker];
            }
        }

        var evt_PDI_EU = autocall.getNextEventByFormula('PDI_EU');
        var evt_PDI_US = autocall.getNextEventByFormula('PDI_US');
        var evt_DIGIT = autocall.getNextEventByFormula('DIGIT');
        var evt_AUTOCALL = autocall.getNextEventByFormula('AUTOCALL');



        if (Object.keys(evt_PDI_EU).length > 0 || Object.keys(evt_PDI_US).length > 0) {
            if (Object.keys(evt_PDI_EU).length > 0) {
                barrierPDI = evt_PDI_EU['LEVEL'];
                if (isMono && Object.keys(strikingLevels).includes(ticker)) {
                    barrierPDILevel = barrierPDI * strikingLevels[ticker];
                    barrierPDILevelDistance = (barrierPDI * strikingLevels[ticker] / perfIndexOnMainBar) - 1;
                }
            }
            barrierPDIStack = 10;
        }

        if (Object.keys(evt_DIGIT).length > 0) {
            barrierPhoenix = evt_DIGIT['LEVEL'];
            if (isMono && Object.keys(strikingLevels).includes(ticker)) {
                barrierPhoenixLevel = barrierPhoenix * strikingLevels[ticker];
                barrierPhoenixLevelDistance = barrierPhoenix * strikingLevels[ticker] / perfIndexOnMainBar - 1;
            }
            barrierPhoenixStack = Math.abs(barrierPhoenix  - barrierPDI) * 100;
        }

        if (Object.keys(evt_AUTOCALL).length > 0) {
            barrierAutocall = evt_AUTOCALL['LEVEL'];
            if (isMono && Object.keys(strikingLevels).includes(ticker)) {
                barrierAutocallLevel = barrierAutocall * strikingLevels[ticker];
                barrierAutocallLevelDistance =(barrierAutocall * strikingLevels[ticker] / perfIndexOnMainBar) - 1;
            }
            let start = Object.keys(evt_DIGIT).length > 0 ? barrierPhoenix : barrierPDI;
            barrierAutocallStack = Math.abs(barrierAutocall  - start) * 100;
        }

        if (perfs['GLOBAL_PERF'] > barrierAutocall) {
            rightStack = 10 + (perfs['GLOBAL_PERF'] - barrierAutocall) * 100;
        }

        //norme par rapport à 100 des stacks
        perfStack = 100 * (perfs['GLOBAL_PERF']  - barrierPDI) + barrierPDIStack;
        let sum = rightStack + barrierAutocallStack + barrierPhoenixStack + barrierPDIStack + 10;
        rightStack = rightStack * 100 / sum;
        barrierAutocallStack = barrierAutocallStack * 100 / sum;
        barrierPhoenixStack = barrierPhoenixStack * 100 / sum;
        barrierPDIStack = barrierPDIStack * 100 / sum;
        perfStack = perfStack * 100 / sum;


        var pdiLegend = { name: "Perte capital", symbol: { fill: 'tomato', type: "square" } };
        var couponPhoenixLegend =  { name: "Coupon", symbol: { fill: 'lightgreen', type: "square"} };
        var autocallLevelLegend = { name: "Rappel", symbol: { fill: 'seagreen', type: "square" } };
        var legend = [];
        switch(autocall.getProductCode()) {
            case 'AUTOCALL_INCREMENTAL' :
                legend.push(pdiLegend);
                legend.push(autocallLevelLegend);
                break;
            case 'AUTOCALL_CLASSIC' :
                legend.push(pdiLegend);
                legend.push(autocallLevelLegend);
                break;
            case 'PHOENIX' :
                    legend.push(pdiLegend);
                    legend.push(couponPhoenixLegend);
                    legend.push(autocallLevelLegend);
                    break;
            case 'PHOENIX_MEMORY' :
                    legend.push(pdiLegend);
                    legend.push(couponPhoenixLegend);
                    legend.push(autocallLevelLegend);
                    break;
            case 'REVERSE' :
                    legend.push(pdiLegend);
                    break;
            default : break;
        }

        
        useEffect(() => {
            //console.log("MAXIMUM DATE CHANGED : " + props.maximumDate);
        }, []);
 
        //console.log(spotLevels);
		return (

            <View style={{flex : 1}}>
                <View style={{borderWidth: 0, justifyContent : 'flex-start' , marginTop : -35}}>
                    <VictoryChart width={getConstant('width')*0.95} height={105}>
                        <VictoryAxis style={{
                            axis: {stroke: "transparent"},
                            ticks: {stroke: "transparent"},
                            tickLabels: { fill:"transparent"}
                        }} />
                        <VictoryStack
                            style={{
                                data: { stroke: "grey", strokeWidth: 0}
                            }}
                            > 
                            <VictoryBar horizontal
                                style={{ data: { fill: "tomato" } }}
                                data={[{x: "a", y: barrierPDIStack}]}
                                barRatio={2}
                            />
                            <VictoryBar horizontal
                                style={{ data: { fill: "red" } }}
                                data={[{x: "a", y: 0.5}]}
                                barRatio={3}
                                labels={() => [Numeral(barrierPDILevel).format("0.00"), Numeral(barrierPDILevelDistance).format("0.00%")]}
                                labelComponent={<VictoryLabel 
                                    dy={-22}
                                    textAnchor="middle"   
                                    style={[
                                        { fontSize : 12, fill: 'gray'},
                                        { fontSize : 10, fill: barrierPDILevelDistance >= 0 ? "green" : "red", opacity: 0.7 },
                                      ]}   
                                />}
                            />
                            {barrierPhoenixStack !== 0
                            ?
                                <VictoryBar
                                    style={{ data: { fill: "lightgrey" } }}
                                    data={[{x: "a", y: barrierPhoenixStack}]}
                                    barRatio={2}
                        
                                />
                                : null }
                            {barrierPhoenixStack !== 0
                            ?
                                <VictoryBar horizontal
                                    style={{ data: { fill: "green" } }}
                                    data={[{x: "a", y: 0.5}]}
                                    barRatio={3}
                                    labels={() => [Numeral(barrierPhoenixLevel).format("0.00"), Numeral(barrierPhoenixLevelDistance).format("0.00%")]}
                                    labelComponent={<VictoryLabel 
                                        dy={-22}
                                        textAnchor="end"    
                                        style={[
                                            { fontSize : 12, fill: 'gray'},
                                            { fontSize : 10, fill: barrierPhoenixLevelDistance >= 0 ? "green" : "red", opacity: 0.7 },
                                          ]} 
                                    />}
                                />
                            : 
                                null
                            }
                            {barrierAutocallStack !== 0
                            ?
                                <VictoryBar
                                    style={{ data: { fill: barrierPhoenixStack === 0 ? "lightgrey" : "lightgreen" } }}
                                    data={[{x: "a", y: barrierAutocallStack}]}
                                    barRatio={2}
                        
                                />
                                : null }
                            {barrierAutocallStack !== 0
                            ?
                                <VictoryBar horizontal
                                    style={{ data: { fill: "green" } }}
                                    data={[{x: "a", y: 0.5}]}
                                    barRatio={3}
                                    //labels={barrierAutocallLevel}
                                    labels={() => [Numeral(barrierAutocallLevel).format('0.00'), Numeral(barrierAutocallLevelDistance).format("0.00%")]}
                                    labelComponent={<VictoryLabel 
                                        //dx={30}
                                        dy={-22}
                                        textAnchor={"end"}     
                                        style={[
                                            { fontSize : 12, fill: 'gray'},
                                            { fontSize : 10, fill: barrierAutocallLevelDistance >= 0 ? "green" : "red", opacity: 0.7 },
                                          ]}
                                    />}
                                />
                            : 
                                null
                            }
                            <VictoryBar
                                style={{ data: { fill: barrierAutocallStack === 0 ? "lightgreen" : "seagreen" } }}
                                data={[{x: "a", y: rightStack}]}
                                barRatio={2}
                            />
                        </VictoryStack>
                        <VictoryScatter
                                style={{
                                    data: {
                                            fill: 'white',
                                            stroke: 'white',
                                            fillOpacity: 1,
                                            strokeWidth: 2
                                        }
                                }}
                                data={[ { x: "a", y: perfStack, symbol: "diamond", size: 4 } ]}
                                labels={({ datum }) => ([perfIndexOnMainBar, autocall.getFullUnderlyingNames().toString()])}
                                labelComponent={<VictoryLabel  
                                    verticalAnchor={() => ("middle")} 
                                    textAnchor={() => ("middle")}
                                    dx={() => (0)}
                                    dy={() => (25)} 
                                    style={[
                                        { fill: setColor(''),  fontSize: 14 },
                                        { fill: setColor(''), fontSize: 10 }
                                      ]}/> }

                        />
                        <VictoryLegend x={getConstant('width')/6} y={90}
                                      //title="Legend"
                                      centerTitle
                                      orientation={'horizontal'}
                                      gutter={20}
                                      //height={100}
                                      style={{ labels: {fontSize: 11 } }}
                                      borderPadding={5}
                                      symbolSpacer={1}
                                      labelComponent={<VictoryLabel  dx={3} style={{fontSize : isAndroid() ? 10 : 12, fill : 'gray'}} />}
                                      data={legend}
                                      
                      />
                    </VictoryChart>


                </View>

			</View>


		);

}




