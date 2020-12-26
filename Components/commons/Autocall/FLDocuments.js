import React, { useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";

import * as WebBrowser from 'expo-web-browser';


import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';


import Numeral from 'numeral'
import 'numeral/locales/fr'





export function FLDocuments ({autocall}) {

        var uriDescriptionFile = autocall.getURIDescription();
        return (
            <View style={{}}
                      
            >
              <View style={{justifyContent: 'flex-start',  margin: 5, marginRight : 10}}>
                        <Text style={setFont('400', 12, 'black','Regular')}>
                          Retrouvez tous les documents relatifs au produit
                        </Text>
              </View>
      
              <View style={{flexDirection: 'row', marginTop : 20}}>

              <View style={{flex : 1, justifyContent: 'center'}}>
                <View style={{height : 10, borderBottomWidth : 0, borderBottomColor : 'lightgray'}} />

                      <TouchableOpacity style={{flexDirection : 'row', height : 60}}
                                          onPress={() => {
                                            WebBrowser.openBrowserAsync(uriDescriptionFile, { enableBarCollapsing: true, showTitle: true });
                                          }}
                        >
                    
                              <View style={{ borderWidth : 0, justifyContent: 'center', justifyContent : 'center', padding : 5}}>
                                    <MaterialCommunityIcons name={'file-pdf-outline'} size={30} color={'red'}/>
                              </View>
                              <View style={{flex : 1, marginLeft : 15, paddingRight : 0.025*getConstant('width')}}>
                                <View style={{flex : 0.5, justifyContent : 'flex-end', alignItems: 'flex-start', paddingBottom : 5}}>
                                    <Text style={setFont('200', 14, 'black', 'Regular')} >Descriptif du produit</Text>
                                </View>
                                <View style={{flex : 0.5, justifyContent : 'flex-start', alignItems: 'flex-start', borderBottomWidth : 1, borderBottomColor : 'lightgray'}}>
                                    <Text style={setFont('200', 10)} >Notice marketing</Text>
                                </View>
                              </View>
  
                        </TouchableOpacity>

              </View>





              </View>
           </View>
          );

}




