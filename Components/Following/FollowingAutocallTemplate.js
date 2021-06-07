import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import SwitchSelector from "react-native-switch-selector";

import NavigationService from '../../Navigation/NavigationService';

import { globalStyle, setFont, setColor} from '../../Styles/globalStyle'
import { getConstant, currencyFormatDE, isAndroid, dateDiffInDays } from '../../Utils';
import { interpolateColorFromGradient } from '../../Utils/color';

import { FLTimelineAutocall } from '../commons/Autocall/FLTimelineAutocall';
import { CAutocall2 } from '../../Classes/Products/CAutocall2';

import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';



export default function FollowingAutocallTemplate ({ticket, underlyings, navigation}) {

        var autocall = new CAutocall2(ticket.getProduct());
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
        
        //let color = interpolateColorFromGradient('Rastafari', Math.round(100*colourGradient/100));
        let color = ticket.getPriority().color;
       
        
        useEffect(() => {
            //console.log("MAXIMUM DATE CHANGED : " + props.maximumDate);
            //console.log(ticket.getPriority());
        }, []);
 
  
		return (

            <View style={{width : getConstant('width')*0.95, flexDirection: 'column', justifyContent: 'flex-start', marginTop : 10, backgroundColor: 'white',
                                    shadowColor: ticket.getPriority().color, //'red', //'rgb(75, 89, 101)',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.9,
                                    borderWidth :   1,
                                    borderColor : isAndroid() ? ticket.getPriority().color : 'white',
                                    //borderTopLeftRadius: 15,
                                    borderRadius: 10,
                                    height : 210,
                    
                                    backgroundColor: 'white',
            }}>
                <View style={{justifyContent: 'flex-start', alignItems : 'flex-start', marginTop : 5, paddingHorizontal : 10, marginTop : 5}} >
                        <Text style={[setFont('400', 16,  'black', 'Regular'), {textAlign : 'left'}]} numberOfLines={1}>
                            {autocall.getShortName()/* {autocall.getShortName()} {autocall.getFullUnderlyingName().toUpperCase()} {autocall.getMaturityName()} */}
                        </Text>
                </View>
                <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                    <View style={{justifyContent : 'flex-start', alignItems: 'flex-start',   paddingHorizontal : 10, borderWidth : 0, marginTop : 2}}>
                            <Text style={setFont('400', 12, 'gray', 'Regular')} numberOfLines={1}>
                                ISIN : {autocall.getISIN()}
                            </Text>
                    </View>
                    <View style={{justifyContent : 'flex-end', alignItems: 'center',   paddingHorizontal : 15, borderWidth : 0, marginTop : 2}}>
                            <Text style={setFont('400', 12, 'gray', 'Regular')} numberOfLines={1}>
                                Nominal : {currencyFormatDE(autocall.getNominal())} {autocall.getCurrency()}
                            </Text>
                    </View>
                </View>
                <TouchableOpacity   style={{flexDirection : 'row', justifyContent : 'flex-start'}}
                                    onPress={() => {
                                        NavigationService.navigate('FLTermSheetDescription', { autocall });
                                    }}>
                    <View style={{justifyContent : 'flex-start', alignItems: 'flex-start',   paddingHorizontal : 10, borderWidth : 0, marginTop : 3}}>
                            <Text style={setFont('400', 12, 'gray', 'Italic')} numberOfLines={1}>
                                Produit : {String(autocall.getProductName()).toUpperCase()}
                            </Text>
                    </View>
                    <View style={{justifyContent : 'flex-start', alignItems: 'flex-start',  marginTop : 2}}>
                        <EvilIcons name={'question'} size={20} color={'gray'} />
                    </View>
                </TouchableOpacity>

                {/* <View style={{flexDirection : 'row', marginLeft : 20, marginRight : 20, marginTop : 10}}>
                        <View style={{flex : 0.7}}>
                            <Text style={setFont('200', 12, 'gray')}>ISIN :</Text>
                                    <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                                            <View style={{justifyContent : 'flex-start', alignItems : 'flex-start', padding : 0}}>  
                                                <Text style={setFont('200', 12, setColor('darkBlue'), 'Regular')}>{autocall.getISIN()}</Text>
                                            </View>
                                        
                                    </View>
                        </View>  

                        <View style={{flex : 0.3, backgroundColor : setColor('subscribeBlue'), borderColor :  setColor('subscribeBlue'),  padding : 8, justifyContent : 'center',  alignItems: 'center', margin : 5, borderWidth : 1, borderRadius : 5}}>
                            <Text style={setFont('300', 16, 'white', 'Regular')}>Vendre</Text>
                        </View>  
                
                </View> */}
                <TouchableOpacity   onPress={() => {
                                        //NavigationService.navigate('FLAutocallDetail', { autocall : autocall, isEditable : false, toSave : false});
                                        navigation.navigate('FLAutocallDetail', { autocall : autocall, isEditable : false, toSave : false, showPerf : true, ticket });
                                    }}
                >
                    <View style={{flexDirection : 'row', marginLeft : 0, marginRight : 0, marginTop : 30, height : 70, borderWidth : 0}}>
                        <FLTimelineAutocall autocall={autocall} underlyings={underlyings}  />
                    </View>

                    <View style={{marginBottom : 10, padding : 5, borderRadius : 10, margin : 5, justifyContent : 'center', alignItems : 'center', borderWidth :  2, borderColor : color,  backgroundColor :  'white'}}>
            
                        <Text style={setFont('200',  14,  color, 'Bold')}>
                            {String(nextEventType).toUpperCase()} :  {Moment(nextEventDate).format('ll')} <Text style={setFont('200',  12,  color, 'Regular')}>{Moment(nextEventDate).fromNow()}</Text>
                        </Text>

                    </View>
                </TouchableOpacity>

			</View>


		);

}




