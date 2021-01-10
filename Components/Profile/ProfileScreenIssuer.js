import React, { useState, useRef} from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert } from 'react-native';
import { globalStyle, setFont, setColor} from '../../Styles/globalStyle';
import { getConstant } from '../../Utils/';

import { updateUser } from '../../API/APIAWS';

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


import Numeral from 'numeral';
import 'numeral/locales/fr';




function _renderIssuers(issuers, user, firebase) {
    const [toto, setToto] = useState(true);
    return (
        <View style={{borderWidth : 0}}>
          {
          issuers.map((issuer, index) => {
           
                return (
                  <View style={{flexDirection : 'row', marginTop : index === 0 ? 10 : 5, marginBottom : 5, marginLeft : 10, marginRight : 10, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 5, paddingBottom : 0, justifyContent : 'space-between'}} key={index}>
                      <View style={{flexDirection : 'column', flex : 0.6, marginLeft : 10, borderWidth : 0}}>
                          <View style={{ height : 30, borderWidth : 0, marginTop : 10}}>
                              <Image style={{flex : 1,  borderWidth : 0}} source={{uri : issuer.icon}} resizeMode={'contain'}/>
                          </View>
                          <View style={{ padding : 5, paddingTop : 10, borderWidth : 0}}>
                              <Text style={setFont('200', 10, 'gray')}>
                                {issuer.name}
                              </Text>
                          </View>
                      </View>
                      <TouchableOpacity style={{padding : 2,flex : .4,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}
                                        onPress={() => {
                                            if (user.isIssuerRejected(issuer.id)) {
                                              //on ajoute l'issuer
                                              Alert.alert(
                                                'Ajouter émetteur',
                                                "Confirmez-vous l'ajout de " + issuer.name+ " ?",
                                                [
                                                 // {text: 'Confirmer', onPress: () => this._signOutAsync()},
                                                 {text: 'Confirmer', onPress: () => {
                                                        user.removeIssuerAsRejected(issuer.id);
                                                        updateUser(firebase, user);
                                                        setToto(!toto); //force re-render
                                                    }       
                                                },
                                                  {text: 'Annuler', onPress: () => 'non et non'},
                                                ],
                                                {
                                                  cancelable: true,
                                                  onDismiss: () => 'no',
                                                },
                                              );
                                              
                                            } else {
                                               
                                                if((issuers.length - 1) === user.getIssuersRejectedCount()) {
                                                    Alert.alert(
                                                      'ALERTE',
                                                      "Vous n'aurez plus d'émetteur disponible et ne pourrez donc plus passer d'ordre et traiter ?",
                                                      [
                                                      // {text: 'Confirmer', onPress: () => this._signOutAsync()},
                                                      {text: 'Confirmer', onPress: () => {
                                                            Alert.alert(
                                                              'Retirer émetteur',
                                                              "Confirmez-vous le retrait de " + issuer.name+ " ?",
                                                              [
                                                              // {text: 'Confirmer', onPress: () => this._signOutAsync()},
                                                              {text: 'Confirmer', onPress: () => {
                                                                  user.setIssuerAsRejected(issuer.id);
                                                                  updateUser(firebase, user);
                                                                  setToto(!toto); //force re-render
                                                                }
                                                              },
                                                                {text: 'Annuler', onPress: () => 'non et non'},
                                                              ],
                                                              {
                                                                cancelable: true,
                                                                onDismiss: () => 'no',
                                                              },
                                                            );
                                                      }},
                                                        {text: 'Annuler', onPress: () => 'non et non'},
                                                      ],
                                                      {
                                                        cancelable: true,
                                                        onDismiss: () => 'no',
                                                      },
                                                    );

                                              } else {
                                                Alert.alert(
                                                    'Retirer émetteur',
                                                    "Confirmez-vous le retrait de " + issuer.name+ " ?",
                                                    [
                                                    // {text: 'Confirmer', onPress: () => this._signOutAsync()},
                                                    {text: 'Confirmer', onPress: () => {
                                                        user.setIssuerAsRejected(issuer.id);
                                                        updateUser(firebase, user);
                                                        setToto(!toto); //force re-render
                                                      }
                                                    },
                                                      {text: 'Annuler', onPress: () => 'non et non'},
                                                    ],
                                                    {
                                                      cancelable: true,
                                                      onDismiss: () => 'no',
                                                    },
                                                  );
                                              }
 
                                              
                                            }

                                            
                                        }}
                      >
                          <MaterialCommunityIcons name={user.isIssuerRejected(issuer.id) ? 'checkbox-blank-circle-outline' : 'check-circle-outline'} color={user.isIssuerRejected(issuer.id) ? 'gray' : 'green'} size={25}/>
                      </TouchableOpacity>
                  </View>
                )

              })
          }
        
        </View>
      );
}


export default function ProfileScreenIssuer ({navigation} ) {

    
        const issuers = navigation.getParam('issuers');
        const firebase = navigation.getParam('firebase');
        const user = navigation.getParam('user');

        return (
            <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>
            <View style={{height: getConstant('height')  , backgroundColor : setColor('background'), }}> 
                <View style={{flexDirection : 'row', height : 45, borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''), padding : 5, paddingRight : 15, paddingLeft : 15}}>
                                  <TouchableOpacity style={{ flex : 0.3, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                                    onPress={() => navigation.goBack()}
                                  >
                                      
                                          <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                      
                                  </TouchableOpacity>
                                  <View style={{flex : 0.4, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                                    <Text style={setFont('400', 22, 'white', 'Regular')}>
                                     Emetteurs
                                    </Text>
                                  </View>
                                  <View style={{ flex : 0.3, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}>
               
                                  </View>
                </View>
      
               <ScrollView style={{flex : 1}}>
                    <View style={{marginBottom : 0,  marginTop : 0, marginLeft : 0 ,
                                    width : 1.00*getConstant('width'),
                                    height : 1.00*getConstant('height'),
                                    backgroundColor: 'white', 
                                    borderWidth : 1,
                                    borderColor : 'white', 
                                    borderRadius : 10, 
                                    shadowColor: 'rgb(75, 89, 101)', 
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.3
                    }}>
                        <View style={{justifyContent: "space-between", alignItems: 'flex-start', marginTop : 15, marginBottom : 5, marginLeft : 0, padding : 0, paddingLeft : 20, paddingRight : 20,  borderWidth : 1, borderColor : 'white', borderRadius : 20}}>
                                <Text style={setFont('400', 12, 'black', 'Regular')}>
                                Liste de émetteurs qui vous seront proposés :
                                </Text>
                        </View>
                        {_renderIssuers(issuers, user, firebase)}      
                    </View>
                    <View style={{height : 200}} />
                </ScrollView>
      
            </View>
            </SafeAreaView>
          );
}




