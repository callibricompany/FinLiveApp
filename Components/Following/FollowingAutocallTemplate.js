import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";



import { globalStyle, setFont, setColor} from '../../Styles/globalStyle'
import { getConstant, currencyFormatDE, isAndroid } from '../../Utils';

import { FLTimelineAutocall } from '../commons/Autocall/FLTimelineAutocall';

import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';


export function FollowingAutocallTemplate ({autocall, underlyings}) {

        
        useEffect(() => {
            //console.log("MAXIMUM DATE CHANGED : " + props.maximumDate);
        }, []);
 
        let valo = 0.94+ Math.random()/10;
		let alea = Math.random();
		return (

            <View style={{width : getConstant('width')*0.95, flexDirection: 'column', justifyContent: 'space-around', marginTop : 10, backgroundColor: 'white',
                                    shadowColor: 'rgb(75, 89, 101)',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.9,
                                    borderWidth :  isAndroid() ? 1 : 1,
                                    borderColor : isAndroid ? 'lightgray' : 'white',
                                    //borderTopLeftRadius: 15,
                                    borderRadius: 10,
                                    height : 200,
                    
                                    backgroundColor: 'white',
            }}>
                <View style={{justifyContent: 'flex-start', alignItems : 'flex-start', marginTop : 5, paddingHorizontal : 10}} >
                        <Text style={[setFont('400', 16,  'black', 'Regular'), {textAlign : 'left'}]}>
                            {autocall.getShortName()/* {autocall.getShortName()} {autocall.getFullUnderlyingName().toUpperCase()} {autocall.getMaturityName()} */}
                        </Text>
                </View>
                <View style={{justifyContent : 'flex-start', alignItems: 'flex-start',   paddingHorizontal : 10, borderWidth : 0}}>
                        <Text style={setFont('400', 12, 'gray', 'Regular')} numberOfLines={1}>
                            ISIN : {autocall.getISIN()}FR12444252667
                        </Text>
                </View>

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

                <View style={{flexDirection : 'row', marginLeft : 0, marginRight : 0, marginTop : 5, height : 60, borderWidth : 0}}>
                    <FLTimelineAutocall autocall={autocall} underlyings={underlyings}/>
                        {/* <View style={{flex : 0.33, justifyContent : 'flex-start', alignItems : 'center',  borderWidth : 0}}>
                            <View style={{borderWidth : 0, justifyContent : 'flex-start', height : 35}}>
                                <Text style={setFont('200', 12, 'gray')}>Nominal</Text>
                            </View>
                            <View style={{borderWidth : 0, flexDirection : 'row'}}>
                                    <View style={{justifyContent : 'flex-start', alignItems : 'flex-start', padding : 0}}>  
                                        <Text style={setFont('200', 14, setColor('darkBlue'), 'Regular')}>{currencyFormatDE(autocall.getNominal())}  </Text>
                                    </View>
                                    <View style={{justifyContent : 'center', alignItems : 'center', paddingRight : 3}}>  
                                        <Text style={setFont('200', 14, setColor('darkBlue'), 'Regular')}>{autocall.getCurrency()}</Text>
                                    </View>
                            </View>
                        </View>  

                        <View style={{flex : 0.33, justifyContent : 'flex-start', alignItems : 'center',  borderWidth : 0}}>
                            <View style={{borderWidth : 0, justifyContent : 'flex-start', height : 35}}>
                                <Text style={[setFont('200', 12, 'gray'), {textAlign : 'center'}]} >Prochaine{'\n'}observation</Text>
                            </View>
                            <View style={{borderWidth : 0, flexDirection : 'row', justifyContent: 'center'}}>
                                        <Text style={setFont('200', 14, setColor('darkBlue'), 'Regular')}> 24/12/2027 </Text>
                            </View>
                        </View>  
                        <View style={{flex : 0.33, justifyContent : 'flex-start', alignItems : 'center',  borderWidth : 0}}>
                            <View style={{borderWidth : 0, justifyContent : 'flex-start', height : 35}}>
                                <Text style={setFont('200', 12, 'gray')}>Maturité</Text>
                            </View>
                            <View style={{borderWidth : 0, flexDirection : 'row', justifyContent: 'center'}}>
                                        <Text style={setFont('200', 14, setColor('darkBlue'), 'Regular')}>{Moment(autocall.getLastConstatDate()).format('DD/MM/YYYY')}</Text>
                            </View>
                        </View>  */}
                </View>

                <View style={{marginBottom : 10, padding : 5, borderRadius : 10, margin : 5, justifyContent : 'center', alignItems : 'center', borderWidth : alea > 0.5 ? 0 : 2, borderColor : 'green',  backgroundColor :  alea > 0.5 ? 'transparent' : 'white'}}>
                
                            <Text style={setFont('200', alea > 0.5 ?  10 : 14,  alea > 0.5 ? 'gray' : 'green', alea > 0.5 ? 'Regular' : 'Bold')}>{String( alea > 0.5 ? "pas d'évènement prévu" : "rappel imminent").toUpperCase()}</Text>
            
                </View>

			</View>


		);

}




