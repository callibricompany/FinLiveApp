import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";



import { globalStyle, setFont, setColor} from '../../Styles/globalStyle'
import { getConstant, currencyFormatDE, isAndroid } from '../../Utils';


import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';


export function FollowingDemandeGenerale ({ticket}) {

        
        useEffect(() => {
            //console.log("MAXIMUM DATE CHANGED : " + props.maximumDate);
        }, []);

		return (

            <View style={{width : getConstant('width')*0.95, flexDirection: 'column', justifyContent: 'space-between', marginTop : 10, backgroundColor: 'white',
                                    shadowColor: 'rgb(75, 89, 101)',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.9,
                                    borderWidth :  isAndroid() ? 1 : 1,
                                    borderColor : isAndroid ? 'lightgray' : 'white',
                                    //borderTopLeftRadius: 15,
                                    borderRadius: 10,
                                    height : 170,
                    
                                    backgroundColor: 'white',
            }}>
                <View>

                    <View style={{ustifyContent: 'center', alignItems : 'center', marginTop : 5, paddingHorizontal : 30, borderWidth :  0, paddingTop : 5}}>
                            <Text style={[setFont('400', 16,  'black', 'Regular'), {textAlign : 'center'}]}>
                                Suivi de produit demandé
                            </Text>
                    </View>
                    <View style={{ustifyContent: 'center', alignItems : 'flex-start', marginTop : 5, paddingLeft : 10, borderWidth :  0, paddingTop : 5}}>
                            <Text style={setFont('400', 16,  'gray', 'Regular')}>
                                {ticket.getSubject()}
                            </Text>
                    </View>

                    {/* <View style={{justifyContent: 'center', alignItems : 'flex-start', marginTop : 5, paddingLeft : 10, borderWidth :  0, paddingTop : 0}}>
                            <Text style={[setFont('400', 14,  'gray', 'Regular'), {textAlign : 'center'}]}>
                                Description fournie :
                            </Text>
                    </View> */}

                    <View style={{ustifyContent: 'center', alignItems : 'flex-start', marginTop : 5, paddingLeft : 10, borderWidth :  0, paddingTop : 0}}>
                            <Text style={setFont('400', 14,  'gray', 'Regular')}>
                                {ticket.getDescription()}
                            </Text>
                    </View>

                    <View style={{justifyContent: 'center', alignItems : 'flex-start', marginTop : 5, paddingLeft : 10, borderWidth :  0, paddingTop : 5}}>
                            <Text style={setFont('400', 12,  'black', 'Regular')}>
                                Date de la demande : {Moment(ticket.getCreationDate()).format('ll')}
                            </Text>
                    </View>
                    {/* {ticket.getFrDueBy() > Date.now()
                    ?
                        <View style={{justifyContent: 'center', alignItems : 'flex-start', paddingLeft : 10, borderWidth :  0, paddingTop : 5}}>
                                <Text style={setFont('400', 10,  'black', 'Regular')}>
                                    Date limite de prise en compte : {Moment(ticket.getFrDueBy()).format('lll')}
                                </Text>
                        </View>
                    :
                        <View style={{backgroundColor: 'red', width : 50, padding : 2,alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderRadius: 2, borderWith : 1, borderColor : 'red'}}>
                            <Text style={[setFont('300', 10, 'white', 'Bold'), {textAlign: 'center'}]}>En retard</Text>
                        </View>
                    } */}
                </View> 
                <View style={{ marginBottom : ticket.getStatus() === 2 ? 10 : 0, paddingHorizontal : 20, justifyContent : 'flex-end', alignItems : 'flex-end'}}>
                    <View style={{flexDirection : 'row',}}>
                        <View style={{ paddingHorizontal : 5, paddingVertical : 2}}>
                            <Text style={setFont('400', 12,  'black', 'Regular')}>
                                Statut de la demande :
                            </Text>
                        </View>
                        <View style={{backgroundColor : ticket.getStatus() === 2 ? 'green' : 'red', paddingHorizontal : 5, paddingVertical : 2, borderRadius : 2, borderWidth : 1, borderColor : ticket.getStatus() === 2 ? 'green' : 'red'}}>
                            
                                {ticket.getStatus() === 2 
                                    ?  
                                        <Text style={setFont('400', 12,  'white', 'Regular')}>
                                            {ticket.getStatusName()} 
                                        </Text>
                                    :
                                        <Text style={setFont('400', 12,  'white', 'Regular')}>
                                            en attente
                                        </Text>
                                }

                        </View>

                    </View>
                    {ticket.getStatus() !== 2
                    ?
                        <View style={{ marginBottom : 10, paddingHorizontal : 0, justifyContent : 'flex-end', alignItems : 'flex-end',  borderWidth : 0}}>
                                <Text style={setFont('400', 12,  'black', 'Regular')}>
                                    vérifiez  vos émails
                                </Text>
                        </View>
                    : null
                    }
                </View>
            </View>


		);

}




