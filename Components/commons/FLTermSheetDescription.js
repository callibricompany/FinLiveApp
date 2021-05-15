import React, { useState, useEffect} from 'react';
import {SafeAreaView, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";

import { globalStyle, setFont, setColor} from '../../Styles/globalStyle'
import { getConstant, currencyFormatDE, isAndroid } from '../../Utils';

import NavigationService from '../../Navigation/NavigationService';

import TermSheetAutocallAirbag from '../../charts/products/TermSheetAutocallAirbag';
import TermSheetPhoenixMem from '../../charts/products/TermSheetPhoenixMem';
import TermSheetPhoenix from '../../charts/products/TermSheetPhoenix';
import { CPSRequest } from '../../Classes/Products/CPSRequest';

import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';


function renderChart(autocall, request) {
    console.log("choix : " + autocall.getProductCode());
    switch(autocall.getProductCode()) {
        case 'AUTOCALL_INCREMENTAL' : return  <TermSheetAutocallAirbag request={request} disable={true}/> ; break;
        case 'PHOENIX' : return  <TermSheetPhoenix request={request} disable={true}/> ; break;
        case 'PHOENIX_MEMORY' : return  <TermSheetPhoenixMem request={request} disable={true}/> ; break;
        default : return <Text>Non trouvé</Text>;
    }
}

export default function FLTermSheetDescription ({navigation}) {

        var autocall = navigation.getParam('autocall');
        var request = new CPSRequest() 
        request.setRequestFromCAutocall(autocall);

        useEffect(() => {
            //console.log("USE EFFECT FLTermSheetDescription");
            console.log(autocall.getProductCode());
        }, []);

 


		return (
            <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>

                <View style={{height: getConstant('height')  , backgroundColor : setColor('background'), }}> 
                    <View style={{flexDirection : 'row', borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''), padding : 5, paddingRight : 15, paddingLeft : 15, height : 45}}>
                                    <TouchableOpacity style={{ flex : 0.2, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                                        onPress={() => {
                                         
                                                            NavigationService.goBack();
                                                            //navigation.navigate.goBack();

                                                        }}
                                    >
                                        
                                            <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                        
                                    </TouchableOpacity>
                                    <View style={{flex : 0.6, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                                        <Text style={setFont('400', 18, 'white', 'Regular')}>
                                            {String(autocall.getProductName()).toUpperCase()}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{ flex : 0.2, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}
                                                        onPress={() => {
                                                            this.setState({ isSearchingFriends : !this.state.isSearchingFriends }, () => {
                                                            this.setFriendSections();
                                                            this.setState({ toto : !this.state.toto });
                                                            });
                                                    }}
                                        >
                                            {/* <MaterialCommunityIcons name='plus' size={25}  style={{color : 'white'}}/> */}
                                    </TouchableOpacity>
                    </View> 
                    <View style={{width : getConstant('width')*0.95, marginLeft : 0.025*getConstant('width'), marginBottom : 200}}>
     
                        {renderChart(autocall, request)}

                    </View>


                </View>
            </SafeAreaView>
        );
}
