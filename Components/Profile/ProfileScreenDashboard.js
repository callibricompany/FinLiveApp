import React, { useState, useRef} from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { globalStyle, setFont, setColor} from '../../Styles/globalStyle';
import { getConstant, isAndroid } from '../../Utils/';

import { updateUser } from '../../API/APIAWS';

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


import Numeral from 'numeral';
import 'numeral/locales/fr';

export default function ProfileScreenDashboard ({navigation} ) {



        return (
            <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>
            <View style={{height: getConstant('height')  , backgroundColor : setColor('background'), }}> 
                <View style={{flexDirection : 'row', borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''), padding : 5, paddingRight : 15, paddingLeft : 15, height : 45}}>
                                  <TouchableOpacity style={{ flex : 0.2, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                                    onPress={() => navigation.goBack()}
                                  >
                                      
                                          <Ionicons name={'md-arrow-back'} size={25} color={'white'}/>
                      
                                  </TouchableOpacity>
                                  <View style={{flex : 0.6, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                                    <Text style={setFont('400', 18, 'white', 'Regular')}>
                                     Tableau de bord
                                    </Text>
                                  </View>
                                  <View style={{ flex : 0.2, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}>
               
                                  </View>
                </View>
      
                <ScrollView style={{flex : 1}}>              
                      <View style={{flexDirection : 'row', marginTop : 30, marginLeft : getConstant('width')*0.025, marginRight : getConstant('width')*0.025, height : getConstant('width')*0.95/3 -10}}>
                            <View style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, justifyContent : 'space-between',
                                              marginLeft : 5,  
                                              //marginRight :0, 
                                              marginBottom: 5, 
                                              //backgroundColor:  this.request.isActivated('isMemory') ? 'white' : setColor('') ,
                                              borderRadius : 10,
                                              shadowColor: setColor('shadow'),
                                              shadowOffset: { width: 0, height: 2 },
                                              shadowOpacity: 0.3,
                                              borderWidth : 1,
                                              borderColor : isAndroid() ? 'lightgray' :  'white',        
                                        }}>
                                <View style={{paddingLeft : 5, paddingRight : 5, paddingTop : 5,}}>
                                    <Text style={setFont('200', 18, 'gray')}>
                                      Placements Privés
                                    </Text>
                                </View>
                                <View style={{paddingLeft : 5, paddingRight : 5, paddingBottom : 5, borderWidth :0}}>
                                    <Text style={setFont('200', 22, setColor('granny'), 'Regular')}>
                                      8
                                    </Text>
                                    <Text style={setFont('200', 14, 'gray', 'Regular')}>
                                      2 300 400 €
                                    </Text>
                                </View>

                            </View>
                            <View style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, marginLeft : 10, justifyContent : 'space-between',
                                              marginLeft : 5,  
                                              //marginRight :0, 
                                              marginBottom: 5, 
                                              //backgroundColor:  this.request.isActivated('isMemory') ? 'white' : setColor('') ,
                                              borderRadius : 10,
                                              shadowColor: setColor('shadow'),
                                              shadowOffset: { width: 0, height: 2 },
                                              shadowOpacity: 0.3,
                                              borderWidth : 1,
                                              borderColor : isAndroid() ? 'lightgray' :  'white',        
                                        }}>
                                <TouchableOpacity style={{padding : 5}}
                        
                                >
                                    <Text style={setFont('200', 18, 'gray')}>
                                      A.P.E.
                                    </Text>
                                </TouchableOpacity>
                                <View style={{padding : 5, borderWidth :0}}>
                                    <Text style={setFont('200', 22, 'red', 'Regular')}>
                                      2
                                    </Text>
                                    <Text style={setFont('200', 14, 'gray', 'Regular')}>
                                      900 000 €
                                    </Text>
                                </View>
                            </View>
                            <View style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, marginLeft : 10, justifyContent : 'space-between',
                                              marginLeft : 5,  
                                              //marginRight :0, 
                                              marginBottom: 5, 
                                              //backgroundColor:  this.request.isActivated('isMemory') ? 'white' : setColor('') ,
                                              borderRadius : 10,
                                              shadowColor: setColor('shadow'),
                                              shadowOffset: { width: 0, height: 2 },
                                              shadowOpacity: 0.3,
                                              borderWidth : 1,
                                              borderColor : isAndroid() ? 'lightgray' :  'white',        
                                        }}>
                                <View style={{padding : 5}}>
                                    <Text style={setFont('200', 18, 'gray')}>
                                      Pricings
                                    </Text>
                                </View>
                                <View style={{padding : 5, borderWidth :0}}>
                                    <Text style={setFont('200', 22, 'black', 'Regular')}>
                                      542
                                    </Text>
                                    <Text style={setFont('200', 14, 'gray', 'Regular')}>
                                      
                                    </Text>
                                </View>

                            </View>
                      </View>

                      <View style={{flexDirection : 'row', marginTop : 10, marginLeft : getConstant('width')*0.025, marginRight : getConstant('width')*0.025, height : getConstant('width')*0.95/3 -10}}>
                            <View style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, justifyContent : 'space-between',
                                              marginLeft : 5,  
                                              //marginRight :0, 
                                              marginBottom: 5, 
                                              //backgroundColor:  this.request.isActivated('isMemory') ? 'white' : setColor('') ,
                                              borderRadius : 10,
                                              shadowColor: setColor('shadow'),
                                              shadowOffset: { width: 0, height: 2 },
                                              shadowOpacity: 0.3,
                                              borderWidth : 1,
                                              borderColor : isAndroid() ? 'lightgray' :  'white',        
                                        }}>
                                <View style={{paddingLeft : 5, paddingRight : 5, paddingTop : 5,}}>
                                    <Text style={setFont('200', 18, 'gray')}>
                                      Emetteurs Autorisés
                                    </Text>
                                </View>
                                <View style={{paddingLeft : 5, paddingRight : 5, paddingBottom : 5, borderWidth :0}}>
                                    <Text style={setFont('200', 22, 'black', 'Regular')}>
                                     1
                                    </Text>

                                </View>

                            </View>

                       </View>      
                  </ScrollView>

      
            </View>
            </SafeAreaView>
          );
}




