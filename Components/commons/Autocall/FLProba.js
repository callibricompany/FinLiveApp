import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Picker, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';



import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE, isEqual } from '../../../Utils';

import { VictoryGroup, VictoryChart, VictoryBar, VictoryAxis, VictoryStack, VictoryLabel, VictoryScatter, VictoryLegend , VictoryPie, VictoryContainer} from "victory-native";

//import Slider from 'react-native-slider';
import Slider from '@react-native-community/slider';


import Numeral from 'numeral'
import 'numeral/locales/fr'

//mini classe gérant les les couleurs des labels des vitory charts
class CustomLabel extends React.Component {
	render() {
	  const {datum} = this.props;
	  return (
		<VictoryLabel {...this.props} style={{fontSize : 16, fill : datum.labelColor}}/>

	  );
	}
}

export function FLProba ({autocall}) {

    
    const [statsDatas, setStatsDatas] = useState([]);
    const [statsDatasColor, setStatsDatasColor] = useState([]);

    var stats = autocall.getFromPricing('STATS');



    function calculateStats() {
        if (stats !== - 1) {

            //determination des stats
            
            let autocallLevel = Math.round(100 * stats['STATS_AUTOCALL'], 0)
            let digit = Math.max(0, Math.round(100 * stats['STATS_DIGIT'], 0));
            let pdi = 0;
            if (autocall.isPDIUS()) {
                pdi = Math.round(100 * stats['STATS_PDI_US'], 0);
            } else {
                pdi = Math.round(100 * stats['STATS_PDI_EU'], 0);
            }
            let pair = Math.max(0, 100 - autocallLevel  - digit - pdi);
    
            var tempStatsDatas = [];
            var tempStatsDatasColor = [];
            tempStatsDatas.push({y: autocallLevel , labelColor : 'white'});
            tempStatsDatasColor.push(setColor(''));
            if (autocall.isPhoenix()) {
                tempStatsDatas.push({y: digit , labelColor : 'white'});
                tempStatsDatasColor.push(setColor('subscribeBlue'));
            }
            tempStatsDatas.push({y: pair , labelColor : 'white'});
            tempStatsDatasColor.push(setColor('lightBlue'));
            tempStatsDatas.push({y: pdi , labelColor : 'gray'});
            tempStatsDatasColor.push('aliceblue');

            setStatsDatas(tempStatsDatas);
            setStatsDatasColor(tempStatsDatasColor);
        } else {
            setStatsDatas([]);
            setStatsDatasColor([]);            
        }
    }


        

    useEffect(() => {

        if (!isEqual(autocall.getFromPricing('STATS'), stats)) {
            stats = autocall.getFromPricing('STATS');
            calculateStats();
        }

        }, [autocall]);

    useEffect(() => {
        calculateStats();
    
    }, []);
    
    
    
    return (
        <View style={{flexDirection : 'row', marginTop : 0, borderWidth : 0}} opacity={1}>
            <View style={{flex: 0.6, borderWidth : 0}}>
                <VictoryPie data={statsDatas} 
                            //origin={{ x: 0.2*(0.9*getConstant('width') - 10)/2, y: 40 }}
                            origin={{ x: 100, y: 90 }}
                            width={270} 
                            height={270} 
                            colorScale={statsDatasColor} 
                            //labelComponent={props => <VictoryLabel {...props} style={{fontSize : 10, fill : props.labelColor}}/>}
                            labelComponent={<CustomLabel/>}
                            innerRadius={40}  
                            //animate={{ easing: 'exp' }}
                            labels={({ datum }) => datum.y === "" ? "" :  datum.y +"%"}
                            labelRadius={55}
                            startAngle={-120}
                            containerComponent={<VictoryContainer responsive={false}  height={getConstant('width')/2-5} />}
                            
                />
            </View>
            <View style={{flex : 0.40, width : getConstant('width')/5, justifyContent : 'flex-start', alignItems : 'flex-start', borderWidth : 0, marginTop : 5, marginLeft : 10}}>
                <View style={{flexDirection : 'row', borderWidth : 0, alignItems : 'center'}}>

                        <Text style={setFont('200', 14, 'gray', 'Regular')} numberOfLines={1}>
                            Probabilités de :
                        </Text>
                </View>
                <View style={{flexDirection : 'row', borderWidth : 0, alignItems : 'center', marginTop : 10}}>
                    <View style={{ backgroundColor : setColor(''), borderColor : setColor(''), borderWidth : 1, height : 8, width : 8, borderRadius : 4}}/>
                    <View style={{flex : 0.8, borderWidth : 0, paddingLeft : 10, }}>
                        <Text style={setFont('200', 14, 'gray')} >
                            rappel avant échéance
                        </Text>
                    </View>
                </View>
                {autocall.isPhoenix()
                ?
                    <View style={{flexDirection : 'row', borderWidth : 0, alignItems : 'center', marginTop : 5}}>
                        <View style={{ backgroundColor : setColor('subscribeBlue'), borderColor : setColor('subscribeBlue'), borderWidth : 1, height : 8, width : 8, borderRadius : 4}}/>
                        <View style={{flex : 0.8, borderWidth : 0, paddingLeft : 10, }}>
                            <Text style={setFont('200', 14, 'gray')} >
                                coupons payés
                            </Text>
                        </View>
                    </View>
                : null
                }
                <View style={{flexDirection : 'row', borderWidth : 0, alignItems : 'center', marginTop : 5}}>
                    <View style={{ backgroundColor : setColor('lightBlue'), borderColor : setColor('lightBlue'), borderWidth : 1, height : 8, width : 8, borderRadius : 4}}/>
                    <View style={{flex : 0.8, borderWidth : 0, paddingLeft : 10, }}>
                        <Text style={setFont('200', 14, 'gray')} >
                            remboursement au pair
                        </Text>
                    </View>
                </View>
                <View style={{flexDirection : 'row', borderWidth : 0, alignItems : 'center', marginTop : 5}}>
                    <View style={{ backgroundColor : 'aliceblue', borderColor : 'aliceblue', borderWidth : 1, height : 8, width : 8, borderRadius : 4}}/>
                    <View style={{flex : 0.8, borderWidth : 0, paddingLeft : 10, }}>
                        <Text style={setFont('200', 14, 'gray')} >
                            risque sur capital
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

}




