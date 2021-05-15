import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import SwitchSelector from "react-native-switch-selector";

import NavigationService from '../../../Navigation/NavigationService';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE, isAndroid, dateDiffInDays } from '../../../Utils';
import { interpolateColorFromGradient } from '../../../Utils/color';

import { FLTimelineAutocall } from './FLTimelineAutocall';

import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';


function headerFLFollowingAutocall(autocall, underlyings) {
    if (autocall.isClosed()) {
        return (
            <View style={{flexDirection : 'row', marginTop : 10, height : 70, borderWidth : 0}}>
               <Text>Le produit a expiré le {Moment(autocall.getLastConstatDate().toString()).format('ll')}</Text>
            </View>
        );
    }

    if (autocall.isAlreadyCalled()) {
        var data = autocall.getDataFromCalled();
  
        return (
            <View>
                <View style={{marginBottom : 5, marginTop : 10}}>
                    <Text style={setFont('200', 12, 'black')}>Le produit a été rappelé le {Moment(data['date']).format('ll')}</Text>
                </View>
                <View style={{flexDirection : 'row'}}>
                    <View style={{flex : 0.6}}>
                        <Text style={setFont('200', 12, 'gray')}>Performance</Text>
                    </View>
                    <View style={{flex : 0.4}}>
                        <Text style={setFont('200', 12, 'gray')}>{Numeral(data['perf']).format('0.00%')}</Text>
                    </View>
                </View>
                <View style={{flexDirection : 'row'}}>
                    <View style={{flex : 0.6}}>
                        <Text style={setFont('200', 12, 'gray')}>Niveau de rappel</Text>
                    </View>
                    <View style={{flex : 0.4}}>
                        <Text style={setFont('200', 12, 'gray')}>{Numeral(data['level']).format('0.00%')}</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View>
            <View style={{flexDirection : 'row', marginLeft : -30, marginRight : 0, marginTop : 30, height : 70, borderWidth : 0}}>
                <FLTimelineAutocall autocall={autocall} underlyings={underlyings}  />
            </View>

        </View>
    );
}

function renderEvent(event, currentPerf) {
    var profaneName = "";
    if (event.hasOwnProperty('FORMULA')) {
        switch(event['FORMULA']) {
            case 'AUTOCALL' :
                profaneName = 'rappel';
                break;
            case 'DIGIT' :
                profaneName = 'coupon';
                break;
            case 'PDI_EU' :
                profaneName = 'risque capital';
                break;
            case 'PDI_US' :
                profaneName = 'risque capital';
                break;
            default : break;
        }
    }
    return (
        <View style={{marginTop : 5}}>

            <View style={{flexDirection : 'row'}}>
                <View style={{flex : 0.6}}>
                    <Text style={setFont('200', 14, 'black', 'Regular')}>{profaneName.toUpperCase()}</Text>
                </View>
                <View style={{flex : 0.4}}>
                    <Text style={setFont('200', 14, 'black')}>{Moment(event['DATE']).format('ll')}</Text>
                </View>
            </View>
            <View style={{flexDirection : 'row'}}>
                <View style={{flex : 0.6}}>
                    <Text style={setFont('200', 14, 'black')}>Niveau {profaneName}</Text>
                </View>
                <View style={{flex : 0.4}}>
                    <Text style={setFont('200', 14, 'black')}>{Numeral(event['LEVEL']).format('0.00%')}</Text>
                </View>
            </View>


        </View>
    );
}

export default function FLFollowingAutocall ({autocall, underlyings}) {

        var spotLevels = {};
        //recuperation des spots
        var strikingLevels = autocall.getStrikingLevels();
        underlyings.forEach((udl) => {
            if (udl.hasOwnProperty('ticker') && udl.hasOwnProperty('closeprice')) {
                if (Object.keys(strikingLevels).includes(udl['ticker'])) {
                    spotLevels[udl['ticker']] = udl['closeprice'];
                }
            }
        });
        autocall.setSpots(spotLevels);
        var perfs = autocall.getPerformances();
        var currentPerf = perfs['GLOBAL_PERF'];

        var nextEvent = autocall.getNextEvent();
        var nextEventDate = Date.now();
        var nextEventLevel = 1;
        var nextEventType = '';
    
        

        nextEvent.forEach((event) => {
            if (event.hasOwnProperty('DATE') && event['DATE'] > nextEventDate) {
                nextEventDate = event['DATE'];
                if (event.hasOwnProperty('LEVEL')) {
                    nextEventLevel = event['LEVEL'];
                }
            }
            if (event.hasOwnProperty('FORMULA')) {
                let profaneName = '';
                switch(event['FORMULA']) {
                    case 'AUTOCALL' :
                        profaneName = 'rappel';
                        break;
                    case 'DIGIT' :
                        profaneName = 'coupon';
                        break;
                    case 'PDI_EU' :
                        profaneName = 'risque capital';
                        break;
                    case 'PDI_US' :
                        profaneName = 'risque capital';
                        break;
                    default : break;
                }
                if (nextEventType === '') {
                    nextEventType = profaneName;
                } else {
                    if (nextEvent.length > 2) {
                        nextEventType = nextEventType + ", " + profaneName;
                    } else {
                        nextEventType = nextEventType + " et " + profaneName;
                    }
                }
                

            }

        });
        
        var diffDays = dateDiffInDays(new Date(Date.now()), nextEventDate);
        let colourGradient = 0;
        if (diffDays < 11) {
            if (Math.abs(currentPerf - nextEventLevel) < 0.1) {
                colourGradient = 100 - diffDays * Math.abs(currentPerf - nextEventLevel)
            }
            
        }
        var underlyingsNames = autocall.getUnderlyingsList();

        let color = interpolateColorFromGradient('Rastafari', Math.round(100*colourGradient/100));
        
        useEffect(() => {
            //console.log("MAXIMUM DATE CHANGED : " + props.maximumDate);
        }, []);
   
  
		return (

            <View>

                    {headerFLFollowingAutocall(autocall, underlyings)}
                    <View style={{marginBottom : 5, marginTop : 10}}>
                            <Text style={setFont('200', 14, 'gray')}>{nextEvent.length > 1 ? "Prochains évenements" : "Prochain évènement"} : </Text>
                    </View>
                    {
                        nextEvent.map((event) => {
                            return(
                                <View key={event['FORMULA']}>
                                    {renderEvent(event, currentPerf)}
                                </View>
                            )
                        })
                    }
                    <View style={{flexDirection : 'row', marginTop : 10}}>
                        <View style={{flex : 0.6}}>
                            <Text style={setFont('200', 14, 'black', 'Regular')}>Performance actuelle</Text>
                        </View>
                        <View style={{flex : 0.4}}>
                            <Text style={setFont('200', 14, 'black',  'Regular')}>{Numeral(currentPerf).format('0.00%')}</Text>
                        </View>
                    </View>
                    {Object.keys(perfs).map((perfKey) => {
                            if (perfKey !== 'GLOBAL_PERF') {
                                return (
                                    <View style={{flexDirection : 'row'}} key={String(spotLevels[perfKey])}>
                                        <View style={{flex : 0.6}}>
                                            <Text style={setFont('200', 14, 'black')}>{underlyingsNames[perfKey]}</Text>
                                        </View>
                                        <View style={{flex : 0.4}}>
                                            <Text style={setFont('200', 14, 'black')}>{spotLevels[perfKey]}</Text>
                                        </View>
                                    </View>
                                );
                            }                        
                            
                        })
                        
                    }
                    {/* <View style={{marginBottom : 10, padding : 5, borderRadius : 10, margin : 5, justifyContent : 'center', alignItems : 'center', borderWidth :  2, borderColor : color,  backgroundColor :  'white'}}>
                        <Text style={setFont('200',  14,  color, 'Bold')}>
                            {String(nextEventType).toUpperCase()} :  {Moment(nextEventDate).format('ll')} ({Moment(nextEventDate).fromNow()})
                        </Text>
                    </View> */}
                    <View>
                        <View>

                        </View>
                    </View>

			</View>


		);

}




